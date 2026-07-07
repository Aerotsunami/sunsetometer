# ☀ Sunsetometer / Закатометр

A small installable PWA that predicts **how beautiful the sunset will be** at a given place and day (up to 7 days ahead), and breaks down the percentage contribution of every weather factor. Fully static — runs entirely in the browser, no server and no API keys. Interface in **English with a one-tap RU/EN switch** (choice is remembered).

## How it works

Data comes from the free [Open-Meteo](https://open-meteo.com) API (weather + geocoding). At the moment of sunset, five factors are scored; each contributes points toward a total out of 100:

| Factor | Weight | What's good |
|---|---|---|
| High clouds | 30 | cirrus catches the red light; ideal ~30–70% |
| Horizon clarity (low clouds) | 25 | the fewer, the better the underlighting |
| Mid-level clouds | 15 | moderate; sweet spot ~10–50% |
| Air clarity (visibility) | 15 | higher visibility → cleaner colors |
| Humidity | 15 | drier → more saturated |

The bar under each factor shows **favorability** (how good that value is), not the raw amount — so 100% high clouds can still score low, because a solid deck mutes the light.

Verdict scale: 72+ spectacular · 58+ good · 42+ average · 26+ dull · below — flat.

The app also shows a **"When to watch"** panel: golden hour, peak-color window (from ~10 min before sunset through the afterglow), and blue hour — all computed from the sunset time.

## Files

- `index.html` — the whole app (UI, i18n, scoring, rendering)
- `manifest.webmanifest` — PWA metadata
- `sw.js` — service worker; caches the app shell for install/offline (weather responses are never cached)
- `icons/` — app icons (192, 512, maskable, apple-touch)

## Deploy to GitHub Pages

### Option A — command line (fastest)

From the folder containing these files:

```bash
git init
git add .
git commit -m "Sunsetometer PWA"
git branch -M main
# create an empty repo on github.com first, then:
git remote add origin https://github.com/<your-username>/sunsetometer.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**. After ~1 minute the app is live at:

```
https://<your-username>.github.io/sunsetometer/
```

### Option B — no command line

1. Create a new repository on [github.com/new](https://github.com/new) (e.g. `sunsetometer`), public.
2. On the repo page click **Add file → Upload files**, drag in `index.html`, `manifest.webmanifest`, `sw.js` and the `icons` folder, then **Commit changes**.
3. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
4. Open the `https://<your-username>.github.io/sunsetometer/` URL, then on your phone use **Add to Home Screen** to install it.

> All paths are relative, so it works both at a repo subpath (`/sunsetometer/`) and at a domain root. GitHub Pages serves over HTTPS, which geolocation and the service worker require.

## Run locally

A service worker needs http (not `file://`):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Disclaimer

The model is heuristic. A real sunset also depends on what happens beyond your local horizon, on aerosols, and on distant smoke, none of which a point forecast fully captures. Treat the score as a guide, not a guarantee.
