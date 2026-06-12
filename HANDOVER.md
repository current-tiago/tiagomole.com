# Handover File — tiagomole.com

Last updated: 4 June 2026

---

> **Claude instruction:** Never open or launch a browser preview. Make all changes directly to the HTML files and let Netlify handle deployment.

---

## Project overview

Personal website for Tiago Branco Mole. Hosted on **Netlify**, connected to GitHub:
`https://github.com/current-tiago/tiagomole.com`

Local path: `/Users/tiagobranco-mole/Desktop/tiagomole.com`

Stack: pure HTML/CSS/JS — no build step, no framework. Deploy by pushing to `main`.

One Node.js dependency: `@netlify/blobs` (used by the thoughts function). `package.json` exists only for that — all other functions use Node.js built-ins.

---

## Design system

**See `DESIGN.md` for the full design system** — aesthetic rules, typography recipes, layout patterns, motion, the Rocky's Home duet motif, and the checklist for new work. Quick token reference:

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
lisbon-map.svg                            — Detailed Lisbon SVG map used in Rocky's Home
world-map.svg                             — World map (equirectangular) used in the Famous Person game

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

[private page]                            — Rocky's Home (password-gated)

netlify/functions/
  now-playing.js                          — Spotify serverless function
  rocky-auth.js                           — server-side password auth for Rocky's Home
netlify/edge-functions/
  rocky-gate.js                           — edge function that gates Rocky's Home (cookie check)
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
   - Label shows state: "Enter password" → "Checking…" (request in flight, re-submits ignored) → "Welcome back" in orange (brief beat, then redirect). Network failure shows "Connection — try again" — distinct from a wrong password (shake).
   - Modal has `role="dialog"` / `aria-modal`, the label is a real `<label for>`, and the input uses `autocomplete="current-password"` so password managers work. Escape closes via a document-level listener; input is focused synchronously on click (iOS keyboard).
   - Visiting `/?atelier` auto-opens the modal (the URL is cleaned via `history.replaceState`). The edge function redirects expired/missing sessions there.

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

## Lisbon map (lisbon-map.svg)

Hand-crafted SVG map used at the bottom of Rocky's Home. Coordinate system:

```
x = (9.245 - lon) / 0.185 * 600
y = (38.810 - lat) / 0.130 * 400
Covers: 9.060°W–9.245°W, 38.680°N–38.810°N   (viewBox="0 0 600 400")
```

**Key feature:** The Tagus River (Rio Tejo) path curves sharply northward on the east side of the map, reaching up to y≈156 at Parque das Nações — this is geographically accurate (the estuary widens dramatically there).

**Orange dots (6 locations):**

| Location | Lat/Lon | SVG x,y |
|----------|---------|---------|
| Oceanário de Lisboa | 38.7633°N, 9.0950°W | 487, 144 |
| Campo Pequeno | 38.7390°N, 9.1455°W | 323, 218 |
| Praça do Comércio | 38.7076°N, 9.1364°W | 352, 315 |
| Av. da Liberdade (Marquês de Pombal) | 38.7253°N, 9.1491°W | 311, 260 |
| Torre de Belém | 38.6916°N, 9.2160°W | 94, 362 |
| Castelo de São Jorge | 38.7139°N, 9.1335°W | 362, 296 |

**To move or add a dot**, use the coordinate formula above to convert lat/lon to SVG x,y. Each dot is three circles (outer ring opacity 0.25, mid ring opacity 0.50, filled core r=3.8) plus two text labels above.

---

## Rocky's Home

