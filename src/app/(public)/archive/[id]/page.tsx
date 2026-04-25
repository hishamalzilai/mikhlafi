import { supabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import ArchiveDetailClient from './ArchiveDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function getArchiveItem(id: string) {
  const { data, error } = await supabaseAdmin
    .from('archive')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function ArchiveItemPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const item = await getArchiveItem(resolvedParams.id);
  if (!item) notFound();
  return <ArchiveDetailClient item={item} />;
}
