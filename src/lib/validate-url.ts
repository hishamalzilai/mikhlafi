/**
 * Safe URL validation helpers.
 * Prevents stored XSS and open redirects by allowing only:
 *  - Relative internal paths (e.g. /logo-last.png)
 *  - Absolute https:// URLs with known/allowed hostnames
 */

const ALLOWED_IMAGE_HOSTS = new Set([
  'images.unsplash.com',
  'www.mofa-ye.org',
  's0.wp.com',
  'img.youtube.com',
  'i.ytimg.com',
  'yt3.ggpht.com',
]);

const ALLOWED_MEDIA_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
]);

function getSupabaseHostname(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url) {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }
  return '';
}

function isAllowedImageHostname(hostname: string): boolean {
  const supabaseHostname = getSupabaseHostname();
  if (supabaseHostname && hostname === supabaseHostname) return true;
  if (ALLOWED_IMAGE_HOSTS.has(hostname)) return true;
  if (hostname.endsWith('.ytimg.com') || hostname.endsWith('.youtube.com')) return true;
  return false;
}

function isAllowedMediaHostname(hostname: string): boolean {
  const supabaseHostname = getSupabaseHostname();
  if (supabaseHostname && hostname === supabaseHostname) return true;
  if (ALLOWED_MEDIA_HOSTS.has(hostname)) return true;
  if (hostname.endsWith('.youtube.com') || hostname.endsWith('.youtube-nocookie.com')) return true;
  return false;
}

function isSafeRelativePath(url: string): boolean {
  // Allow only paths starting with / and prevent path traversal / protocol-less URLs
  return url.startsWith('/') && !url.startsWith('//') && !url.includes('..');
}

export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (isSafeRelativePath(url)) return true;

  // Only absolute https:// URLs with allowed hostnames are permitted.
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    return isAllowedImageHostname(parsed.hostname);
  } catch {
    return false;
  }
}

export function isValidMediaUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (isSafeRelativePath(url)) return true;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    return isAllowedMediaHostname(parsed.hostname);
  } catch {
    return false;
  }
}

export function isValidGeneralUrl(url: string): boolean {
  return isValidImageUrl(url) || isValidMediaUrl(url);
}

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('/')[0] || null;
    }
    if (
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'youtube.com' ||
      parsed.hostname === 'www.youtube-nocookie.com' ||
      parsed.hostname === 'youtube-nocookie.com'
    ) {
      const v = parsed.searchParams.get('v');
      if (v) return v;
      // Handles /embed/ID and /shorts/ID
      const match = parsed.pathname.match(/\/(embed|shorts|live)\/([^/]+)/);
      if (match) return match[2];
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Returns a safe image URL for use with next/image.
 * If the input is a YouTube video URL, it returns a YouTube thumbnail image URL.
 * Otherwise it falls back to a safe image URL or a default fallback.
 */
export function getMediaThumbnailUrl(
  url: string,
  type: 'video' | 'photo' | string = 'photo',
  fallbackUrl = '/default-video-cover.png'
): string {
  if (!url || typeof url !== 'string') return fallbackUrl;

  // Already an image URL
  if (isValidImageUrl(url)) return url;

  // YouTube video URL -> thumbnail
  const videoId = extractYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  // For videos without a thumbnail, use the default cover
  if (type === 'video') return fallbackUrl;

  return fallbackUrl;
}

export function sanitizeExternalUrl(url: string): string {
  if (isValidImageUrl(url) || isValidMediaUrl(url)) return url;
  return '';
}
