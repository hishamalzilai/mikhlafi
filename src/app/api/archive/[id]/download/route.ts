import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// Build an allowlist from the configured Supabase URL plus known custom domains.
// We use exact matches or a proper suffix check (with a leading dot) to avoid
// subdomain takeover vulnerabilities like evil-supabase.co or evil-sup.hazlinkdata.cloud.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHostname = '';
if (supabaseUrl) {
  try {
    supabaseHostname = new URL(supabaseUrl).hostname;
  } catch {
    supabaseHostname = '';
  }
}

const TRUSTED_HOSTNAMES = new Set(
  [
    supabaseHostname,
    'sup.hazlinkdata.cloud',
  ].filter(Boolean)
);

const TRUSTED_SUFFIXES = ['supabase.co'];

function isUrlTrusted(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Only HTTPS is allowed
    if (parsed.protocol !== 'https:') return false;

    // Reject URLs containing embedded credentials
    if (parsed.username || parsed.password) return false;

    // Exact hostname match
    if (TRUSTED_HOSTNAMES.has(parsed.hostname)) return true;

    // Safe suffix match (requires a subdomain separator)
    return TRUSTED_SUFFIXES.some(suffix => parsed.hostname.endsWith('.' + suffix));
  } catch {
    return false;
  }
}

const SAFE_CONTENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

const SAFE_CONTENT_TYPE_PREFIXES = ['image/', 'video/', 'audio/'];

function sanitizeContentType(contentType: string | null): string {
  if (!contentType) return 'application/octet-stream';
  const normalized = contentType.split(';')[0].trim().toLowerCase();

  if (SAFE_CONTENT_TYPES.includes(normalized)) return normalized;
  if (SAFE_CONTENT_TYPE_PREFIXES.some(prefix => normalized.startsWith(prefix))) return normalized;

  // Fallback to octet-stream to avoid browsers sniffing/executing HTML/JS
  return 'application/octet-stream';
}

function sanitizeFilename(title: string): string {
  // Replace characters that break Content-Disposition headers
  return title.replace(/[^\w\u0600-\u06FF\-. ]/g, '_').trim() || 'download';
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Validate ID format (must be a number to prevent injection)
    if (!id || isNaN(Number(id))) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('archive')
      .select('file_url, title, type')
      .eq('id', id)
      .single();

    if (error || !data || !data.file_url) {
      return new NextResponse('Not found', { status: 404 });
    }

    // SSRF Protection: validate the URL against trusted domains
    if (!isUrlTrusted(data.file_url)) {
      console.error('[Download Proxy] Untrusted URL blocked:', data.file_url);
      return new NextResponse('Forbidden: untrusted file source', { status: 403 });
    }

    const response = await fetch(data.file_url);
    
    if (!response.ok) {
      return new NextResponse('Failed to fetch file', { status: response.status });
    }

    const rawContentType = response.headers.get('content-type');
    const contentType = sanitizeContentType(rawContentType);
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('X-Content-Type-Options', 'nosniff');

    // Always force download to prevent browsers rendering HTML/JS inline
    const urlParts = data.file_url.split('?')[0].split('.');
    const ext = urlParts.length > 1 ? urlParts.pop() : 'pdf';
    const baseFilename = sanitizeFilename(data.title || 'download');
    const filename = `${baseFilename}.${ext}`;
    const encodedFilename = encodeURIComponent(filename);
    headers.set('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`);

    return new NextResponse(response.body, {
      headers,
    });

  } catch (err) {
    console.error('Error proxying file:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