Private page for Imy (Tiago's partner). Accessed via a hidden password button in the footer of the main site.

**Security model:**
- Password validated **server-side** by `netlify/functions/rocky-auth.js`
- Hash comparison uses `crypto.timingSafeEqual` (constant-time)
- Per-IP brute-force throttle: 10 failures per 10-minute window → 429; each failure also delays the response 500ms. In-memory, so it resets when the function instance goes cold — a deterrent, not a guarantee.
- On correct password, the auth function sets a `rh_session` cookie (HMAC-SHA256, 7-day expiry)
- A Netlify Edge Function (`netlify/edge-functions/rocky-gate.js`) gates the page — no valid cookie, no access. Missing/expired sessions redirect to `/?atelier`, which auto-opens the password modal on the homepage.
- `ROCKY_PASSWORD_HASH` lives in Netlify env vars — not in any file
- No credentials, hashes, or page paths are exposed in public docs
- **⚠️ If the private page is ever renamed:** the session cookie is scoped with `Path=/<page>.html`. A rename requires updating **three** places or all sessions silently break: the `Set-Cookie` path + `path` in the JSON response (`rocky-auth.js`) and the `config.path` (`rocky-gate.js`).

**Netlify env vars required:**

| Key | Value |
|-----|-------|
| `ROCKY_PASSWORD_HASH` | SHA-256 hash of the password (set in Netlify dashboard) |

**Personal design motifs** (added June 2026): the page is a "duet" — orange `--red` = Tiago, pink `--pink: #e8829a` = Imy (same language as the film star ratings). Touches: faint pink radial blush in the hero background; story filmstrip dots alternate orange/pink; films legend "T Tiago · I Imy"; daily-thing eyebrow "for today"; an empty dashed "to be continued" frame closes the filmstrip; footer line "made with love in Lisbon · 38.72° N · 9.14° W". (Portuguese sub-labels and a giant ghost "2" behind the hero were tried and removed at Tiago's request — don't reintroduce.) The countdown label reads "Until I see **you** next" — the whole page addresses Imy directly.

**Page sections in order:**
1. **Hero** — large serif title "Rocky's / *Home*", subtitle, countdown (top-right), meta block (bottom-right)
   - **Meta block count-up** (`#since-clock`): calendar-aware "Xy Xm Xd Xh" ticking up from **April 11 2026, 01:00 Lisbon** (`2026-04-11T01:00:00+01:00`), shown under "April 11th — present"
   - **Top-right countdown**: "Until I see her next" + DD:HH:MM:SS down to **June 24 2026, 23:00 Lisbon** (`2026-06-24T23:00:00+01:00`); hides itself once reached. Update `nextVisit` for future visits. (The original June 6–11 arrival/departure phases are gone from the code.)
2. **Five Poems** (`#poems`) — accordion layout (max-width 600px, centred); each poem shows only its title until clicked, then expands smoothly. Only one open at a time. Toggle indicator `+` / `×` in DM Mono.
   - I · Sample no.1 · II · View of the Room · III · T-3 Weeks · IV · Studying · V · Orpheus
3. **Films We've Watched** (`#movies`) — numbered list of 17 films in **two newspaper columns** on desktop (chronological down each column via `grid-auto-flow: column`; `grid-template-rows: repeat(9, auto)` — **bump the 9 to ceil(n/2) when adding films**; single column on mobile), with dual star ratings:
   - **T** = Tiago's rating (orange `#FF8800` stars)
   - **I** = Imy's rating (pink `#e8829a` stars)
   - Stars out of 5; half-stars supported via CSS `linear-gradient` clip trick
   - Star classes: `star-t`, `star-r`, `star-empty`, `star-half-t`, `star-half-r`
   - Film(s) with the highest combined T+I score get class `top-rated` — only the title text is coloured soft gold (`#D4A017`). Currently tied: 01 Train Dreams and 10 Project Hail Mary (both 10/10)
   - **Clicking a film title** expands a description panel below that row (exclusive accordion). Panel shows: director in DM Mono red caps, synopsis in Cormorant italic, genre tags in small DM Mono.
4. **Something I Love About You** (`#daily-draw`) — daily famous person game (see below)
5. **Thoughts About You** (`#thoughts`) — Tiago's daily thoughts, posted from his phone, revealed at **21:00 Lisbon** each day
   - Backend: `netlify/functions/thoughts.mjs` (functions v2, ESM) + **Netlify Blobs** store `thoughts`, key `list` (JSON array of `{d, t, ts}`)
   - **POST** `{token, text}` (token = `THOUGHTS_WRITE_TOKEN` env var) appends a thought — sent from an iOS Shortcut on Tiago's phone
   - **GET** `?k=<THOUGHTS_READ_KEY>` returns **only today's thoughts, and only after 21:00 Lisbon** (`REVEAL_HOUR` constant). Previous days' thoughts remain stored in the blob but are never returned — the section shows just tonight's thought(s). Page re-fetches every 5 min + on tab focus, so the reveal appears without a reload
   - Read key is embedded in this gated page's JS (`THOUGHTS_KEY`); write token lives only in Netlify env + the Shortcut
   - **Env vars required:** `THOUGHTS_WRITE_TOKEN`, `THOUGHTS_READ_KEY` (Netlify dashboard) — feature is dead until both are set
   - Section is `display:none` until the fetch returns at least one thought
6. **Our Story** (`#story`) — **horizontal filmstrip** timeline (was vertical; rebuilt to kill page length): a draggable `overflow-x` strip (`#story-strip`) of 230px polaroid cards threaded on a horizontal line with an orange dot per card
   - Interactions: drag-to-scroll (pointer events), vertical mouse-wheel scrolls the strip horizontally while it has room (releases at the ends), scroll-snap, edge gradient fades, "first to last · drag →" hint
   - Each `.story-item` = `.story-photo` (3:4 portrait frame, slight polaroid tilt, straightens on hover) + `.story-text-block` (DM Mono orange date, serif title, italic caption)
   - **30 real photos** (Jan 29 → Jun 11 2026), stored in `rh-m/` with hashed unguessable filenames (`rh-<sha1-10>.jpg`). Source photos live in `~/Desktop/imy photos` on Tiago's Mac; deployed copies are resized to max 1600px, JPEG q78, **EXIF/GPS stripped** (PIL fresh-save). Dates in entries come from EXIF capture dates.
   - Images use `loading="lazy"`. To add an entry: copy a `.story-item` block, process the new photo the same way (resize + strip metadata + hash name into `rh-m/`)
   - Captions were verified against the actual photo contents (via thumbnails). Four entries are uncaptioned extras with Claude-written captions Tiago may want to reword: Apr 10 tricycle ("Lisbon, at night"), Jun 10 restaurant terrace ("Lunch in the sun"), Jun 10 peacock + Jun 10 castle walls (Castelo de São Jorge)
   - On mobile the line moves to the left edge and items stack (photo below text)
   - Items use the same scroll-reveal observer as film rows
7. **Frivolous Measurements** (`#measures`) — three live counters of time dating (since `sinceTime`, April 11 2026 01:00 Lisbon), updated every second in `updateClocks()`:
   - Plays of "Jane!" by The Long Faces back to back (3:06 = 186 s)
   - Full viewings of Oppenheimer (3 h = 10 800 s)
   - Flights between Stansted and Lisbon (2 h 50 = 10 200 s)
   - To add a unit: copy a `.silly-item`, add one line in `updateClocks()` with the unit's seconds
8. **Lisbon** — full-width SVG map of Lisbon with 6 orange location dots
9. **Footer**

**Current film list (in order):**

| # | Title | Year | T | I | Total |
|---|-------|------|---|---|-------|
| 01 ★ | Train Dreams | 2025 | ★★★★★ | ★★★★★ | 10 |
| 02 | Blair Witch Project | 1999 | ★★½☆☆ | ★★★½☆ | 6 |
| 03 | Creep | 2014 | ★★★½☆ | ★★★★☆ | 7.5 |
| 04 | Creep 2 | 2017 | ★★☆☆☆ | ★★☆☆☆ | 4 |
| 05 | Murder Mystery | 2019 | ★★★☆☆ | ★★★☆☆ | 6 |
| 06 | Inglourious Basterds | 2009 | ★★★★★ | ★★★★½ | 9.5 |
| 07 | Pursuit of Happyness | 2006 | ★★★½☆ | ★★★☆☆ | 6.5 |
| 08 | Nightcrawler | 2014 | ★★★★☆ | ★★★★☆ | 8 |
| 09 | Oppenheimer | 2023 | ★★★★½ | ★★★★☆ | 8.5 |
| 10 ★ | Project Hail Mary | 2025 | ★★★★★ | ★★★★★ | 10 |
| 11 | Spider-Man | 2002 | ★★★½☆ | ★★★☆☆ | 6.5 |
| 12 | Whiplash | 2014 | ★★★★½ | ★★★★☆ | 8.5 |
| 13 | The Taking of Deborah Logan | 2014 | ★★★☆☆ | ★★★★☆ | 7 |
| 14 | Ratatouille | 2007 | ★★★★☆ | ★★★★★ | 9 |
| 15 | Ozark | 2017 | ★★★★☆ | ★★★★☆ | 8 |
| 16 | The Holdovers | 2023 | ★½☆☆☆ | ★★☆☆☆ | 3.5 |
| 17 | Conclave | 2024 | ★★★★☆ | ★★★★☆ | 8 |

**To add a film**, copy an existing `.movie-item` block. Each block contains: `.movie-item-row` (the 3-column grid of num / title+year / ratings) and `.movie-desc-wrap` (the hidden description panel). Update the number, title, year, star spans, and description text (director, synopsis, genre). After adding, recalculate totals and move the `top-rated` class to whichever film(s) score highest.

---

## Famous Person Game ("Something I Love About You")

A daily geography-guessing game. Located entirely in `rh-e3f7a92c1d.html` (pure client-side — no server function needed).

**How it works:**
- A world map (`world-map.svg`, equirectangular, viewBox 0 0 2000 1000) is shown with two circles overlaid via an inline SVG:
  - **Green circle** = birth city + birth year
  - **Red circle** = death city + death year
- The player types a guess (full name or last name accepted, case-insensitive).
- On a correct guess: the name, a one-line description, and a fun fact are revealed.
- On a wrong guess: the attempt count increments; the player can keep guessing or click "Give up & reveal".
- **Resets daily at 14:00 Lisbon time** — same `todayStr()` logic as before.

**Daily rotation:**
- Day 0 (June 4 2026) = Trotsky. Cycles through `FAMOUS_PEOPLE` array sequentially.
- Epoch: `const GAME_EPOCH = new Date('2026-06-04')` in the script.
- Formula: `dayNum % FAMOUS_PEOPLE.length`

**The people** are defined in the `FAMOUS_PEOPLE` array in `rh-e3f7a92c1d.html`. Each entry has:
```js
{
  name: "...",
  hint: "...",          // short descriptor shown after reveal
  born: { city, lat, lon, year },
  died: { city, lat, lon, year },
  fact: "...",          // one interesting sentence shown after reveal
}
```
To add more people, append to the array. Order matters — don't reorder existing entries, as it shifts the rotation. (If an entry must be swapped out, replace it **in place** so positions don't shift.)

