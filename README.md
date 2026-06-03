# tiagomole.com

Personal portfolio site for Tiago Branco Mole — economist, entrepreneur, writer.

Live at **[tiagomole.com](https://tiagomole.com)**

---

## Stack

- Pure HTML/CSS/JS — no framework
- Hosted on **Netlify** (auto-deploys from `main` branch on GitHub)
- Serverless function for Spotify integration (`netlify/functions/now-playing.js`)

---

## Structure

```
/
├── index.html                        # Main portfolio page (hero, writing, ventures, about)
├── europe-map.svg                    # Western Europe map for hero-right panel
├── rockys-home.html                  # Password-gated poetry page
├── work.html                         # Full article archive
├── entrepreneurial-ventures.html
├── historical-perspectives.html
├── how-poland-caused-german-unification.html
├── how-to-be-a-dictator.html
├── macroeconomic-analysis.html
├── policy-research.html
├── write-article.html
├── netlify.toml                      # Netlify config (functions directory)
├── netlify/
│   └── functions/
│       └── now-playing.js            # Spotify "now playing" serverless function
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

The hero-right panel shows a faded SVG map of Western Europe (`europe-map.svg`), generated from Natural Earth 10m country data using a Mercator projection. Portugal and the UK are shaded slightly darker. Three cities are marked with orange dots: **Lisbon**, **Barcelona**, and **Frankfurt**.

See `HANDOVER.md` for regeneration instructions and how to add new city markers.

---

## Spotify "Now Playing" Widget

Shows a live widget in the bottom-right corner when Spotify is playing. Calls `/.netlify/functions/now-playing` every 30 seconds.

**Env vars required in Netlify:**

| Key | Notes |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | From Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | From Spotify Developer Dashboard |
| `SPOTIFY_REFRESH_TOKEN` | Generated via `get-token.js` — see HANDOVER.md |

If the token expires (`invalid_grant` error), regenerate it — full instructions in `HANDOVER.md`.

---

## Adding Content

### New whitepaper / article
1. Create a new `.html` file (copy an existing one as a template)
2. Add a new `<a class="writing-item">` block in the **Writing** section of `index.html`
3. Update `href`, `writing-tag`, `writing-title`, and `writing-desc`

### New venture / project
1. Add a new `<a class="venture-item">` block in the **Ventures** section of `index.html`
2. Update the number, name, description, and `href`

---

## Deployment

Push to `main` → Netlify auto-deploys. Takes ~15 seconds.

```bash
git add . && git commit -m "your message" && git push
```

---

## Contact

[tiagobrancomole@gmail.com](mailto:tiagobrancomole@gmail.com)
