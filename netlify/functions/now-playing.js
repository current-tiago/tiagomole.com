exports.handler = async () => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  const tokenData = await tokenRes.json();
  const { access_token } = tokenData;
  if (!access_token) {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ debug: 'no access token', tokenData }) };
  }

  // Try full player state first, fall back to currently-playing
  const playerRes = await fetch('https://api.spotify.com/v1/me/player', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (playerRes.status === 204) {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ debug: 'spotify returned 204 - nothing playing' }) };
  }
  if (playerRes.status >= 400) {
    const errText = await playerRes.text();
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ debug: `spotify error ${playerRes.status}`, error: errText }) };
  }

  const data = await playerRes.json();

  if (!data || !data.item) {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ debug: 'no item in response', data }) };
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map(a => a.name).join(', '),
      albumArt: data.item.album.images[2]?.url || data.item.album.images[0]?.url,
      songUrl: data.item.external_urls.spotify,
    }),
  };
};
