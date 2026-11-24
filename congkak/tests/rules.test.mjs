import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AI, PLAYER, STORE, TOTAL, LEVELS, newGame, clone, play, legalMoves, nextPos, chooseMove, roundPoints, winner,
} from '../js/rules.js';

const total = (s) => s.holes.reduce((a, b) => a + b, 0) + s.stores[0] + s.stores[1];
const board = (holes, stores = [0, 0], turn = PLAYER) => ({ holes, stores, turn, over: false });
function seeded(seed = 7) {
  let a = seed;
  return () => ((a = (a * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

test('a new round has 7 marbles in each of the 14 holes', () => {
  const s = newGame();
  assert.equal(total(s), TOTAL);
  assert.deepEqual(legalMoves(s, PLAYER), [0, 1, 2, 3, 4, 5, 6]);
  assert.deepEqual(legalMoves(s, AI), [7, 8, 9, 10, 11, 12, 13]);
});

test('sowing goes round the board and skips the opponent\'s store', () => {
  assert.equal(nextPos(5, PLAYER), 6);
  assert.equal(nextPos(6, PLAYER), STORE[PLAYER]);
  assert.equal(nextPos(STORE[PLAYER], PLAYER), 7);
  assert.equal(nextPos(13, PLAYER), 0); // past the AI's store
  assert.equal(nextPos(6, AI), 7); // past the player's store
  assert.equal(nextPos(13, AI), STORE[AI]);
  assert.equal(nextPos(STORE[AI], AI), 0);
});

test('the last marble in your own store gives another turn', () => {
  // Hole 4 has 3: 5, 6, store.
  const s = board([0, 0, 0, 0, 3, 0, 0, 1, 1, 1, 1, 1, 1, 1]);
  const events = play(s, 4, true);
  assert.equal(s.stores[PLAYER], 1);
  assert.equal(s.turn, PLAYER);
  assert.deepEqual(events.map((e) => e.type), ['pickup', 'drop', 'drop', 'drop']);
  assert.deepEqual(events.map((e) => e.inHand ?? e.count), [3, 2, 1, 0]);
});

test('landing in a hole that already has marbles picks them up and keeps sowing', () => {
  // Hole 0 has 1 → hole 1 (now 3) → pick up 3 → 2, 3, 4 (empty, own; opposite 9 empty) → turn passes.
  const s = board([1, 2, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1]);
  const events = play(s, 0, true);
  assert.deepEqual(events.filter((e) => e.type === 'pickup').map((e) => [e.at, e.count]), [[0, 1], [1, 3]]);
  assert.deepEqual(s.holes.slice(0, 7), [0, 0, 1, 1, 1, 0, 0]);
  assert.equal(s.turn, AI);
});

test('ending in your own empty hole captures it and the hole opposite (tembak)', () => {
  // Hole 1 has 1 → hole 2 (empty, own). Opposite of 2 is 11, with 5.
  const s = board([0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 5, 1, 1]);
  const events = play(s, 1, true);
  assert.equal(s.holes[2], 0);
  assert.equal(s.holes[11], 0);
  assert.equal(s.stores[PLAYER], 6);
  assert.equal(events.filter((e) => e.type === 'capture').length, 6);
  assert.equal(s.turn, AI);
});

test('an empty own hole with nothing opposite captures nothing', () => {
  const s = board([0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1]);
  play(s, 1);
  assert.equal(s.holes[2], 1);
  assert.equal(s.stores[PLAYER], 0);
});

test('a row running empty ends the round and sweeps the rest to its owner', () => {
  // The player's only marble reaches the store: their row is empty, the AI keeps its 7.
  const s = board([0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], [40, 49]);
  const events = play(s, 6, true);
  assert.equal(s.over, true);
  assert.deepEqual(s.stores, [41, 56]);
  assert.equal(events.filter((e) => e.type === 'sweep').length, 7);
  assert.equal(winner(s), AI);
});

test('illegal moves change nothing', () => {
  const s = newGame();
  assert.deepEqual(play(s, 9, true), []); // the AI's hole on the player's turn
  const empty = board([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  assert.deepEqual(play(empty, 0, true), []);
  assert.deepEqual(newGame(), s);
});

test('marbles are never lost, over many random games at every level', () => {
  const random = seeded(3);
  for (const level of Object.keys(LEVELS)) {
    for (let g = 0; g < 4; g++) {
      const s = newGame(g % 2);
      let turns = 0;
      while (!s.over && turns++ < 400) {
        const move = s.turn === AI ? chooseMove(s, level, random) : legalMoves(s)[Math.floor(random() * legalMoves(s).length)];
        assert.ok(legalMoves(s).includes(move), `${level}: legal move`);
        const events = play(s, move, true);
        assert.equal(total(s), TOTAL);
        // Every step of the animation accounts for all 98: on the board, or in the hand.
        for (const e of events) {
          const hand = e.type === 'pickup' ? e.count : e.type === 'drop' ? e.inHand : 0;
          assert.equal(total(e.state) + hand, TOTAL, `${level}: ${e.type}`);
        }
      }
      assert.ok(s.over, `${level} game ${g} ended`);
    }
  }
});

test('the events replay the move exactly: each drop adds one marble where it says', () => {
  const s = newGame();
  const before = clone(s);
  const events = play(s, 3, true);
  let last = before;
  for (const e of events) {
    if (e.type === 'drop') {
      const at = (st) => (e.at < 14 ? st.holes[e.at] : st.stores[e.at - 14]);
      assert.equal(at(e.state), at(last) + 1);
    }
    last = e.state;
  }
  assert.deepEqual(events.at(-1).state, { holes: s.holes, stores: s.stores });
});

test('Pakar always takes a capture worth more than any other move', () => {
  // AI hole 12 (1 marble) lands in its empty hole 13, opposite the player's 0 with 9 marbles.
  const s = board([9, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0], [10, 10], AI);
  s.holes[7] = 2;
  assert.equal(chooseMove(s, 'pakar', seeded()), 12);
});

test('points: nothing for a loss or draw, 55–100% of the level maximum for a win', () => {
  const win = { holes: Array(14).fill(0), stores: [60, 38], turn: 0, over: true };
  for (const [level, { max }] of Object.entries(LEVELS)) {
    const pts = roundPoints(win, level);
    assert.ok(pts >= max * 0.55 && pts <= max, `${level}: ${pts}`);
  }
  assert.equal(roundPoints({ ...win, stores: [98, 0] }, 'pakar'), 1000);
  assert.equal(roundPoints({ ...win, stores: [49, 49] }, 'pakar'), 0);
  assert.equal(roundPoints({ ...win, stores: [40, 58] }, 'pakar'), 0);
  assert.equal(roundPoints({ ...win, over: false }, 'pakar'), 0);
});
