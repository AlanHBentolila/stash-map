# StashVI

A phone-first map of money stashes in Leonida, with a checklist saved on the player's phone
(no login) and English/Spanish.

## What each file does

| File | What it is |
| --- | --- |
| `index.html` | The page skeleton. |
| `js/stashes.js` | **Your stashes.** The only file you need to edit to add or change stashes. |
| `js/i18n.js` | All the site's words in English and Spanish. |
| `js/app.js` | The program that draws the map, list and checklist. |
| `css/style.css` | Colours and layout. Colours are at the top. |
| `assets/` | The map image and the little `$` icon. |
| `vendor/leaflet/` | The map library (zooming and dragging). Don't edit. |
| `CREDITS.md` | Who made the map and the licences. Keep it. |

## Adding a real stash

1. Open the site with `?pick` at the end of the address, e.g. `https://YOURNAME.github.io/stash-map/?pick`.
2. Tap the spot on the map. A box shows `x: …, y: …`.
3. Open `js/stashes.js`, copy one of the `{ … },` blocks, paste it below, and change the
   `id`, `money`, `x`, `y`, names and descriptions.
4. Delete the 3 `sample-…` blocks when you have real ones.
5. Save, then upload the change (see "Updating the site" below).

## Trying it on your computer

Double-clicking `index.html` works in most browsers. If the map doesn't show, run this in the
project folder and open http://localhost:8000:

```
npx serve -l 8000
```

## Updating the site (GitHub Pages)

```
git add .
git commit -m "Add new stashes"
git push
```

GitHub rebuilds the site in about a minute.
