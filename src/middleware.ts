import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getClientIp } from '@/lib/ip';

// Simple Rate Limiting Map (Memory-based)
// NOTE: In a multi-process/serverless environment this is best-effort only.
// For strict rate limiting, use a persistent store (Redis/KV/Cloudflare D1).
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const WINDOW_MS = 60000;
const MAX_REQUESTS = 20;
const MAX_MAP_SIZE = 10000;

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

function cleanupRateLimitMap(now: number) {
  // Remove stale entries older than 2 windows
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.lastReset > WINDOW_MS * 2) {
      rateLimitMap.delete(key);
    }
  }

  // If still too large, prune the oldest 20%
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    const entries = Array.from(rateLimitMap.entries());
    entries.sort((a, b) => a[1].lastReset - b[1].lastReset);
    const pruneCount = Math.floor(entries.length * 0.2);
    for (let i = 0; i < pruneCount; i++) {
      rateLimitMap.delete(entries[i][0]);
    }
  }
}

export function middleware(request: NextRequest) {
    const ip = getClientIp(request.headers);
    const now = Date.now();

    // 1. Rate Limiting Logic for API and Management
    if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/hq-management-system')) {
        cleanupRateLimitMap(now);

        const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
        
        if (now - userData.lastReset > WINDOW_MS) {
            userData.count = 1;
            userData.lastReset = now;
        } else {
            userData.count++;
        }
        
        rateLimitMap.set(ip, userData);

        if (userData.count > MAX_REQUESTS) {
            return new NextResponse('Too Many Requests', { status: 429 });
        }
    }

    // 2. Set a per-request CSP nonce so inline scripts loaded by Next.js are allowed
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
