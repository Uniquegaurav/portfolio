/**
 * Content source for the whole site.
 *
 * 1. `portfolio.json` (bundled) is the default — always available, works offline.
 * 2. If VITE_CONTENT_URL is set (e.g. a GitHub Gist "raw" URL), that JSON is fetched at startup
 *    and its top-level sections replace the bundled ones. Edit the remote file → reload the site →
 *    new content, with no code change and no redeploy.
 * 3. The last good remote copy is cached in localStorage, used if the network is slow or down.
 */
import bundled from "./portfolio.json";

const CACHE_KEY = "portfolioContent:v1";
const TIMEOUT_MS = 2500;

// Mutable singleton: replaced in place before the app is imported, so every module sees the final content.
export const content = structuredClone(bundled);

const apply = (remote) => {
  if (!remote || typeof remote !== "object" || Array.isArray(remote)) throw new Error("content must be a JSON object");
  // Section-level merge: any section missing from the remote file keeps the bundled default.
  for (const [key, value] of Object.entries(remote)) {
    if (key in bundled) content[key] = value;
  }
};

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  } catch {
    return null;
  }
};

export async function loadContent() {
  const url = import.meta.env.VITE_CONTENT_URL;
  if (!url) return "bundled";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // cache-busting query so edits show up on the next reload
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${sep}t=${Date.now()}`, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const remote = await res.json();
    apply(remote);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(remote));
    } catch {
      /* storage full / disabled — fine */
    }
    return "remote";
  } catch (err) {
    console.warn("[content] remote content unavailable, using fallback:", err.message);
    const cached = readCache();
    if (cached) {
      try {
        apply(cached);
        return "cache";
      } catch {
        /* corrupt cache → bundled */
      }
    }
    return "bundled";
  } finally {
    clearTimeout(timer);
  }
}
