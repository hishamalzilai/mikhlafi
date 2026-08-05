/**
 * Simple in-memory rate limiter for server actions and API routes.
 * In serverless environments this is best-effort; use KV/Redis/D1 for strict limits.
 */

type Bucket = {
  count: number;
  lastReset: number;
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10000;

function cleanupBuckets(now: number, windowMs: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.lastReset > windowMs * 2) {
      buckets.delete(key);
    }
  }
  if (buckets.size > MAX_BUCKETS) {
    const entries = Array.from(buckets.entries());
    entries.sort((a, b) => a[1].lastReset - b[1].lastReset);
    const pruneCount = Math.floor(entries.length * 0.2);
    for (let i = 0; i < pruneCount; i++) {
      buckets.delete(entries[i][0]);
    }
  }
}

export function checkRateLimit(
  key: string,
  windowMs: number,
  maxRequests: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  cleanupBuckets(now, windowMs);

  const bucket = buckets.get(key);
  if (!bucket) {
    buckets.set(key, { count: 1, lastReset: now });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (now - bucket.lastReset > windowMs) {
    bucket.count = 1;
    bucket.lastReset = now;
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= maxRequests) {
    return { allowed: false, retryAfterMs: windowMs - (now - bucket.lastReset) };
  }

  bucket.count++;
  return { allowed: true, retryAfterMs: 0 };
}
