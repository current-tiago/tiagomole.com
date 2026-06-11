# tiagomole.com

Personal portfolio site for Tiago Branco Mole — economist, entrepreneur, writer.

Live at **[tiagomole.com](https://tiagomole.com)**

> **Claude instruction:** Never open or launch a browser preview. Edit files directly — Netlify auto-deploys on push.

---

## Stack

- Pure HTML/CSS/JS — no framework, no build step, no npm dependencies
- Hosted on **Netlify** (auto-deploys from `main` branch on GitHub)
- Two serverless functions: Spotify now-playing widget + Rocky's Home auth

---

## Structure

```
/
├── index.html                                  # Main portfolio page (hero, writing, ventures, about)
├── europe-map.svg                              # Western Europe SVG map for hero-right panel
├── lisbon-map.svg                              # Detailed Lisbon SVG map for Rocky's Home
├── world-map.svg                               # World map (equirectangular) for the famous person game
│
├── — Full article pages —
├── how-to-be-a-dictator.html
├── how-poland-caused-german-unification.html
├── antiqua-et-nova.html                        # The Church's Teachings on AI (Policy Research)
├── argentina-on-the-rise.html                  # Milei & Austrian economics (Macroeconomic Analysis)
│
├── — Category index pages —
├── historical-perspectives.html
├── macroeconomic-analysis.html
├── policy-research.html
├── entrepreneurial-ventures.html
│
├── work.html                                   # Full article archive
├── write-article.html
│
├── [private]                                   # Rocky's Home (password-gated)
│
├── netlify.toml                                # Netlify config (functions directory)
├── netlify/
│   ├── functions/
│   │   ├── now-playing.js                      # Spotify "now playing" serverless function
│   │   └── rocky-auth.js                       # Server-side password auth for Rocky's Home
│   └── edge-functions/
│       └── rocky-gate.js                       # Edge function that gates Rocky's Home
├── HANDOVER.md                                 # Full context for new Claude sessions
└── README.md
```

---

## Design

- **Fonts**: Cormorant Garamond (serif, headings/body) + DM Mono (metadata, labels, nav)
- **Colours**: Cream `#F5F0E8` background · Ink `#0D0D0D` · Orange accent `#FF8800`
- **Style**: Editorial / high-end print — asymmetric grid, noise texture overlay, scroll reveals

All article pages share the same template: fixed header, hero with orange tag + large serif title, article body with drop cap, section headers in DM Mono orange, footer nav.

---

## Europe Map

The hero-right panel shows a faded SVG map of Western Europe (`europe-map.svg`), generated from Natural Earth 10m country data. Portugal and the UK are shaded darker. Cities marked: **Lisbon**, **Barcelona**, **Frankfurt**.

See `HANDOVER.md` for regeneration instructions and how to add new city markers.

---

## Lisbon Map

`lisbon-map.svg` is a hand-crafted SVG of Lisbon used in Rocky's Home. It includes a detailed street network, 18 named districts, and an accurate Tagus River shape. Six orange dots mark: Oceanário de Lisboa, Campo Pequeno, Praça do Comércio, Av. da Liberdade, Torre de Belém, and Castelo de São Jorge.

See `HANDOVER.md` for the coordinate formula and how to add or move dots.

---

## Spotify "Now Playing" Widget

Fixed bottom-right widget. Shows current track as **"Tiago is playing"** or **"Last Played"** when paused. Calls `/.netlify/functions/now-playing` every 30 seconds, and also refreshes immediately on tab focus and browser back-navigation (bfcache restore).

**Env vars required in Netlify:**

| Key | Notes |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | From Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | From Spotify Developer Dashboard |
| `SPOTIFY_REFRESH_TOKEN` | Regenerate if token becomes invalid — see HANDOVER.md |

---

## Rocky's Home

A private page for Imy, accessible via a hidden button in the footer. Password is validated server-side by `rocky-auth.js` — no credentials in public source.

**Env var required:**

| Key | Notes |
|-----|-------|
| `ROCKY_PASSWORD_HASH` | SHA-256 hash of the password (Netlify dashboard) |

**Sections:** hero with countdown to arrival · five poems (accordion) · Films We've Watched · **Something I Like About You** (daily famous person game) · Lisbon map.

### Films We've Watched
16 films with dual star ratings (T = Tiago in orange, R = Imy in pink, out of 5). Clicking a film title expands a description panel. Films with the highest combined T+R score get the `top-rated` class (soft gold title). Currently: Train Dreams and Project Hail Mary (both 10/10).

### Something I Like About You — Famous Person Game
A daily geography-guessing game. A world map shows a **green circle** (birth city + year) and a **red circle** (death city + year). The player guesses who it is. Resets every day at **14:00 Lisbon time**.

- 100% client-side — state stored in `localStorage` (`rocky_famous_v1`), fully independent per device
- New famous person each day, cycling through the `FAMOUS_PEOPLE` array in `rh-e3f7a92c1d.html`
- Day 0 (June 4 2026) = Trotsky. To add more people, append to the array — never reorder existing entries.

See `HANDOVER.md` for full mechanics and how to add new people.

---

## Adding Content

### New article
1. Create a new `.html` file (copy `how-to-be-a-dictator.html` as template)
2. Add a new `.writing-item` row in the **Writing** section of `index.html`
3. Add to the relevant category page (e.g. `policy-research.html`)

### New film to Rocky's Home
Copy an existing `.movie-item` block — it contains a `.movie-item-row` (num / title / ratings grid) and a `.movie-desc-wrap` (hidden description panel). Update number, title, year, star spans, and description. Star classes: `star-t`, `star-r`, `star-empty`, `star-half-t`, `star-half-r`. After adding, recalculate combined T+R scores and move the `top-rated` class to the highest-scoring film(s).

### New famous person to the game
Append an entry to `FAMOUS_PEOPLE` in `rh-e3f7a92c1d.html`:
```js
{
  name: "Full Name",
  hint: "Short descriptor",
  born: { city: "City, Country", lat: 00.00, lon: 00.00, year: 0000 },
  died: { city: "City, Country", lat: 00.00, lon: 00.00, year: 0000 },
  fact: "One interesting sentence.",
}
```
Map coordinates use equirectangular projection: `x = (lon + 180) / 360 * 2000`, `y = (90 - lat) / 180 * 1000`.

### New venture
Add a new `<a class="venture-item">` block in the **Ventures** section of `index.html`.

---

## Deployment

Push to `main` → Netlify auto-deploys in ~15–30 seconds.

```bash
git add <files> && git commit -m "message" && git push
```

---

## Contact

[tiagobrancomole@gmail.com](mailto:tiagobrancomole@gmail.com)
