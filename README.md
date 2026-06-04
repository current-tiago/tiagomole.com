# tiagomole.com

Personal portfolio site for Tiago Branco Mole — economist, entrepreneur, writer.

Live at **[tiagomole.com](https://tiagomole.com)**

> **Claude instruction:** Never open or launch a browser preview. Edit files directly — Netlify auto-deploys on push.

---

## Stack

- Pure HTML/CSS/JS — no framework
- Hosted on **Netlify** (auto-deploys from `main` branch on GitHub)
- Serverless functions for Spotify integration, Atelier auth, and daily lottery
- `@netlify/blobs` for server-side lottery state (installed via `package.json`)

---

## Structure

```
/
├── index.html                                  # Main portfolio page (hero, writing, ventures, about)
├── europe-map.svg                              # Western Europe SVG map for hero-right panel
├── lisbon-map.svg                              # Detailed Lisbon SVG map for Rocky's Home
├── package.json                                # @netlify/blobs dependency
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
├── netlify.toml                                # Netlify config (functions + redirect rules)
├── netlify/
│   └── functions/
│       ├── now-playing.js                      # Spotify "now playing" serverless function
│       ├── rocky-auth.js                       # Server-side password auth for Rocky's Home
│       └── lottery-draw.js                     # Server-side daily lottery (Netlify Blobs)
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

`lisbon-map.svg` is a hand-crafted SVG of Lisbon used in Rocky's Home. It includes a detailed street network, 18 named districts, and an accurate Tagus River shape (curves sharply north at Parque das Nações). Five orange dots mark: Oceanário de Lisboa, Campo Pequeno, Praça do Comércio, Av. da Liberdade, and Torre de Belém.

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

**Sections:** hero with countdown to arrival · five poems (accordion) · Films We've Watched (16 films, dual T/R star ratings, expandable descriptions) · **Something I Like About You** (daily lottery) · Lisbon map.

### Films We've Watched
16 films with dual star ratings (T = Tiago in orange, R = Imy in pink, out of 5). Clicking a film title expands an IMDB-style description panel. Films with the highest combined T+R score get the `top-rated` class (soft gold title). Currently: Train Dreams and Project Hail Mary (both 10/10).

### Daily Lottery
A "Something I Like About You" section gated by a 25% daily draw. **One shared roll per day** — the first person anywhere to click triggers a server-side roll via `lottery-draw.js`; everyone else that day gets the same result. Won items are revealed one at a time and accumulate into a permanent collection. Backed by Netlify Blobs (auto-provisioned, no setup needed). Falls back to a local roll if the function is unavailable.

See `HANDOVER.md` for full mechanics, storage schema, and reset instructions.

---

## Adding Content

### New article
1. Create a new `.html` file (copy `how-to-be-a-dictator.html` as template)
2. Add a new `.writing-item` row in the **Writing** section of `index.html` (increment the number)
3. Add to the relevant category page (e.g. `policy-research.html`)

### New film to Rocky's Home
Copy an existing `.movie-item` block — it contains a `.movie-item-row` (num / title / ratings grid) and a `.movie-desc-wrap` (the hidden description panel). Update the number, title, year, star spans, and description fields (director, synopsis, genre). Star classes: `star-t`, `star-r`, `star-empty`, `star-half-t`, `star-half-r`. After adding, recalculate combined T+R scores and move the `top-rated` class to the highest-scoring film(s).

### New "thing I like about you"
Add a new string to the `THINGS` array in `rh-e3f7a92c1d.html`. **Always append — never reorder or remove** existing entries, as the server stores indices and reordering would corrupt the collection. Also add the next Roman numeral to the `NUMERALS` array.

### New venture
Add a new `<a class="venture-item">` block in the **Ventures** section of `index.html`.

---

## Deployment

Push to `main` → Netlify auto-deploys. Takes ~20–30 seconds (slightly longer than before due to `npm install`).

```bash
git add . && git commit -m "your message" && git push
```

---

## Contact

[tiagobrancomole@gmail.com](mailto:tiagobrancomole@gmail.com)
