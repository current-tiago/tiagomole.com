# Handover File — tiagomole.com

Last updated: 3 June 2026 (evening, session 2)

---

> **Claude instruction:** Never open or launch a browser preview. Make all changes directly to the HTML files and let Netlify handle deployment.

---

## Project overview

Personal website for Tiago Branco Mole. Hosted on **Netlify**, connected to GitHub:
`https://github.com/current-tiago/tiagomole.com`

Local path: `/Users/tiagobranco-mole/Desktop/tiagomole.com`

Stack: pure HTML/CSS/JS — no build step, no framework. Deploy by pushing to `main`.

---

## Design system

All pages share the same design tokens and fonts:

| Token | Value |
|-------|-------|
| `--cream` | `#F5F0E8` — page background |
| `--ink` | `#0D0D0D` — primary text |
| `--ink-soft` | `#2A2A2A` |
| `--red` | `#FF8800` — accent (links, labels, highlights) |
| `--muted` | `#8A8070` |
| `--line` | `rgba(13,13,13,0.12)` — dividers |

**Fonts:** Cormorant Garamond (serif display + body) + DM Mono (labels, nav, mono elements). Both loaded from Google Fonts.

**Shared patterns:** noise texture overlay on `body::before`, scroll-reveal via `IntersectionObserver` (`.reveal` → `.visible`), fixed header with gradient fade.

---

## File structure

```
index.html                                — homepage
europe-map.svg                            — Western Europe SVG map used in hero-right

— Full article pages (word-for-word from source material) —
how-to-be-a-dictator.html
how-poland-caused-german-unification.html
antiqua-et-nova.html                      — The Church's Teachings on AI (Policy Research)
argentina-on-the-rise.html                — Milei & Austrian economics (Macroeconomic Analysis)

— Category index pages —
historical-perspectives.html
macroeconomic-analysis.html
policy-research.html
entrepreneurial-ventures.html

work.html                                 — article archive
write-article.html

[private page]                             — the Atelier (password-gated)

netlify/functions/
  now-playing.js                          — Spotify serverless function
  rocky-auth.js                           — server-side password auth for the Atelier
netlify/edge-functions/
  rocky-gate.js                           — edge function that gates the Atelier (cookie check)
netlify.toml                              — functions + edge-functions directory config
```

---

## Homepage (index.html)

Sections in order:
1. **Hero** — two-column layout split by a vertical line
   - Left: name, eyebrow, description, CTA links
   - Right: faded Western Europe SVG map with city markers, coordinates at bottom-right
2. **Writing** (`#writing`) — numbered horizontal list (01–08), each row: number · tag · title · description
   - 01 How to Be a Dictator · 02 How Poland Caused German Unification · 03 Macroeconomic Analysis · 04 Historical Perspectives · 05 Policy Research · 06 Entrepreneurial Ventures · 07 Antiqua et Nova · 08 Argentina on the Rise
3. **Ventures** (`#ventures`) — Swapdesk + placeholder
4. **About** (`#about`) — bio + meta grid
5. **Footer**
6. **Spotify widget** — fixed bottom-right, label says "Tiago is playing" (active) or "Last Played" (paused). Fetches every 30s, also refreshes on `pageshow` (bfcache restore) and `visibilitychange` (tab focus) to prevent stale data.
7. **the Atelier modal** — hidden password button below footer triggers overlay; password validated server-side via `rocky-auth` function

---

## Article pages

All article pages use the same template design:
- Fixed header: TBM logo + nav (Writing / Ventures / About / Contact)
- Article hero: orange tag eyebrow, large serif title, italic subtitle, date
- Article body: max-width 680px, 1.2rem Cormorant body text, drop cap on first paragraph, section headers in DM Mono orange, 2rem paragraph spacing
- Footer bar: ← All Writing back link
- Page footer

**Important:** Articles should be reproduced **word for word** from source material. Only remove student numbers, academic metadata, and purely presentational layout artefacts (e.g. PowerPoint column labels). Do not rewrite or paraphrase.

