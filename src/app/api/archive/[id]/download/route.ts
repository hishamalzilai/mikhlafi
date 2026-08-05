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

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'view' or 'download'

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('X-Content-Type-Options', 'nosniff');

    if (action === 'download') {
      // Provide a filename based on title or fallback to original extension
      const urlParts = data.file_url.split('?')[0].split('.');
      const ext = urlParts.length > 1 ? urlParts.pop() : 'pdf';
      const filename = encodeURIComponent(data.title) + '.' + ext;
      headers.set('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    } else {
      headers.set('Content-Disposition', 'inline');
    }

    return new NextResponse(response.body, {
      headers,
    });

  } catch (err) {
    console.error('Error proxying file:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
