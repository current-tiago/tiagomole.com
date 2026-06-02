// Run once with: node get-token.js
// Then delete this file.

const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

const CLIENT_ID = '89ca3f58268d46909e37eeda574b0a72';
const CLIENT_SECRET = '29467c3bc10441a698bb18a2b3a1cb0b';
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const SCOPE = 'user-read-currently-playing user-read-playback-state';

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;

console.log('\nOpening Spotify auth in your browser...\n');
try { execSync(`open "${authUrl}"`); } catch (e) {
  console.log('Open this URL manually:\n', authUrl);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:8888`);
  const code = url.searchParams.get('code');
  if (!code) { res.end('No code found.'); return; }

  res.end('<h2>Got it! Check your terminal for the refresh token. You can close this tab.</h2>');
  server.close();

  const body = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI });
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const tokenRes = await new Promise((resolve) => {
    const req = https.request('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    }, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => resolve(JSON.parse(d)));
    });
    req.write(body.toString());
    req.end();
  });

  console.log('\n✓ REFRESH TOKEN (save this):\n');
  console.log(tokenRes.refresh_token);
  console.log('\nAdd these to Netlify environment variables:');
  console.log('  SPOTIFY_CLIENT_ID     =', CLIENT_ID);
  console.log('  SPOTIFY_CLIENT_SECRET =', CLIENT_SECRET);
  console.log('  SPOTIFY_REFRESH_TOKEN =', tokenRes.refresh_token);
  console.log('\nThen delete get-token.js\n');
});

server.listen(8888, '127.0.0.1', () => {
  console.log('Waiting for Spotify callback on http://127.0.0.1:8888/callback ...\n');
});
