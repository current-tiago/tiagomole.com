const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://tiagomole.com',
  'Content-Type': 'application/json',
};

const NOT_PLAYING = {
  statusCode: 200,
  headers: CORS_HEADERS,
  body: JSON.stringify({ isPlaying: false }),
};

exports.handler = async () => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!client_id || !client_secret || !refresh_token) return NOT_PLAYING;

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token }),
    });

    const tokenData = await tokenRes.json();
    const { access_token } = tokenData;
    if (!access_token) return NOT_PLAYING;

    const playerRes = await fetch('https://api.spotify.com/v1/me/player', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (playerRes.status === 204 || playerRes.status >= 400) return NOT_PLAYING;

    const data = await playerRes.json();
    if (!data || !data.item) return NOT_PLAYING;

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        isPlaying: data.is_playing,
        title: data.item.name,
        artist: data.item.artists.map(a => a.name).join(', '),
        albumArt: data.item.album.images[2]?.url || data.item.album.images[0]?.url,
        songUrl: data.item.external_urls.spotify,
      }),
    };
  } catch {
    return NOT_PLAYING;
  }
};
