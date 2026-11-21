// Rules adapted from UiTM PlayZone's 2048, Block and progressive Memory engines.
export function seededRandom(seed) {
  let state = (seed >>> 0) || 0x6d2b79f5;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}

// Also reports where each tile went (`moves`: from → to) and which cells hold a merge (`merged`),
// so the page can slide tiles; the board and score are unchanged by that bookkeeping.
export function moveBoard(board, direction) {
  const next = Array(16).fill(0);
  const moves = [], merged = [];
  let score = 0;
  const index = (line, offset) => direction === 'left' ? line * 4 + offset : direction === 'right' ? line * 4 + 3 - offset : direction === 'up' ? offset * 4 + line : (3 - offset) * 4 + line;
  for (let line = 0; line < 4; line++) {
    const tiles = [];
    for (let offset = 0; offset < 4; offset++) { const at = index(line, offset); if (board[at]) tiles.push({ value: board[at], at }); }
    let target = 0;
    for (let i = 0; i < tiles.length; i++, target++) {
      const to = index(line, target);
      if (tiles[i].value === tiles[i + 1]?.value) {
        const value = tiles[i].value * 2;
        next[to] = value; score += value; merged.push(to);
        moves.push({ from: tiles[i].at, to }, { from: tiles[i + 1].at, to });
        i++;
      } else {
        next[to] = tiles[i].value;
        moves.push({ from: tiles[i].at, to });
      }
    }
  }
  return { board: next, score, changed: next.some((value, i) => value !== board[i]), moves, merged };
}
export const canMove = (board) => board.some((value, i) => value === 0 || (i % 4 < 3 && value === board[i + 1]) || (i < 12 && value === board[i + 4]));
function spawn(board, random) {
  const empty = board.flatMap((value, index) => value === 0 ? [index] : []);
  if (!empty.length) return [...board];
  const next = [...board], index = empty[Math.floor(random() * empty.length)];
  next[index] = random() < .9 ? 2 : 4;
  return next;
}
export class Game2048 {
  constructor(seed) { this.random = seededRandom(seed); this.score = 0; this.moves = 0; this.won = false; this.continued = false; this.over = false; this.board = spawn(spawn(Array(16).fill(0), this.random), this.random); }
  move(direction) {
    if (this.over || (this.won && !this.continued) || this.moves >= 10000) return false;
    const result = moveBoard(this.board, direction);
    if (!result.changed) return false;
    this.board = spawn(result.board, this.random); this.score += result.score; this.moves++;
    if (this.board.some(value => value >= 2048)) this.won = true;
    if (!canMove(this.board) || this.moves >= 10000) this.over = true;
    return true;
  }
}

export const shapes = [
  [[0, 0]], [[0, 0], [1, 0]], [[0, 0], [0, 1]], [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [1, 1]], [[0, 0], [1, 0], [2, 0], [1, 1]],
];
export class BlockGame {
  constructor(seed) { this.random = seededRandom(seed); this.board = Array(64).fill(0); this.score = 0; this.lines = 0; this.streak = 0; this.over = false; this.placements = 0; this.refill(); }
  refill() { this.tray = Array.from({ length: 3 }, () => shapes[Math.floor(this.random() * shapes.length)].map(cell => [...cell])); }
  fits(shape, row, column) { return Boolean(shape?.length && Number.isInteger(row) && Number.isInteger(column) && shape.every(([x, y]) => row + y >= 0 && row + y < 8 && column + x >= 0 && column + x < 8 && !this.board[(row + y) * 8 + column + x])); }
  fitsAnywhere(shape) { return Boolean(shape) && Array.from({ length: 64 }, (_, i) => i).some(i => this.fits(shape, Math.floor(i / 8), i % 8)); }
  canContinue() { return this.tray.some(shape => this.fitsAnywhere(shape)); }
  place(piece, row, column) {
    const shape = this.tray[piece];
    if (this.over || !this.fits(shape, row, column)) return false;
    const placed = shape.map(([x, y]) => (row + y) * 8 + column + x);
    for (const i of placed) this.board[i] = 1;
    this.score += shape.length; this.tray[piece] = undefined; this.placements++;
    const rows = Array.from({ length: 8 }, (_, r) => r).filter(r => this.board.slice(r * 8, r * 8 + 8).every(Boolean));
    const columns = Array.from({ length: 8 }, (_, c) => c).filter(c => Array.from({ length: 8 }, (_, r) => this.board[r * 8 + c]).every(Boolean));
    const lines = rows.length + columns.length;
    // 10 a line, +10 for each extra line cleared at once, and a streak bonus for clearing on
    // consecutive placements: +5 per earlier clear in the streak, at most +50.
    const linePoints = lines * 10, multiBonus = Math.max(0, lines - 1) * 10, streakBonus = lines ? Math.min(50, this.streak * 5) : 0;
    this.streak = lines ? this.streak + 1 : 0;
    this.lines += lines; this.score += linePoints + multiBonus + streakBonus;
    const cleared = this.board.flatMap((_, i) => rows.includes(Math.floor(i / 8)) || columns.includes(i % 8) ? [i] : []);
    // What this placement did, so the page can animate it; the rules above don't depend on it.
    this.lastMove = { placed, rows, columns, cleared, streak: this.streak, bonus: multiBonus + streakBonus, points: shape.length + linePoints + multiBonus + streakBonus };
    for (const i of cleared) this.board[i] = 0;
    if (this.tray.every(item => !item)) this.refill();
    if (!this.canContinue() || this.placements >= 10000) this.over = true;
    return true;
  }
}

export const pairsForLevel = (level) => Math.min(12, level + 3);
export const limitForLevel = (level) => Math.max(25, pairsForLevel(level) * 8 - Math.floor((level - 1) / 4) * 2) * 1000;
export class MemoryGame {
  constructor(seed) { this.seed = seed; this.level = 1; this.score = 0; this.completedScore = 0; this.highestCompleted = 0; this.totalMoves = 0; this.over = false; this.enterLevel(); }
  enterLevel() {
    const pairs = pairsForLevel(this.level), random = seededRandom((this.seed + this.level) >>> 0);
    this.deck = Array.from({ length: pairs * 2 }, (_, i) => i % pairs);
    for (let i = this.deck.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]; }
    this.matched = Array(this.deck.length).fill(false); this.revealed = []; this.moves = 0; this.pairs = 0; this.timeLeft = limitForLevel(this.level);
  }
  flip(index) {
    if (this.over || !Number.isInteger(index) || index < 0 || index >= this.deck.length || this.revealed.length === 2 || this.matched[index] || this.revealed.includes(index)) return false;
    this.revealed.push(index);
    if (this.revealed.length === 2) {
      this.moves++; this.totalMoves++;
      const [a, b] = this.revealed;
      if (this.deck[a] === this.deck[b]) { this.matched[a] = this.matched[b] = true; this.revealed = []; this.pairs++; }
      this.score = this.completedScore + Math.max(0, this.pairs * 100 - Math.max(0, this.moves - this.pairs) * 10);
      if (this.pairs === pairsForLevel(this.level)) { this.highestCompleted = this.level; this.completedScore = this.score + this.level * 50; this.score = this.completedScore; this.level++; this.enterLevel(); }
    }
    return true;
  }
  settle() { if (this.revealed.length === 2) this.revealed = []; }
}
