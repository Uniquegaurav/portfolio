/**
 * Background music for the dragon world.
 *
 * Mobile browsers (iOS Safari especially) only allow audio to start *synchronously inside*
 * a tap/click handler. So `music.start()` must be called directly from the click handler
 * (e.g. "Explore the World") — not from a React effect, which runs after the handler returns.
 * The nav's sound toggle works the same way: setMuted() notifies us synchronously in its click.
 */
import rose from "../assets/rose.mp3";
import { isMuted, onMuteChange } from "./sfx";

let audio = null;
let active = false; // true while the visitor is in the world (Home page, tour started)
let retryArmed = false;

const ensure = () => {
  if (!audio) {
    audio = new Audio(rose);
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = "auto";
    if (import.meta.env.DEV) window.__portfolioMusic = audio; // lets the e2e check inspect playback
  }
  return audio;
};

// If the browser still refuses (e.g. a return visit with no click yet), start on the next tap.
const armRetry = () => {
  if (retryArmed) return;
  retryArmed = true;
  window.addEventListener(
    "pointerdown",
    () => {
      retryArmed = false;
      if (active && !isMuted()) play();
    },
    { once: true, capture: true }
  );
};

const play = () => {
  const a = ensure();
  const p = a.play();
  if (p && p.catch) p.catch(armRetry);
};

export const music = {
  /** Call synchronously from a user gesture handler when the visitor enters the world. */
  start() {
    active = true;
    if (!isMuted()) play();
  },
  /** Leaving the world (navigating away / unmount). */
  stop() {
    active = false;
    audio?.pause();
  },
};

onMuteChange((muted) => {
  if (!active) return;
  if (muted) audio?.pause();
  else play(); // runs inside the nav toggle's click → allowed on mobile
});
