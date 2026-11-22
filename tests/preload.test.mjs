import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { GAMES, analyse } from '../tools/preload.mjs';

test('every game page preloads exactly its static modules, and preload.json is current', () => {
  // Fails after an import, stylesheet or script changes without `node tools/preload.mjs`.
  execFileSync(process.execPath, [new URL('../tools/preload.mjs', import.meta.url).pathname, '--check'], { stdio: 'pipe' });
});

test('each game prefetch list starts with its page and covers its stylesheets', () => {
  const { games } = JSON.parse(readFileSync(new URL('../preload.json', import.meta.url), 'utf8'));
  assert.deepEqual(Object.keys(games).sort(), [...GAMES].sort());
  for (const game of GAMES) {
    assert.equal(games[game][0], `${game}/`);
    for (const style of analyse(game).styles) assert.ok(games[game].some((f) => style.endsWith(f)), `${game}: ${style}`);
  }
});
