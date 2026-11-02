# sayedHelth

An installable, offline-capable meal planner built from the *Hooreya 1600 kcal* PDF.
Live at <https://sayedhelth.netlify.app/>.
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

## Publish and update on Netlify

First time:
1. `npm run build`
2. Drag the `dist` folder onto <https://app.netlify.com/drop>.

**Updating the live site (sayedhelth.netlify.app):**
1. Make the change in the source and run `npm run build`.
2. Log in to Netlify → open the **sayedhelth** site → **Deploys**.
3. Drag the new `dist` folder onto the drop area at the bottom of the Deploys page.

Do not drop it on netlify.com/drop again: that creates a *new* site with a new address. Updating through the site's own Deploys page keeps the same address, and installed phones pick up the new version the next time the app is opened online. Saved progress on the phone is kept.

Optional: put the project on GitHub and link the repository to the Netlify site. Then every change pushed to GitHub is built and published automatically.

## Install on an Android phone

1. Open <https://sayedhelth.netlify.app/> in **Chrome on Android** and let the page load fully once.
2. Tap **Install** in the app's top bar (or Chrome's ⋮ menu → **Install app** / **Add to Home screen**).
3. Open it from the home screen. It runs full-screen and keeps working with no connection.

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
  pages/                  Home, Plan, Progress, Instructions
  components/             MealSection, Ingredients, ProgressRing, MealCover, DateStrip, SettingsSheet, Icon
  styles.css              design tokens (light + dark), layout, components
  photos/                 optional meal photos
public/                   icons, plate image from the PDF
scripts/verify-content.mjs  content check
source/Hooreya_1600kcal.pdf original plan
```
