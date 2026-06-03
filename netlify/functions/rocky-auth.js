const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const passwordHash = process.env.ROCKY_PASSWORD_HASH;
  if (!passwordHash) {
    return { statusCode: 500, body: JSON.stringify({ ok: false }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false }) };
  }

  const { password } = body;
  if (!password) {
    return { statusCode: 400, body: JSON.stringify({ ok: false }) };
  }

  const hash = crypto
    .createHash('sha256')
    .update(password.trim().toLowerCase())
    .digest('hex');

  const ok = hash === passwordHash;

  if (!ok) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false }),
    };
  }

  const sessionToken = crypto
    .createHmac('sha256', passwordHash)
    .update('rh-session-v1')
    .digest('hex');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://tiagomole.com',
      'Set-Cookie': `rh_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/rh-e3f7a92c1d.html; Max-Age=604800`,
    },
    body: JSON.stringify({ ok: true, path: '/rh-e3f7a92c1d.html' }),
  };
};
