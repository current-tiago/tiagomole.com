# Handover File — tiagomole.com

Last updated: 3 June 2026 (evening)

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

**Fonts:** Cormorant Garamond (serif display) + DM Mono (labels, nav, mono elements). Both loaded from Google Fonts.

**Shared patterns:** noise texture overlay on `body::before`, scroll-reveal via `IntersectionObserver` (`.reveal` → `.visible`), fixed header with gradient fade.

---

## File structure

```
index.html                        — homepage
europe-map.svg                    — Western Europe SVG map used in hero-right
rh-e3f7a92c1d.html                — Rocky's Home (password-gated, secret filename)
entrepreneurial-ventures.html
historical-perspectives.html
how-poland-caused-german-unification.html
how-to-be-a-dictator.html
macroeconomic-analysis.html
policy-research.html
work.html
write-article.html
netlify/functions/
  now-playing.js                  — Spotify serverless function
  rocky-auth.js                   — Server-side password auth for Rocky's Home
netlify.toml                      — Functions directory + redirect rules
```

---

## Homepage (index.html)

Sections in order:
1. **Hero** — two-column layout split by a vertical line
   - Left: name, eyebrow, description, CTA links
   - Right: faded Western Europe SVG map with city markers, coordinates at bottom-right
2. **Writing** (`#writing`) — numbered horizontal list (01–06), each row: number · tag · title · description
3. **Ventures** (`#ventures`) — Swapdesk + placeholder
4. **About** (`#about`) — bio + meta grid
5. **Footer**
6. **Spotify widget** — fixed bottom-right, always expanded, fetches every 30s. Shows "Now Playing" or "Last Played" (retains last track when paused)
7. **Rocky's Home modal** — hidden password button in footer triggers overlay; password validated server-side via `rocky-auth` function

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

## Rocky's Home (rh-e3f7a92c1d.html)

Private page for Rocky (Tiago's girlfriend). Accessed via a hidden password button in the footer of the main site.

**Security model:**
- The real file is `rh-e3f7a92c1d.html` (unguessable filename)
- `/rockys-home.html` returns 404 via netlify.toml redirect
- Password is validated **server-side** by `netlify/functions/rocky-auth.js`
- No hash or password is exposed in any public JS
- On correct password, the auth function returns `{ ok: true, path: '/rh-e3f7a92c1d.html' }`

**Netlify env var required:**

| Key | Value |
|-----|-------|
| `ROCKY_PASSWORD_HASH` | SHA-256 hash of the password (set in Netlify dashboard) |

**Page contents:**
- Hero: "Rocky's / *Home*" title, subtitle "A little section just for your eyes", countdown timer (top-right), meta block (bottom-right)
- **Countdown**: ticks down to June 6 2026 09:00 Lisbon time (UTC+1). Shows "Arriving in Lisbon" once it hits zero.
- **Five poems** — centred broadsheet column layout (600px max-width, centred on page, scroll-reveal fade-in):
  - I · Sample no.1 · II · View of the Room · III · T-3 Weeks · IV · Studying · V · Orpheus
  - Large italic title (up to 3.5rem), generous line-height verse text (1.2rem), ghost Roman numeral floating right of each title
- **Films We've Watched** section: numbered list with dual star ratings
  - **T** = Tiago's rating (orange `#FF8800` stars)
  - **R** = Rocky's rating (pink `#e8829a` stars)
  - Stars out of 5, half stars supported via CSS gradient trick
  - Current films: Project Hail Mary · Inglourious Basterds · Nightcrawler · The Amazing Spider-Man · Whiplash · The Holdovers · The Disappearance of Hannah Grace
  - **Note:** Most ratings are placeholders — update with real scores when provided

**To add a film**, copy an existing `.movie-item` block in `rh-e3f7a92c1d.html` and update the number, title, year, and star spans. Star classes: `star-t` (orange), `star-r` (pink), `star-empty`, `star-half-t`, `star-half-r`.

---

## Spotify now-playing widget

Netlify serverless function at `netlify/functions/now-playing.js`.

- Fetches current playback from Spotify API using a refresh token
- Returns `{ isPlaying, title, artist, albumArt, songUrl }` or `{ isPlaying: false }`
- No debug responses — all error paths return clean `{ isPlaying: false }`
- CORS locked to `https://tiagomole.com` only
- Widget is always expanded (no hover resize)
- Shows "Last Played" with last track when paused; hides only if no track has played this session

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

- Password check for Rocky's Home is **server-side only** (`rocky-auth.js`)
- `ROCKY_PASSWORD_HASH` lives in Netlify env vars — not in any file
- `/rockys-home.html` is blocked via 404 redirect in `netlify.toml`
- Spotify credentials are env vars only — never in source
- Wayback Machine has no snapshots of Rocky's Home (confirmed June 2026)

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

- [ ] Update film star ratings with accurate scores from Tiago and Rocky
- [ ] Consider adding more content sections to Rocky's Home (photos, letter, places to visit together)
- [ ] Writing section on homepage — scroll reveal animations can be slow, may want to tune timing
