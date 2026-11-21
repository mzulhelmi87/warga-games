import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { paletteFor, THEME_KEY } from '../shared/appswarga.js';

const BOOT = readFileSync(new URL('../shared/theme-boot.js', import.meta.url), 'utf8');

// Runs theme-boot.js against a minimal page with `stored` under arked.theme.
function boot(stored) {
  const vars = {}, attrs = {}, classes = new Set();
  const meta = { content: '#7b1fa2', setAttribute(k, v) { this[k] = v; } };
  const root = {
    style: { setProperty: (k, v) => { vars[k] = v; } },
    setAttribute: (k, v) => { attrs[k] = v; },
    classList: { add: (c) => classes.add(c) },
  };
  vm.runInNewContext(BOOT, {
    localStorage: { getItem: (k) => (k === THEME_KEY ? stored : null) },
    document: { documentElement: root, querySelector: () => meta },
  });
  return { vars, attrs, classes, meta };
}

test('a saved AppsWarga palette is applied before the first paint, in light mode', () => {
  const palette = paletteFor({ primaryColor: '#1e88e5', gradient: ['#1e88e5', '#42a5f5'] });
  const page = boot(JSON.stringify({ palette }));
  assert.deepEqual(page.vars, palette);
  assert.equal(page.attrs['data-theme'], 'light');
  assert.ok(page.classes.has('in-appswarga'));
  assert.equal(page.meta.content, '#1e88e5');
});

test('nothing saved, or a bad value, leaves the default theme alone', () => {
  for (const stored of [null, 'not json', '{}', JSON.stringify({ palette: { '--primary': 'red' } })]) {
    const page = boot(stored);
    assert.deepEqual(page.vars, {}, String(stored));
    assert.equal(page.attrs['data-theme'], undefined);
    assert.equal(page.classes.size, 0);
  }
});

test('only colour variables are applied from the saved palette', () => {
  const page = boot(JSON.stringify({ palette: { '--primary': '#123456', '--bg': 'url(x)', 'color': '#ffffff' } }));
  assert.deepEqual(page.vars, { '--primary': '#123456' });
});
