# Kumar Gaurav — Portfolio (House of the Dragon)

React + Vite + Three.js portfolio set in a 3D dragon world.

## Editing content

**Every piece of text on the site lives in one file: `src/data/portfolio.json`** — profile, popup,
island chapters, about, skills, experience, projects, contact, achievements, the personal page and
all UI strings (`ui` section: nav labels, loader text, form labels, buttons…).
Pages read it through `src/constants/index.js` (an adapter — don't put content there).

- **Skills:** `icon` is a Simple Icons name from react-icons (e.g. `SiKotlin`) + a brand `color`.
- **Images:** a file name in `src/assets/icons` / `src/assets/images`, or a full `https://` URL.
- **Nav:** `ui.nav` — add `{ "to": "/personal", "label": "Me" }` to put the personal page in the menu.
- **Links:** an empty `link` hides that button/card.

### Update content without redeploying (recommended)

The app can fetch its content JSON from a URL at startup. Edit that file → reload the site → done.
No code change, no build, no deploy. If the URL fails, the last good copy (cached in the browser)
or the bundled `portfolio.json` is used, so the site never breaks.

**Already set up:** production builds load content from this Gist (configured in `.env.production`):
<https://gist.github.com/Uniquegaurav/b9017c5ce6c46c1426b56c1efe9d7ee1>
→ open it, click **Edit**, change any text, **Update gist**, then reload the site.
Keep `src/data/portfolio.json` roughly in sync — it's the offline/fallback copy.

How it was set up (to recreate it elsewhere):

1. Go to <https://gist.github.com>, create a gist with a file named `portfolio.json`, paste the
   contents of `src/data/portfolio.json`, and save it.
2. Click **Raw**, copy the URL, and **remove the commit-hash part** so it always serves the latest:
   `https://gist.githubusercontent.com/<user>/<gist-id>/raw/portfolio.json`
3. Put `VITE_CONTENT_URL=<that URL>` in `.env.production` (or as a Netlify environment variable)
   and deploy once. (Locally: put it in `.env.local`, see `.env.example`.)
4. From now on, edit the gist in the browser and save. Reload the site to see it
   (GitHub's CDN can take up to a few minutes to serve the new version).

Tip: keep the gist valid JSON — paste it into <https://jsonlint.com> if unsure. If it's invalid the
site simply falls back to the previous content.

## Theme

Colours come from the 3D world and are defined once:
CSS variables at the top of `src/index.css` and Tailwind colours `night`, `frost`, `mist`, `ember` (+ Tailwind `teal`) in `tailwind.config.js`.
Shared pieces: `.frost-glass` (the popup's glass panel), `.btn` / `.btn-outline` (popup buttons), `.storm-bg` + `.snowfall` (inner pages).

## Run

Requires Node 18+ (`nvm use 20`).

```bash
npm install
npm run dev
npm run build
```

Optional — shrink the 3D models (~20MB → ~3MB) for faster first load:

```bash
for f in black_island_map dragon_flying winter stylized_planet; do
  npx @gltf-transform/cli optimize src/assets/3d/$f.glb src/assets/3d/$f.glb --compress meshopt --texture-compress webp --texture-size 1024
done
```
