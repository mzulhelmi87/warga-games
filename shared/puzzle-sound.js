// Short synthesised sound effects for 2048, Teka Blok and Memori, in the style of Kejar Lapan's
// (kejar-lapan/js/audio.js): no audio files, so nothing extra to download.
let ctx = null;
let muted = false;

export const setPuzzleMuted = (m) => { muted = m; };

/** Creates or wakes the audio context; call from a tap or drag (browsers require one). */
export function unlockPuzzleSound() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx?.state === 'suspended') ctx.resume();
}

function tone(wave, notes, gain, length, delay = 0) {
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = wave;
  for (const [t, f, how] of notes) {
    if (how === 'ramp') osc.frequency.exponentialRampToValueAtTime(f, now + t);
    else osc.frequency.setValueAtTime(f, now + t);
  }
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + length);
  osc.connect(g).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + length + 0.02);
}

/**
 * Teka Blok — pick: a piece is chosen · place: a piece lands · clear: lines clear (`lines`,
 * `streak` raise the arpeggio) · miss: a piece doesn't fit there.
 * 2048 — slide: tiles move · merge: tiles join (`value`, the biggest new tile, sets the pitch) ·
 * win: 2048 reached.
 * Memori — flip: a card turns · match: a pair is found · mismatch: a wrong pair · level: a level
 * is cleared · tick: the last seconds.
 * All — over: the round ends (no room, no moves, or time up).
 */
export function playPuzzle(name, { lines = 1, streak = 1, value = 4 } = {}) {
  if (muted || !ctx || ctx.state !== 'running') return;
  if (name === 'pick') tone('sine', [[0, 520], [0.05, 640, 'ramp']], 0.06, 0.06);
  if (name === 'place') tone('triangle', [[0, 300], [0.07, 200, 'ramp']], 0.16, 0.09);
  if (name === 'miss') tone('square', [[0, 180], [0.1, 140, 'ramp']], 0.05, 0.12);
  if (name === 'clear') {
    // C–E–G–C… one more note per extra line, a little higher for each step of a streak.
    const lift = 1 + 0.06 * Math.min(8, Math.max(0, streak - 1));
    [523, 659, 784, 1047, 1319, 1568].slice(0, Math.min(6, 2 + lines))
      .forEach((f, i) => tone('square', [[0, f * lift]], 0.06, 0.16, i * 0.06));
  }
  if (name === 'over') tone('triangle', [[0, 392], [0.15, 330], [0.3, 262], [0.45, 196]], 0.16, 0.6);
  // 2048
  if (name === 'slide') tone('sine', [[0, 170], [0.08, 120, 'ramp']], 0.07, 0.09);
  if (name === 'merge') {
    // A 4 sounds low, a 2048 about two octaves higher.
    const f = 262 * 2 ** ((Math.log2(value) - 2) / 4.5);
    tone('triangle', [[0, f], [0.07, f * 1.5, 'ramp']], 0.13, 0.12);
  }
  if (name === 'win') [523, 659, 784, 1047].forEach((f, i) => tone('square', [[0, f]], 0.07, i === 3 ? 0.45 : 0.14, i * 0.11));
  // Memori
  if (name === 'flip') tone('triangle', [[0, 900], [0.04, 620, 'ramp']], 0.07, 0.05);
  if (name === 'match') { tone('sine', [[0, 660]], 0.12, 0.14); tone('sine', [[0, 990]], 0.12, 0.22, 0.09); }
  if (name === 'mismatch') tone('square', [[0, 200], [0.14, 150, 'ramp']], 0.05, 0.16);
  if (name === 'level') [523, 659, 784, 1047].forEach((f, i) => tone('triangle', [[0, f]], 0.12, 0.18, i * 0.08));
  if (name === 'tick') tone('square', [[0, 1200]], 0.04, 0.03);
}
