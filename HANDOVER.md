# Handover File — tiagomole.com Spotify Widget

## What was built
A "now playing on Spotify" widget on tiagomole.com. When you're actively playing a song on Spotify, a small pill appears in the **bottom-right corner** of the page showing the album art, song title, and artist. Clicking it opens the song in Spotify.

---

## Project location
`~/tiagomole.com`

Hosted on **Netlify**, connected to GitHub repo: `https://github.com/current-tiago/tiagomole.com`

---

## Files added/modified

### `netlify/functions/now-playing.js`
Netlify serverless function. Called by the frontend every 30 seconds. It:
1. Uses the refresh token to get a fresh Spotify access token
2. Calls `https://api.spotify.com/v1/me/player`
3. Returns `{ isPlaying, title, artist, albumArt, songUrl }` or `{ isPlaying: false }`

**NOTE:** This function currently has debug responses mixed in (e.g. returns `{ debug: "..." }` instead of clean `{ isPlaying: false }` in error cases). Once confirmed working, clean these up to just return `{ isPlaying: false }`.

### `netlify.toml`
Tells Netlify where the functions directory is:
```toml
[functions]
  directory = "netlify/functions"
```

### `juku/index.html` → actually `index.html` in root
The main page. Added:
- CSS for `#now-playing` widget (fixed bottom-right, pill shape, fade-in)
- HTML for the widget (hidden by default, shown when playing)
- JS that calls `/.netlify/functions/now-playing` on load and every 30 seconds

---

## Netlify environment variables
Set in Netlify → Site config → Environment variables:

| Key | Value |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | (in Netlify — do not commit) |
| `SPOTIFY_CLIENT_SECRET` | (in Netlify — do not commit) |
| `SPOTIFY_REFRESH_TOKEN` | (in Netlify — do not commit) |

### Refresh token notes
Refresh tokens get **invalidated every time you run get-token.js**. Keep only one valid token in Netlify at a time.
Never commit token values to the repo — Netlify will block the deploy if it detects them.

If the token stops working, regenerate using `get-token.js` (see below).

---

## Spotify Developer App
- Dashboard: https://developer.spotify.com/dashboard
- App name: (whatever you named it)
- Redirect URIs configured:
  - `https://tiagomole.com/`
  - `http://127.0.0.1:8888/callback`
- Scopes used: `user-read-currently-playing user-read-playback-state`

---

## How to regenerate the refresh token
If the token becomes invalid (`{"error":"invalid_grant","error_description":"Invalid refresh token"}`):

1. Recreate `get-token.js` in `~/tiagomole.com/` (ask Claude to regenerate it, it has the template)
2. Run: `. "$HOME/.nvm/nvm.sh" && cd ~/tiagomole.com && node get-token.js`
3. Log in to Spotify in the browser that opens
4. Copy the printed refresh token
5. Update `SPOTIFY_REFRESH_TOKEN` in Netlify environment variables
6. Trigger a redeploy (or push any commit)
7. Delete `get-token.js` and push

---

## Current status (as of 2 June 2026)
- Function is deployed and responding ✓
- New refresh token just generated and updated in Netlify ✓
- Debug responses still in `now-playing.js` — **needs cleanup once confirmed working**
- Widget appears on page when `isPlaying: true` is returned ✓

## TODO
- [ ] Confirm widget shows up after new token is deployed
- [ ] Remove debug response lines from `now-playing.js` once working
- [ ] Delete `get-token.js` if it still exists in the repo
