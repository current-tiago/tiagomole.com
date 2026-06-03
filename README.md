# tiagomole.com

Personal portfolio site for Tiago Branco Mole — economist, entrepreneur, writer.

Live at **[tiagomole.com](https://tiagomole.com)**

> **Claude instruction:** Never open or launch a browser preview. Edit files directly — Netlify auto-deploys on push.

---

## Stack

- Pure HTML/CSS/JS — no framework
- Hosted on **Netlify** (auto-deploys from `main` branch on GitHub)
- Serverless functions for Spotify integration and the Atelier auth

---

## Structure

```
/
├── index.html                                  # Main portfolio page (hero, writing, ventures, about)
├── europe-map.svg                              # Western Europe SVG map for hero-right panel
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
├── [private]                                   # the Atelier (password-gated)
│
├── netlify.toml                                # Netlify config (functions + redirect rules)
├── netlify/
│   └── functions/
│       ├── now-playing.js                      # Spotify "now playing" serverless function
│       └── rocky-auth.js                       # Server-side password auth for the Atelier
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

## Spotify "Now Playing" Widget

Fixed bottom-right widget. Shows current track as **"Tiago is playing"** or **"Last Played"** when paused. Calls `/.netlify/functions/now-playing` every 30 seconds, and also refreshes immediately on tab focus and browser back-navigation (bfcache restore).

**Env vars required in Netlify:**

| Key | Notes |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | From Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | From Spotify Developer Dashboard |
| `SPOTIFY_REFRESH_TOKEN` | Regenerate if token becomes invalid — see HANDOVER.md |

---

## the Atelier

A private page accessible via a hidden button in the footer. Password is validated server-side by `rocky-auth.js` — no credentials in public source.

**Env var required:**

| Key | Notes |
|-----|-------|
| `ROCKY_PASSWORD_HASH` | SHA-256 hash of the password (Netlify dashboard) |

Contains: five poems (accordion layout), a countdown to her arrival in Lisbon, and a **Films We've Watched** section with dual star ratings (T = Tiago in orange, R = Imy in pink). 16 films currently listed. The film(s) with the highest combined T+R score have their title rendered in soft gold (`top-rated` class → `.movie-title` colour `#C9A55A`).

---

## Adding Content

### New article
1. Create a new `.html` file (copy `how-to-be-a-dictator.html` as template)
2. Add a new `.writing-item` row in the **Writing** section of `index.html` (increment the number)
3. Add to the relevant category page (e.g. `policy-research.html`)

### New film to the Atelier
Open the Atelier and copy an existing `.movie-item` block, update number/title/year and star spans. Star classes: `star-t`, `star-r`, `star-empty`, `star-half-t`, `star-half-r`. After adding, recalculate combined T+R scores and add/move the `top-rated` class to the highest-scoring film(s) — this turns the title soft gold (`#C9A55A`).

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
