import { achievements } from "../constants";
import { sfx } from "./sfx";

const KEY = "achievements";
const listeners = new Set();

const load = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
  } catch {
    return new Set();
  }
};
const unlocked = load();

/** Unlock an achievement (ids defined in portfolio.json). Shows a toast only the first time. */
export const unlock = (id) => {
  const def = achievements.find((a) => a.id === id);
  if (!def || unlocked.has(id)) return;
  unlocked.add(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...unlocked]));
  } catch {
    /* ignore */
  }
  sfx.achievement();
  listeners.forEach((fn) => fn({ ...def, count: unlocked.size, total: achievements.length }));
};

export const onUnlock = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
