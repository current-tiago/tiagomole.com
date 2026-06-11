export default async (request, context) => {
  const passwordHash = Deno.env.get('ROCKY_PASSWORD_HASH');
  if (!passwordHash) return Response.redirect(new URL('/', request.url), 302);

  const expected = await computeToken(passwordHash);
  const session = getCookie(request.headers.get('cookie') || '', 'rh_session');

  if (session && session === expected) return context.next();

  // No/expired session: send to the homepage with ?atelier so the
  // password modal reopens automatically.
  return Response.redirect(new URL('/?atelier', request.url), 302);
};

async function computeToken(key) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode('rh-session-v1'));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function getCookie(cookieStr, name) {
  const match = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}

export const config = { path: '/rh-e3f7a92c1d.html' };
