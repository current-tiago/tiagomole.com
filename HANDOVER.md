# Handover File — tiagomole.com

Last updated: 3 June 2026

---

## Project overview

Personal website for Tiago Branco Mole. Hosted on **Netlify**, connected to GitHub:
`https://github.com/current-tiago/tiagomole.com`

Local path: `~/tiagomole.com`

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
index.html                  — homepage
rockys-home.html            — poetry page (Rocky's Home)
entrepreneurial-ventures.html
historical-perspectives.html
how-poland-caused-german-unification.html
how-to-be-a-dictator.html
macroeconomic-analysis.html
policy-research.html
work.html
write-article.html
netlify/functions/
  now-playing.js            — Spotify serverless function
netlify.toml
```

---

## Homepage (index.html)

Sections in order:
1. **Hero** — name, description, nav links to Writing / Ventures / Rocky's Home
2. **Writing** (`#writing`) — numbered list of 6 articles
3. **Ventures** (`#ventures`) — Swapdesk + placeholder
4. **About** (`#about`) — bio + meta grid
5. **Footer**
6. **Spotify widget** — fixed bottom-right, fetches from `/.netlify/functions/now-playing` every 30s

Nav links: Writing · Ventures · Rocky's Home · About · Contact

---

## Rocky's Home (rockys-home.html)

Poetry page. Linked from the main nav and hero. Dark-mode page (ink background, cream text) with the same font system.

**Design:** Full-viewport hero with "Rocky's / *Home*" title, ghost "Rocky" watermark in outline text behind it. Poems listed below with Roman numeral indexing (I–V), large ghost numerals per poem, scroll-reveal fade-ins.

**Poems (in order):**
| # | Title |
|---|-------|
| I | Sample no.1 |
| II | View of the Room |
| III | T-3 Weeks |
| IV | Studying |
| V | Orpheus |

**TODO:** The colour scheme of the poems section should match the main site (cream background, ink text) rather than the current dark theme. User requested this but it was not completed — needs a redesign of the `.poems` section to flip to light mode while keeping the dark hero. Stick figure SVG illustrations were also requested per poem but not yet added.

---

## Spotify now-playing widget

Netlify serverless function at `netlify/functions/now-playing.js`.

- Fetches current playback from Spotify API using a refresh token
- Returns `{ isPlaying, title, artist, albumArt, songUrl }`
- If paused, shows last played track labelled "Last Played"
- Widget is fixed bottom-right, fades in when data is available

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

## Deployment

Push to `main` → Netlify auto-deploys. No build step needed.

```bash
git add <files>
git commit -m "message"
git push origin main
```

---

## Outstanding TODOs

- [ ] Flip Rocky's Home poem section to light (cream/ink) colour scheme — currently dark, user wants it to match the rest of the site
- [ ] Add hand-drawn SVG stick figure illustrations next to each poem in Rocky's Home
- [ ] Clean up debug responses in `now-playing.js` (returns `{ debug: "..." }` in some error paths instead of `{ isPlaying: false }`)
- [ ] Confirm Spotify widget is working after last token refresh
