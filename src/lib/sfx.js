/**
 * Game-style sound effects, synthesised with the Web Audio API (zero audio files to download).
 * One global mute switch is shared by the music and every effect, persisted in localStorage.
 */
const KEY = "soundMuted";
let ctx = null;
const listeners = new Set();

const read = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
let muted = read();

export const isMuted = () => muted;
export const setMuted = (value) => {
  muted = value;
  try {
    localStorage.setItem(KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn(muted));
};
export const onMuteChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const audio = () => {
  if (muted || typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
};

// A single enveloped oscillator note
const tone = (ac, { freq, type = "sine", start = 0, dur = 0.2, gain = 0.15, slideTo }) => {
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
};

// Filtered noise burst — wind / whoosh
const whoosh = (ac, { dur = 0.45, gain = 0.12, from = 400, to = 2400 } = {}) => {
  const t = ac.currentTime;
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(g).connect(ac.destination);
  src.start(t);
  src.stop(t + dur);
};

const play = (fn) => {
  try {
    const ac = audio();
    if (ac) fn(ac);
  } catch {
    /* audio is a nice-to-have — never break the UI */
  }
};

export const sfx = {
  /** soft UI tick for hovers */
  hover: () => play((ac) => tone(ac, { freq: 1400, type: "triangle", dur: 0.06, gain: 0.03 })),
  /** button press */
  click: () =>
    play((ac) => {
      tone(ac, { freq: 520, type: "square", dur: 0.07, gain: 0.04 });
      tone(ac, { freq: 880, type: "triangle", start: 0.03, dur: 0.08, gain: 0.05 });
    }),
  /** chapter card appears — wind + rising arpeggio */
  quest: () =>
    play((ac) => {
      whoosh(ac, { dur: 0.5, gain: 0.08 });
      [523.25, 659.25, 783.99].forEach((f, i) =>
        tone(ac, { freq: f, type: "triangle", start: 0.08 + i * 0.07, dur: 0.35, gain: 0.07 })
      );
    }),
  /** achievement unlocked — bright fanfare */
  achievement: () =>
    play((ac) => {
      [659.25, 783.99, 987.77, 1318.5].forEach((f, i) =>
        tone(ac, { freq: f, type: "square", start: i * 0.08, dur: 0.18, gain: 0.035 })
      );
      tone(ac, { freq: 1318.5, type: "sine", start: 0.32, dur: 0.6, gain: 0.08 });
    }),
  /** entering the world — deep dragon-wing whoosh */
  portal: () =>
    play((ac) => {
      whoosh(ac, { dur: 0.9, gain: 0.16, from: 120, to: 900 });
      tone(ac, { freq: 110, type: "sawtooth", dur: 0.8, gain: 0.05, slideTo: 55 });
    }),
  /** message sent */
  success: () =>
    play((ac) => {
      tone(ac, { freq: 783.99, type: "sine", dur: 0.18, gain: 0.08 });
      tone(ac, { freq: 1046.5, type: "sine", start: 0.12, dur: 0.4, gain: 0.08 });
    }),
};