**RULE: never use people born and died in the same place (or very close together)** — the green and red circles end up on top of each other on the world map. Keep birth and death locations clearly separated (think hundreds of km minimum; the map is 2000px wide for 360° of longitude).

**Map coordinates** use equirectangular projection:
```
x = (lon + 180) / 360 * 2000
y = (90  - lat) / 180 * 1000
```

**localStorage key:** `rocky_famous_v1`  
**State shape:** `{ day, solved, revealed, attempts[] }`

**Daily "thing I love about you"** — shown below the game **only after a correct guess** (not on give-up). Defined in the `THINGS` array (18 entries) in `rh-e3f7a92c1d.html`. Uses the same `GAME_EPOCH` and `dayNum` as the famous person game, cycling through independently (`dayNum % THINGS.length`). To add more, append to the array — never reorder or remove existing entries.

**Current people (in rotation order):**
1. Leon Trotsky — born Ukraine, died Mexico City
2. Nikola Tesla — born Croatia, died New York
3. Karl Marx — born Germany, died London
4. Pablo Picasso — born Málaga, died Mougins (France)
5. Napoleon Bonaparte — born Corsica, died Saint Helena
6. Che Guevara — born Argentina, died Bolivia
7. Marie Curie — born Warsaw, died France
8. Simón Bolívar — born Venezuela, died Colombia
9. Joseph Stalin — born Gori (Georgia), died Moscow
10. Liam Payne — born Wolverhampton, died Buenos Aires
11. Princess Diana — born Sandringham, died Paris
12. Albert Einstein — born Ulm, died Princeton
13. Freddie Mercury — born Zanzibar, died London
14. John Lennon — born Liverpool, died New York
15. Vincent van Gogh — born Netherlands, died France
16. Mahatma Gandhi — born Porbandar, died New Delhi

