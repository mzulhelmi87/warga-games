import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Game2048, BlockGame, MemoryGame, moveBoard, canMove, shapes, limitForLevel } from '../shared/puzzle-engines.js';

test('2048 merges equal tiles once and accumulates points', () => {
  const result = moveBoard([2, 2, 2, 2, ...Array(12).fill(0)], 'left');
  assert.deepEqual(result.board.slice(0, 4), [4, 4, 0, 0]);
  assert.equal(result.score, 8);
  const game = new Game2048(42);
  assert.equal(game.board.filter(Boolean).length, 2);
});

test('block game places a piece, clears a line and rejects overlap', () => {
  const game = new BlockGame(1);
  game.board.fill(0);
  game.board.splice(0, 7, ...Array(7).fill(1));
  game.tray = [[[0, 0]], undefined, undefined];
  assert.equal(game.place(0, 0, 7), true);
  assert.equal(game.lines, 1);
  assert.equal(game.score, 11);
  assert.equal(game.board.slice(0, 8).every(value => value === 0), true);
});

test('memory game matches pairs and advances after a full deck', () => {
  const game = new MemoryGame(1);
  for (let value = 0; value < 4; value++) {
    const cells = game.deck.flatMap((card, i) => card === value ? [i] : []);
    assert.equal(game.flip(cells[0]), true);
    assert.equal(game.flip(cells[1]), true);
  }
  assert.equal(game.highestCompleted, 1);
  assert.equal(game.level, 2);
  assert.equal(game.score, 450);
});

// The hub's arked_record limits (docs/arcade-integration.md) rest on these per-action bounds.
test('2048 ends when no tile can move, and a greedy player averages well under 50 points a move', () => {
  assert.equal(canMove([2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2]), false);
  assert.equal(canMove([2, 2, 4, 8, ...Array(12).fill(16).map((v, i) => v * 2 ** (i % 4) + i * 1024)]), true);
  for (let seed = 1; seed <= 20; seed++) {
    const game = new Game2048(seed);
    while (!game.over) {
      if (game.won) game.continued = true;
      const best = ['left', 'down', 'right', 'up']
        .map(direction => ({ direction, ...moveBoard(game.board, direction) }))
        .filter(option => option.changed)
        .sort((a, b) => b.score - a.score)[0];
      if (!best) break;
      game.move(best.direction);
    }
    assert.ok(game.score / game.moves < 50, `seed ${seed}: ${game.score} in ${game.moves} moves`);
  }
});

test('a five-line clear scores the cells, the lines and the multi-line bonus, and a full board ends the game', () => {
  // Full lines clear at once, so a placement can only complete lines through its own cells.
  // The T piece spans 3 columns and 2 rows: 4 cells + 5 lines × 10 + 4 extra lines × 10 = 94.
  const tee = shapes.find(shape => shape.length === 4 && new Set(shape.map(([x]) => x)).size === 3);
  const game = new BlockGame(1);
  game.board.fill(0);
  for (let i = 0; i < 64; i++) if (Math.floor(i / 8) < 2 || i % 8 < 3) game.board[i] = 1;
  for (const [x, y] of tee) game.board[y * 8 + x] = 0;
  game.tray = [tee, undefined, undefined];
  assert.equal(game.place(0, 0, 0), true);
  assert.equal(game.lines, 5);
  assert.equal(game.score, 94);
  const full = new BlockGame(2);
  full.board.fill(1);
  assert.equal(full.canContinue(), false);
  assert.equal(full.fitsAnywhere([[0, 0]]), false);
});

