/**
 * Minimal JWT implementation using Web Crypto API (HMAC-SHA256).
 * Works in Node.js Server Actions and Cloudflare Workers without extra dependencies.
 */

const encoder = new TextEncoder();

function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(input: string): string {
  const padding = '='.repeat((4 - (input.length % 4)) % 4);
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/') + padding;
  return atob(base64);
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign', 'verify']
  );
}

export async function signJWT(
  payload: Record<string, unknown>,
  secret: string,
  expiresInSeconds = 24 * 60 * 60
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const header = { alg: 'HS256', typ: 'JWT' };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const key = await importHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signatureArray = new Uint8Array(signatureBuffer);
  let binarySignature = '';
  for (let i = 0; i < signatureArray.length; i++) {
    binarySignature += String.fromCharCode(signatureArray[i]);
  }
  const encodedSignature = base64UrlEncode(binarySignature);

  return `${data}.${encodedSignature}`;
}

export async function verifyJWT<T extends Record<string, unknown> = Record<string, unknown>>(
  token: string,
  secret: string
): Promise<T | null> {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

    const data = `${encodedHeader}.${encodedPayload}`;
    const key = await importHmacKey(secret);

    const decodedSignature = base64UrlDecode(encodedSignature);
    const signatureBuffer = new Uint8Array(decodedSignature.length);
    for (let i = 0; i < decodedSignature.length; i++) {
      signatureBuffer[i] = decodedSignature.charCodeAt(i);
    }

    const valid = await crypto.subtle.verify('HMAC', key, signatureBuffer, encoder.encode(data));
    if (!valid) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as T & { exp?: number };
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

let jwtSecret: string | null = null;

export function getAdminJwtSecret(): string {
  if (jwtSecret) return jwtSecret;

  const explicit = process.env.ADMIN_JWT_SECRET;
  if (!explicit) {
    throw new Error(
      'ADMIN_JWT_SECRET environment variable must be set to a long random value (at least 32 characters). ' +
        'Do not derive it from the admin password.'
    );
  }
  if (explicit.length < 32) {
    throw new Error('ADMIN_JWT_SECRET must be at least 32 characters long.');
  }

  jwtSecret = explicit;
  return jwtSecret;
}

export function clearAdminJwtSecret(): void {
  jwtSecret = null;
}
