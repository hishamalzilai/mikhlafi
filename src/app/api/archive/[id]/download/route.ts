import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { data, error } = await supabaseAdmin
      .from('archive')
      .select('file_url, title, type')
      .eq('id', id)
      .single();

    if (error || !data || !data.file_url) {
      return new NextResponse('Not found', { status: 404 });
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