### Current full articles
| File | Title | Category | Source |
|------|-------|----------|--------|
| `how-to-be-a-dictator.html` | How to Be a Dictator | History · Politics | Medium (Dec 2024) |
| `how-poland-caused-german-unification.html` | How Poland Caused German Unification | History · Europe | Medium (Nov 2024) |
| `antiqua-et-nova.html` | Antiqua et Nova: The Church's Teachings on AI | Policy · Technology | University assignment (2025) |
| `argentina-on-the-rise.html` | Argentina on the Rise | Economics · Latin America | PPTX presentation (Mar 2025) |

### Category pages
Each category page lists its articles (active items are `<a>` tags; upcoming ones are `.placeholder` divs with `opacity: 0.35; pointer-events: none`).

---

## Europe map (europe-map.svg)

Generated from **Natural Earth 10m cultural data** (`ne_10m_admin_0_countries.shp`).

- **Projection**: Mercator
- **Bounds**: 25°W → 35°E, 34°N → 71.5°N
- **Countries**: 55 (Western + Central + Eastern Europe edge, Iceland, Greenland fringe, Russia/Belarus/Ukraine clipped to bounds)
- **Highlights**: Portugal (`PRT`) and UK (`GBR`) filled slightly darker
- **City markers**: Lisbon (2050–present), Barcelona (2006–2008), Frankfurt (2008–2014) — orange dot + monospace label + date range
- **Style**: cream/ink palette, all borders stroke `rgba(13,13,13,0.18)`, fills very low opacity

**Known quirk:** France and Norway have `ISO_A3 = -99` in Natural Earth — always fall back to `ADM0_A3` when `ISO_A3` is `-99`.

**To add a city marker**, add a tuple to the `cities` list in the generation script:
```python
cities = [
    ("Lisbon",    -9.14, 38.72, "2050–present",  4, -6),
    ("Barcelona",  2.17, 41.39, "2006–2008",      4, -5),
    ("Frankfurt",  8.68, 50.11, "2008–2014",      4, -5),
]
```

---

## the Atelier

