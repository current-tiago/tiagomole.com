# tiagomole.com

Personal portfolio site for Tiago Branco Mole — economist, entrepreneur, writer.

Live at **[tiagomole.com](https://tiagomole.com)**

---

## Stack

- Pure HTML/CSS/JS — no framework
- Hosted on **Netlify** (auto-deploys from `main` branch on GitHub)
- Serverless functions for Spotify integration and Rocky's Home auth

---

## Structure

```
/
├── index.html                        # Main portfolio page (hero, writing, ventures, about)
├── europe-map.svg                    # Western Europe SVG map for hero-right panel
├── rh-e3f7a92c1d.html               # Rocky's Home (password-gated, private)
├── work.html                         # Full article archive
├── entrepreneurial-ventures.html
├── historical-perspectives.html
├── how-poland-caused-german-unification.html
├── how-to-be-a-dictator.html
├── macroeconomic-analysis.html
├── policy-research.html
├── write-article.html
├── netlify.toml                      # Netlify config (functions + redirect rules)
├── netlify/
│   └── functions/
│       ├── now-playing.js            # Spotify "now playing" serverless function
│       └── rocky-auth.js             # Server-side password auth for Rocky's Home
├── HANDOVER.md                       # Full context for new Claude sessions
└── README.md
```

---

## Design

- **Fonts**: Cormorant Garamond (serif, headings) + DM Mono (metadata, labels)
- **Colours**: Cream `#F5F0E8` background · Ink `#0D0D0D` · Orange accent `#FF8800`
- **Style**: Editorial / high-end print — asymmetric grid, noise texture overlay, scroll reveals

---

## Europe Map

The hero-right panel shows a faded SVG map of Western Europe (`europe-map.svg`), generated from Natural Earth 10m country data. Portugal and the UK are shaded darker. Cities marked: **Lisbon**, **Barcelona**, **Frankfurt**.

See `HANDOVER.md` for regeneration instructions and how to add new city markers.

---

## Spotify "Now Playing" Widget

Fixed bottom-right widget — always expanded. Shows current track or "Last Played" when paused. Calls `/.netlify/functions/now-playing` every 30 seconds.

**Env vars required in Netlify:**

| Key | Notes |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | From Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | From Spotify Developer Dashboard |
| `SPOTIFY_REFRESH_TOKEN` | Regenerate if token becomes invalid — see HANDOVER.md |

---

## Rocky's Home

A private page (`rh-e3f7a92c1d.html`) accessible via a hidden button in the footer. Password is validated server-side by `rocky-auth.js` — no credentials in public source. The old URL `/rockys-home.html` returns 404.

**Env var required:**

| Key | Notes |
|-----|-------|
| `ROCKY_PASSWORD_HASH` | SHA-256 hash of the password (Netlify dashboard) |

Contains: poems, a countdown to her arrival in Lisbon, and a films-watched section with dual star ratings (T = Tiago in orange, R = Rocky in pink).

---

## Adding Content

### New article
1. Create a new `.html` file (copy an existing one as a template)
2. Add a new `.movie-item` row in the **Writing** section of `index.html`
3. Update number, tag, title, and description

### New film to Rocky's Home
Copy an existing `.movie-item` block in `rh-e3f7a92c1d.html`, update number/title/year and star spans. Star classes: `star-t`, `star-r`, `star-empty`, `star-half-t`, `star-half-r`.

### New venture
Add a new `<a class="venture-item">` block in the **Ventures** section of `index.html`.

---

## Deployment

Push to `main` → Netlify auto-deploys. Takes ~15 seconds.

```bash
git add . && git commit -m "your message" && git push
```

---

## Contact

[tiagobrancomole@gmail.com](mailto:tiagobrancomole@gmail.com)
