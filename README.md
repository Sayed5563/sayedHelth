# sayedHelth

An installable, offline-capable meal planner built from the *Hooreya 1600 kcal* PDF.
Live at <https://sayed5563.github.io/sayedHelth/> (built and published by GitHub Actions on every push to `main`).
React 18 + Vite 5, with a service worker and manifest from `vite-plugin-pwa`. Arabic-first (RTL) with an English interface switch.

## What's inside

| Section | What it does |
|---|---|
| Home | Today's progress ring, the next meal and your chosen option, a timeline of all five meals |
| Daily Plan | All five meal periods with every option as an expandable card. Choose one option per meal, then mark it as eaten |
| My Progress | Completion %, meals eaten, instructions followed, last 7 days, full-day streak, most-chosen options, reset today |
| Instructions | All nine general instructions with a tick for each, the *My Healthy Plate* image from page 2, and points to clarify |

All pages have a date strip at the top: step back to an earlier day (up to 60 days) to review or fix it, then tap *Back to today*.

The palette button in the top bar opens **Look & settings**: six colour themes (Forest & Gold, Sage Garden, Rose Clay, Ocean Teal, Plum, Olive & Terracotta), Auto / Light / Dark, and language. Themes live in `src/themes.js`; add one by copying an entry and changing its colours.

Everything is saved automatically in the phone's browser storage (`localStorage`). A new, empty day starts at midnight; past days are kept for the weekly chart.

## Content accuracy

- All plan text lives in `src/data/plan.js`, transcribed from the PDF without changes (spelling such as "جبنة بيضة" and "ونص" kept as printed).
- The English switch translates the interface only. Meals and instructions always show the original Arabic.
- `npm run verify` checks the counts (5 meals, 4/3/3/3/3 options, 9 instructions), that every option and instruction matches the PDF text (`scripts/pdf-text.txt`), and that the on-screen ingredient list rebuilds to the exact original string.
- Ambiguous points are shown in the app (Instructions → Points to clarify) and not reinterpreted:
  1. Fractions written "٢/١" (very likely ½ cup).
  2. "4/3 كوب زبادي" — could be ¾ cup or 1⅓ cups.
  3. Breakfast option 2 says "½ كوب حليب" without "low-fat", while instruction 1 says low-fat dairy only.
  4. "1600 kcal" comes from the file name only; the PDF has no calorie breakdown and it has not been verified.

## Run it on your computer

Needs Node.js 18 or newer.

```bash
npm install
npm run dev        # development server, also reachable from your phone on the same Wi-Fi
npm run build      # production build into dist/
npm run preview    # serve the production build (the service worker only runs in this mode)
npm run verify     # content check against the PDF
```

## Publish and update (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` checks the content against the PDF, builds the app and publishes it to GitHub Pages every time something is pushed to `main`. Updates go live in about a minute, and installed phones pick up the new version the next time the app is opened online.

One-time setup: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.

To publish anywhere else instead, run `npm run build` and upload the `dist` folder (it uses relative paths, so any host or sub-folder works). `netlify.toml` is kept for Netlify.

## Install on an Android phone

1. Open <https://sayed5563.github.io/sayedHelth/> in **Chrome on Android** and let the page load fully once.
2. Tap **Install** in the app's top bar (or Chrome's ⋮ menu → **Install app** / **Add to Home screen**).
3. Open it from the home screen. It runs full-screen and keeps working with no connection.

## Together (sharing progress)

The **Together** tab lets people follow each other's progress. Each person makes an account (name, email, password) and gets a 6-character invite code. When one person enters the other's code, they are connected both ways and each sees the other's meals done today, instructions followed, last 7 days and streak. Meal choices are shared only if that person turns on *Share my meal choices*. Anyone can be removed at any time, and a new invite code can be made if an old one was passed around.

Signing in also keeps a cloud copy of your own days, so your progress follows you to a new phone. Everything still works offline and syncs when the connection is back.

### One-time setup (free Supabase project)

1. Create a free account at <https://supabase.com> and a **New project** (any name, e.g. `sayedhelth`; region: London).
2. Open **SQL Editor → New query**, paste all of `supabase/schema.sql`, press **Run**. This creates the tables and the privacy rules: people only ever see their own data and the data of people they are connected to.
3. **Authentication → URL Configuration**: set *Site URL* to `https://sayed5563.github.io/sayedHelth/` and add the same address under *Redirect URLs*, so confirmation emails link back to the app.
   (Optional: **Authentication → Providers → Email** → turn off *Confirm email* if you don't want a confirmation step.)
4. **Project Settings → API**: copy the *Project URL* and the *anon public* key, and put them in `src/sync/client.js`
   (or, once the site builds from GitHub, as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Netlify → Site configuration → Environment variables).
5. Rebuild and publish. Until this is done, the Together tab just says sharing isn't set up yet; the rest of the app is unaffected.

The anon key is meant to be public. Access is controlled by the row-level security rules in `schema.sql`, which were tested for: owner access, connected people (read only), strangers (no access), signed-out visitors (no access), and attempts to write someone else's data (refused).

## Adding food photos

The meal headers use drawn cover art. To use your own photos, put images in `src/photos/` named after the meal:

```
breakfast.jpg   snack-am.jpg   lunch.jpg   snack-pm.jpg   dinner.jpg
```

(`.jpg`, `.png` or `.webp`), then rebuild. They are bundled and cached for offline use automatically. Keep each under ~200 KB.

## Project layout

```
src/
  data/plan.js            the plan: meals, options, instructions, clarifications (source of truth)
  i18n.js                 Arabic / English interface strings (app name: APP_NAME)
  themes.js               colour themes, light + dark for each
  store.js                persisted state (per-day selections, completed meals, instructions)
  App.jsx                 top bar, tab navigation (#home, #plan, #progress, #instructions), install prompt
  pages/                  Home, Plan, Progress, Instructions, Together
  sync/                   Supabase client and account/sync hook
  components/             MealSection, Ingredients, ProgressRing, MealCover, DateStrip, SettingsSheet, Icon
  styles.css              design tokens (light + dark), layout, components
  photos/                 optional meal photos
public/                   icons, plate image from the PDF
scripts/verify-content.mjs  content check
supabase/schema.sql       database tables and privacy rules for Together
netlify.toml              Netlify build settings (used when the site builds from GitHub)
source/Hooreya_1600kcal.pdf original plan
```
