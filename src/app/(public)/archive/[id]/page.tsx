import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ArchiveDetailClient from './ArchiveDetailClient';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase.from('archive').select('id');
  return (data || []).map((item) => ({ id: String(item.id) }));
}

async function getArchiveItem(id: string) {
  const { data, error } = await supabase
    .from('archive')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function ArchiveDetailPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const item = await getArchiveItem(resolvedParams.id);
  if (!item) notFound();
  return <ArchiveDetailClient item={item} />;
}
