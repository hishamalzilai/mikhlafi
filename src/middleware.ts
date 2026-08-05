import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple Rate Limiting Map (Memory-based)
// NOTE: In a multi-process/serverless environment this is best-effort only.
// For strict rate limiting, use a persistent store (Redis/KV/Cloudflare D1).
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const WINDOW_MS = 5000;
const MAX_REQUESTS = 30;
const MAX_MAP_SIZE = 10000;

function isPrivateIp(ip: string): boolean {
  if (!ip) return true;

  // IPv4 private ranges
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
    const parts = ip.split('.').map(Number);
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 127) return true;
    return false;
  }

  // IPv6 loopback / link-local
  if (ip === '::1' || ip.startsWith('fe80:') || ip === '::ffff:127.0.0.1') return true;

  return false;
}

function getClientIp(request: NextRequest): string {
  // Cloudflare / CDN headers (trusted when the site is behind those proxies)
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const trueClientIp = request.headers.get('true-client-ip');
  if (trueClientIp) return trueClientIp.trim();

  // Fallback: use the last non-private IP in X-Forwarded-For (closest to the server).
  // The first IP in the list can be spoofed by the client, so we avoid it.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map(s => s.trim()).filter(Boolean);
    for (let i = ips.length - 1; i >= 0; i--) {
      if (!isPrivateIp(ips[i])) return ips[i];
    }
    return ips[ips.length - 1] || 'anonymous';
  }

  return 'anonymous';
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
    const ip = getClientIp(request);
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

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
