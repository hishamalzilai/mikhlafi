/**
 * IP helpers for rate limiting and request logging.
 * Works with NextRequest headers or the headers() object from next/headers.
 */

export function isPrivateIp(ip: string): boolean {
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

export function getClientIp(
  headers: { get(name: string): string | null }
): string {
  // Cloudflare / CDN headers (trusted when the site is behind those proxies)
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const trueClientIp = headers.get('true-client-ip');
  if (trueClientIp) return trueClientIp.trim();

  // Fallback: use the last non-private IP in X-Forwarded-For (closest to the server).
  // The first IP in the list can be spoofed by the client, so we avoid it.
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map(s => s.trim()).filter(Boolean);
    for (let i = ips.length - 1; i >= 0; i--) {
      if (!isPrivateIp(ips[i])) return ips[i];
    }
    return ips[ips.length - 1] || 'anonymous';
  }

  return 'anonymous';
}
