import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function generateNonce(): string {
  // crypto.randomUUID is available in Edge and Node.js runtimes
  return crypto.randomUUID();
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''} https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    `img-src 'self' data: blob: https://images.unsplash.com ${supabaseUrl} https://www.mofa-ye.org https://s0.wp.com https://*.youtube.com https://*.ytimg.com https://img.youtube.com https://i.ytimg.com https://yt3.ggpht.com`,
    `media-src 'self' blob: ${supabaseUrl} https://*.youtube.com`,
    `connect-src 'self' ${supabaseUrl} https://*.supabase.co https://sup.hazlinkdata.cloud https://www.google-analytics.com`,
    `frame-src 'self' ${supabaseUrl} https://*.youtube.com https://www.youtube-nocookie.com`,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "block-all-mixed-content",
    "upgrade-insecure-requests",
  ].join('; ');
}

export function middleware(request: NextRequest) {
    // Set a per-request CSP nonce so inline scripts loaded by Next.js are allowed
    // while blocking arbitrary injected scripts.
    const nonce = generateNonce();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Security-Policy', buildCsp(nonce));
    return response;
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