test('clearing on consecutive placements adds a streak bonus of 5 per earlier clear, up to 50', () => {
  const game = new BlockGame(3);
  const clearRow = () => {
    game.board.fill(0);
    game.board.splice(0, 7, ...Array(7).fill(1));
    game.tray = [[[0, 0]], [[0, 0]], [[0, 0]]];
    game.place(0, 0, 7);
    return game.lastMove;
  };
  assert.deepEqual([clearRow(), clearRow(), clearRow()].map(m => [m.streak, m.points]), [[1, 11], [2, 16], [3, 21]]);
  for (let i = 0; i < 12; i++) clearRow();
  assert.equal(clearRow().points, 1 + 10 + 50);
  game.board.fill(0); game.tray = [[[0, 0]], [[0, 0]], [[0, 0]]];
  game.place(0, 4, 4);
  assert.equal(game.streak, 0, 'a placement without a clear ends the streak');
});

test('a greedy block player averages well under 20 points a placement', () => {
  for (let seed = 1; seed <= 12; seed++) {
    const game = new BlockGame(seed);
    while (!game.over && game.placements < 400) {
      let pick = null, best = -1;
      for (let p = 0; p < 3; p++) for (let i = 0; i < 64; i++) {
        if (!game.fits(game.tray[p], Math.floor(i / 8), i % 8)) continue;
        // Score this placement on a copy of the board (cells + full lines through it).
        const board = game.board.slice(), cells = game.tray[p].map(([x, y]) => (Math.floor(i / 8) + y) * 8 + i % 8 + x);
        for (const c of cells) board[c] = 1;
        const lines = [0, 1, 2, 3, 4, 5, 6, 7].filter(r => board.slice(r * 8, r * 8 + 8).every(Boolean)).length
          + [0, 1, 2, 3, 4, 5, 6, 7].filter(c => [0, 1, 2, 3, 4, 5, 6, 7].every(r => board[r * 8 + c])).length;
        if (cells.length + lines * 20 > best) { best = cells.length + lines * 20; pick = [p, i]; }
      }
      if (!pick) break;
      game.place(pick[0], Math.floor(pick[1] / 8), pick[1] % 8);
    }
    assert.ok(game.score / game.placements < 20, `seed ${seed}: ${game.score} in ${game.placements} placements`);
  }
});

test('memory penalises misses and a perfect first level is worth 450', () => {
  const game = new MemoryGame(7);
  const pair = value => game.deck.flatMap((card, i) => card === value ? [i] : []);
  const [a] = pair(0), [b] = pair(1);
  game.flip(a); game.flip(b); game.settle();
  const [c, d] = pair(0);
  game.flip(c); game.flip(d);
  assert.equal(game.score, 100 - 10);
  assert.equal(limitForLevel(1), 32000);
  assert.equal(limitForLevel(9), 92000);
  const perfect = new MemoryGame(3);
  for (let value = 0; value < 4; value++) for (const i of perfect.deck.flatMap((card, j) => card === value ? [j] : [])) perfect.flip(i);
  assert.equal(perfect.score, 450);
});

test('2048 moves report where each tile slid and which cells merged', () => {
  const result = moveBoard([2, 2, 0, 4, ...Array(12).fill(0)], 'left');
  assert.deepEqual(result.board.slice(0, 4), [4, 4, 0, 0]);
  assert.deepEqual(result.moves, [{ from: 0, to: 0 }, { from: 1, to: 0 }, { from: 3, to: 1 }]);
  assert.deepEqual(result.merged, [0]);
  const down = moveBoard([2, ...Array(11).fill(0), 2, 0, 0, 0], 'down');
  assert.deepEqual(down.moves, [{ from: 12, to: 12 }, { from: 0, to: 12 }]);
  assert.deepEqual(down.merged, [12]);
});

test('a block placement reports the cells it placed and the lines it cleared', () => {
  const game = new BlockGame(1);
  game.board.fill(0);
  game.board.splice(0, 7, ...Array(7).fill(1));
  game.tray = [[[0, 0]], undefined, undefined];
  game.place(0, 0, 7);
  assert.deepEqual(game.lastMove.placed, [7]);
  assert.deepEqual(game.lastMove.rows, [0]);
  assert.deepEqual(game.lastMove.columns, []);
  assert.deepEqual(game.lastMove.cleared, [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.equal(game.lastMove.points, 11);
});
