// Congkak rules and AI. Pure functions on plain state, so they are unit-tested (tests/rules.test.mjs)
// and the 3D scene only replays the events a move records.
//
// Board: 7 holes a side, 7 marbles each (98 in all), and a store (rumah) at each end.
//   holes 0–6   the player's row, right to left (nearest the player)
//   holes 7–13  the AI's row, left to right (13 is opposite 0)
//   14          the player's store, at the left end · 15 the AI's store, at the right end
// Sowing goes player's row → player's store → AI's row → AI's store (clockwise, seen from the
// player's side), skipping the opponent's store.
// Last marble:
//   in your own store            → you go again;
//   in a hole that now holds >1  → pick them all up and keep sowing (berjalan);
//   in your own empty hole       → it and the marbles in the hole opposite go to your store (tembak),
//                                  if that hole has any; then the turn passes.
// When either row is empty, every marble left goes to its row owner's store and the round ends.

export const HOLES = 7;
export const START = 7;
export const TOTAL = HOLES * 2 * START; // 98
export const PLAYER = 0;
export const AI = 1;
export const STORE = [14, 15];
const MAX_DROPS = 2000; // a safety stop; real moves are far shorter

export const LEVELS = {
  mudah: { name: 'Mudah', depth: 0, width: 1, max: 100 },
  sederhana: { name: 'Sederhana', depth: 1, width: 3, max: 500 },
  susah: { name: 'Susah', depth: 2, width: 5, max: 800 },
  pakar: { name: 'Pakar', depth: 4, width: 1, max: 1000 },
};

export function newGame(turn = PLAYER) {
  return { holes: Array(HOLES * 2).fill(START), stores: [0, 0], turn, over: false };
}

export const clone = (s) => ({ holes: s.holes.slice(), stores: s.stores.slice(), turn: s.turn, over: s.over });
export const isOwn = (i, p) => i >= 0 && i < 14 && (p === PLAYER ? i < 7 : i >= 7);
export const opposite = (i) => 13 - i;
export const count = (s, i) => (i < 14 ? s.holes[i] : s.stores[i - 14]);

/** Holes player `p` may sow from. */
export function legalMoves(s, p = s.turn) {
  const out = [];
  for (let i = p * 7; i < p * 7 + 7; i++) if (s.holes[i] > 0) out.push(i);
  return out;
}

/** The next place a marble goes from `pos` when player `p` sows. */
export function nextPos(pos, p) {
  let next = pos === 6 ? 14 : pos === 14 ? 7 : pos === 13 ? 15 : pos === 15 ? 0 : pos + 1;
  if (next === STORE[1 - p]) next = next === 15 ? 0 : 7;
  return next;
}

const snap = (s) => ({ holes: s.holes.slice(), stores: s.stores.slice() });

/** Ends the round if a row is empty: each remaining marble goes to its row owner's store. */
function sweepIfDone(s, events) {
  if (s.holes.slice(0, 7).some(Boolean) && s.holes.slice(7).some(Boolean)) return;
  for (let i = 0; i < 14; i++) {
    while (s.holes[i] > 0) {
      s.holes[i]--;
      const owner = i < 7 ? PLAYER : AI;
      s.stores[owner]++;
      events?.push({ type: 'sweep', from: i, to: STORE[owner], player: owner, state: snap(s) });
    }
  }
  s.over = true;
}

/**
 * Plays hole `origin` for the player whose turn it is, changing `s`. With `record`, returns the
 * events for the animation, each with the board after it:
 *   pickup {at, count}  ·  drop {at, inHand}  ·  capture {from, to}  ·  sweep {from, to}
 * `inHand` is how many marbles are left in the hand after that drop.
 */
