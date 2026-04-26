import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple Rate Limiting Map (Memory-based)
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';
    const now = Date.now();
    const windowMs = 5000;
    const maxRequests = 30;

    // 1. Rate Limiting Logic for API and Management
    if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/hq-management-system')) {
        const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
        
        if (now - userData.lastReset > windowMs) {
            userData.count = 1;
            userData.lastReset = now;
        } else {
            userData.count++;
        }
        
        rateLimitMap.set(ip, userData);

        if (userData.count > maxRequests) {
            return new NextResponse('Too Many Requests', { status: 429 });
        }
    }

    // 2. Security Headers & CSP
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https://*.supabase.co https://sup.hazlinkdata.cloud https://images.unsplash.com;
        connect-src 'self' https://*.supabase.co https://sup.hazlinkdata.cloud https://www.google-analytics.com;
        frame-src 'self' https://*.supabase.co https://sup.hazlinkdata.cloud https://www.youtube.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    const response = NextResponse.next();
    
    // Set CSP
    response.headers.set('Content-Security-Policy', cspHeader);
    
    // Security Hardening Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none'); // Allow cross-origin images but protect the doc
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

    // HSTS (Strict-Transport-Security)
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    // 3. Cache Control optimization for Assets
    if (request.nextUrl.pathname.startsWith('/_next/static') || request.nextUrl.pathname.includes('/public/')) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return response;
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
