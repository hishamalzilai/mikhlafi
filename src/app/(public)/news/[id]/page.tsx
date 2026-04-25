import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import NewsContent from './NewsContent';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase.from('news').select('id');
  return (data || []).map((item) => ({ id: String(item.id) }));
}

async function getNewsItem(id: string) {
  const { data, error } = await supabase
    .from('news')
    .select('id, title, content, author, published_date, image_url')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function NewsReadPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const newsItem = await getNewsItem(resolvedParams.id);
  if (!newsItem) notFound();
  return <NewsContent newsItem={newsItem} />;
}
