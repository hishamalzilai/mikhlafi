import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/app/hq-management-system/actions';
import { studySchema } from '@/lib/schemas';

export async function GET() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('studies')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rawBody = await req.json();
    const validatedBody = studySchema.parse(rawBody);
    const { data, error } = await supabaseAdmin.from('studies').insert([validatedBody]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.errors || err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rawBody = await req.json();
    const { id, ...rest } = rawBody;
    const validatedBody = studySchema.parse(rest);
    const { data, error } = await supabaseAdmin.from('studies').update(validatedBody).eq('id', id).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.errors || err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const { error } = await supabaseAdmin.from('studies').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