Private page for Imy (Tiago's partner). Accessed via a hidden password button in the footer of the main site.

**Security model:**
- Password validated **server-side** by `netlify/functions/rocky-auth.js`
- On correct password, the auth function sets a `rh_session` cookie (HMAC-SHA256, 7-day expiry)
- A Netlify Edge Function (`netlify/edge-functions/rocky-gate.js`) gates the page — no valid cookie, no access
- `ROCKY_PASSWORD_HASH` lives in Netlify env vars — not in any file
- No credentials, hashes, or page paths are exposed in public docs

**Netlify env var required:**

| Key | Value |
|-----|-------|
| `ROCKY_PASSWORD_HASH` | SHA-256 hash of the password (set in Netlify dashboard) |

**Page contents:**
- Hero: large serif title, subtitle "A little section just for your eyes", countdown timer (top-right), meta block (bottom-right)
- **Countdown**: ticks down to June 6 2026 09:00 Lisbon time (UTC+1). Shows "Arriving in Lisbon" once it hits zero.
- **Five poems** — accordion layout (max-width 600px, centred); each poem shows only its title until clicked, then expands smoothly. Only one open at a time. Toggle indicator `+` / `×` in DM Mono.
  - I · Sample no.1 · II · View of the Room · III · T-3 Weeks · IV · Studying · V · Orpheus
- **Films We've Watched** section — numbered list of 16 films with dual star ratings:
  - **T** = Tiago's rating (orange `#FF8800` stars)
  - **R** = Imy's rating (pink `#e8829a` stars)
  - Stars out of 5; half-stars supported via CSS `linear-gradient` clip trick
  - Star classes: `star-t`, `star-r`, `star-empty`, `star-half-t`, `star-half-r`
  - Film(s) with the highest combined T+R score get class `top-rated` — only the title text is coloured soft gold (`#D4A017`). Currently tied: 01 Train Dreams and 10 Project Hail Mary (both 10/10)

**Current film list (in order):**

| # | Title | Year | T | R | Total |
|---|-------|------|---|---|-------|
| 01 ★ | Train Dreams | 2022 | ★★★★★ | ★★★★★ | 10 |
| 02 | Blair Witch Project | 1999 | ★★½☆☆ | ★★★☆☆ | 5.5 |
| 03 | Creep | 2014 | ★★★½☆ | ★★★★☆ | 7.5 |
| 04 | Creep 2 | 2017 | ★★☆☆☆ | ★★☆☆☆ | 4 |
| 05 | Murder Mystery | 2019 | ★★★☆☆ | ★★★☆☆ | 6 |
| 06 | Inglourious Basterds | 2009 | ★★★★★ | ★★★★☆ | 9 |
| 07 | Pursuit of Happyness | 2006 | ★★★½☆ | ★★★☆☆ | 6.5 |
| 08 | Nightcrawler | 2014 | ★★★★☆ | ★★★★☆ | 8 |
| 09 | Oppenheimer | 2023 | ★★★★½ | ★★★★☆ | 8.5 |
| 10 ★ | Project Hail Mary | 2025 | ★★★★★ | ★★★★★ | 10 |
| 11 | The Amazing Spider-Man | 2012 | ★★★½☆ | ★★★☆☆ | 6.5 |
| 12 | Whiplash | 2014 | ★★★★½ | ★★★★☆ | 8.5 |
| 13 | The Taking of Deborah Logan | 2014 | ★★★☆☆ | ★★★★☆ | 7 |
| 14 | Ratatouille | 2007 | ★★★★☆ | ★★★★★ | 9 |
| 15 | Ozark | 2017 | ★★★★☆ | ★★★★☆ | 8 |
| 16 | The Holdovers | 2023 | ★½☆☆☆ | ★★★★★ | 6.5 |

**To add a film**, open the Atelier and copy an existing `.movie-item` block, update the number, title, year, and star spans. After adding, recalculate totals and move the `top-rated` class to whichever film(s) score highest — this colours only the title in soft gold (`#D4A017`), no background change.

---

## Spotify now-playing widget

Netlify serverless function at `netlify/functions/now-playing.js`.

- Fetches current playback from Spotify API using a refresh token
- Returns `{ isPlaying, title, artist, albumArt, songUrl }` or `{ isPlaying: false }`
- No debug responses — all error paths return clean `{ isPlaying: false }`
- CORS locked to `https://tiagomole.com` only
- Widget label reads **"Tiago is playing"** when active, **"Last Played"** when paused
- Fetches every 30s via `setInterval`, also re-fetches immediately on:
  - `pageshow` with `event.persisted === true` (browser back/forward bfcache restore)
  - `visibilitychange` when `document.visibilityState === 'visible'` (tab switch)

**Environment variables** (set in Netlify dashboard — never commit):

| Key | Notes |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | From Spotify developer dashboard |
| `SPOTIFY_CLIENT_SECRET` | From Spotify developer dashboard |
| `SPOTIFY_REFRESH_TOKEN` | Regenerate if token becomes invalid |

**To regenerate the refresh token:**
1. Ask Claude to recreate `get-token.js` (it has the template)
2. Run: `. "$HOME/.nvm/nvm.sh" && cd ~/tiagomole.com && node get-token.js`
3. Log in to Spotify in the browser that opens
4. Copy the printed refresh token
5. Update `SPOTIFY_REFRESH_TOKEN` in Netlify → Site config → Environment variables
6. Trigger a redeploy, then delete `get-token.js`

**Spotify app settings:**
- Dashboard: https://developer.spotify.com/dashboard
- Redirect URIs: `https://tiagomole.com/` and `http://127.0.0.1:8888/callback`
- Scopes: `user-read-currently-playing user-read-playback-state`

---

## Security

- Password check for the Atelier is **server-side only** (`rocky-auth.js`)
- the Atelier is gated by a Netlify Edge Function — the page cannot be accessed without a valid session cookie, even if the URL is known
- `ROCKY_PASSWORD_HASH` lives in Netlify env vars — not in any file
- Spotify credentials are env vars only — never in source

---

## Deployment

Push to `main` → Netlify auto-deploys in ~15 seconds. No build step needed.

```bash
git add <files>
git commit -m "message"
git push
```

---

## Outstanding TODOs

- [ ] T ratings missing for 10 films in the Atelier — fill in when Tiago has watched them
- [ ] Writing section on homepage — scroll reveal animations can be slow, may want to tune timing
- [ ] Consider adding more content sections to the Atelier (photos, letter, places to visit together)