export function play(s, origin, record = false) {
  const p = s.turn;
  const events = record ? [] : null;
  if (s.over || !isOwn(origin, p) || !s.holes[origin]) return events ?? [];
  let hand = s.holes[origin];
  let pos = origin;
  s.holes[origin] = 0;
  events?.push({ type: 'pickup', at: origin, count: hand, player: p, state: snap(s) });
  let drops = 0;
  while (hand > 0 && drops++ < MAX_DROPS) {
    pos = nextPos(pos, p);
    if (pos < 14) s.holes[pos]++;
    else s.stores[pos - 14]++;
    hand--;
    events?.push({ type: 'drop', at: pos, inHand: hand, player: p, state: snap(s) });
    if (hand > 0) continue;
    if (pos === STORE[p]) break; // another turn
    if (pos < 14 && s.holes[pos] > 1) {
      hand = s.holes[pos];
      s.holes[pos] = 0;
      events?.push({ type: 'pickup', at: pos, count: hand, player: p, state: snap(s) });
      continue;
    }
    if (isOwn(pos, p) && s.holes[opposite(pos)] > 0) {
      // Tembak: one marble at a time, so the store fills up visibly.
      s.holes[pos] = 0;
      s.stores[p]++;
      events?.push({ type: 'capture', from: pos, to: STORE[p], player: p, state: snap(s) });
      const opp = opposite(pos);
      while (s.holes[opp] > 0) {
        s.holes[opp]--;
        s.stores[p]++;
        events?.push({ type: 'capture', from: opp, to: STORE[p], player: p, state: snap(s) });
      }
    }
    s.turn = 1 - p;
  }
  if (drops >= MAX_DROPS) s.turn = 1 - p;
  sweepIfDone(s, events);
  return events ?? [];
}

/** How good `s` is for player `p` (higher is better). */
function evaluate(s, p) {
  if (s.over) return (s.stores[p] - s.stores[1 - p]) * 120;
  const sum = (from) => s.holes.slice(from, from + 7).reduce((a, b) => a + b, 0);
  const filled = (from) => s.holes.slice(from, from + 7).filter(Boolean).length;
  const mine = p * 7, theirs = (1 - p) * 7;
  return (s.stores[p] - s.stores[1 - p]) * 14 + (sum(mine) - sum(theirs)) * 0.65 + (filled(mine) - filled(theirs)) * 0.4;
}

function search(s, depth, me, alpha = -1e9, beta = 1e9) {
  if (depth <= 0 || s.over) return evaluate(s, me);
  const moves = legalMoves(s);
  if (!moves.length) return evaluate(s, me);
  const maximizing = s.turn === me;
  let best = maximizing ? -1e9 : 1e9;
  for (const i of moves) {
    const child = clone(s);
    play(child, i);
    const value = search(child, depth - 1, me, alpha, beta);
    if (maximizing) { best = Math.max(best, value); alpha = Math.max(alpha, best); }
    else { best = Math.min(best, value); beta = Math.min(beta, best); }
    if (beta <= alpha) break;
  }
  return best;
}

/**
 * The AI's hole for `level`: Mudah plays at random; the others look `depth` moves ahead and pick
 * among the best `width` (Susah takes the best one most of the time, Pakar always).
 * `random` is injectable for tests.
 */
export function chooseMove(s, level = 'mudah', random = Math.random) {
  const options = legalMoves(s, AI);
  if (!options.length) return -1;
  const { depth, width } = LEVELS[level] ?? LEVELS.mudah;
  if (depth === 0) return options[Math.floor(random() * options.length)];
  const ranked = options.map((i) => {
    const next = clone(s);
    play(next, i);
    return { i, value: search(next, depth - 1, AI) + (next.turn === AI ? 2 : 0) };
  }).sort((a, b) => b.value - a.value);
  const top = Math.min(ranked.length, width);
  const pick = level === 'susah' && random() < 0.87 ? 0 : Math.floor(random() * top);
  return ranked[pick].i;
}

/**
 * Points for a finished round: nothing for a loss or a draw; a win earns 55–100% of the level's
 * maximum, more for more marbles in the player's store.
 */
export function roundPoints(s, level) {
  const { max } = LEVELS[level] ?? LEVELS.mudah;
  if (!s.over || s.stores[PLAYER] <= s.stores[AI]) return 0;
  return Math.max(1, Math.round(max * (0.55 + (0.45 * s.stores[PLAYER]) / TOTAL)));
}

export const winner = (s) => (s.stores[PLAYER] === s.stores[AI] ? -1 : s.stores[PLAYER] > s.stores[AI] ? PLAYER : AI);