Guess matching (`checkGuess`): full name, any single word > 3 chars, or any multi-word tail of the name (so "van gogh" works for Vincent van Gogh).

**world-map.svg** — generated from Natural Earth 110m countries topojson (`world-atlas@2`). Equirectangular projection, viewBox 0 0 2000 1000. Countries filled `rgba(13,13,13,0.07)`, stroked `rgba(13,13,13,0.18)`. To regenerate: run `/tmp/gen-world-svg.js` with `node`.

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

- Password check for Rocky's Home is **server-side only** (`rocky-auth.js`)
- Rocky's Home is gated by a Netlify Edge Function — the page cannot be accessed without a valid session cookie, even if the URL is known
- `ROCKY_PASSWORD_HASH` lives in Netlify env vars — not in any file
- Spotify credentials are env vars only — never in source
- Lottery draw state is server-side (Netlify Blobs) — no sensitive data, but ensures integrity of the shared draw

---

## Deployment

Push to `main` → Netlify auto-deploys in ~15–30 seconds. No build step, no `npm install` — pure static files + serverless functions.

```bash
git add <files>
git commit -m "message"
git push
```

---

## Outstanding TODOs

- [ ] T ratings missing for some films — fill in when Tiago has watched them
- [ ] Writing section on homepage — scroll reveal animations can be slow, may want to tune timing
- [ ] Consider adding more content sections to Rocky's Home (photos, letter, places to visit together)
