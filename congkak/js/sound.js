// Congkak's sounds, synthesised like shared/puzzle-sound.js (no files to download): glass marbles
// clicking into wood, a rattle when the hand scoops, and short cues for turns and the result.
let ctx = null;
let muted = false;
let lastDrop = 0;

export const setMuted = (m) => { muted = m; };

/** Creates or wakes the audio context; call from a tap (browsers require one). */
export function unlockSound() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx?.state === 'suspended') ctx.resume();
}

function tone(wave, freq, gain, length, delay = 0, endFreq = freq) {
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq !== freq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + length);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, now + length);
  osc.connect(g).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + length + 0.02);
}

/** A glassy click: a bright ping over a short knock. */
function click(gain = 1, delay = 0) {
  const f = 2300 + Math.random() * 1400;
  tone('sine', f, 0.07 * gain, 0.07, delay);
  tone('triangle', f * 0.37, 0.05 * gain, 0.04, delay);
}

/**
 * drop: a marble lands (`store` true for a store: deeper) · pickup: the hand scoops `n` marbles ·
 * capture: a tembak · turn: the player's turn · win / lose / draw: the round ends.
 */
export function play(name, n = 1) {
  if (muted || !ctx || ctx.state !== 'running') return;
  if (name === 'drop') {
    const now = performance.now();
    if (now - lastDrop < 35) return; // several at once (pouring) sound as one
    lastDrop = now;
    click(n ? 1 : 0.9);
    if (n) tone('sine', 420, 0.035, 0.08, 0.01, 300);
  }
  if (name === 'pickup') for (let i = 0; i < Math.min(5, n); i++) click(0.55, i * 0.028);
  if (name === 'capture') [660, 880, 1175].forEach((f, i) => tone('triangle', f, 0.09, 0.14, i * 0.07));
  if (name === 'turn') tone('sine', 880, 0.05, 0.12, 0, 990);
  if (name === 'win') [523, 659, 784, 1047].forEach((f, i) => tone('square', f, 0.06, i === 3 ? 0.45 : 0.14, i * 0.11));
  if (name === 'lose') [392, 330, 262, 196].forEach((f, i) => tone('triangle', f, 0.12, 0.2, i * 0.13));
  if (name === 'draw') [523, 523].forEach((f, i) => tone('triangle', f, 0.1, 0.16, i * 0.18));
}
