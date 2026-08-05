import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';

// Force dynamic rendering to ensure live data at runtime
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

// Server-side data fetching
async function getArticle(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function ArticleReadPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const articleData = await getArticle(resolvedParams.id);

  if (!articleData) {
    notFound();
  }

  return <ArticleContent articleData={articleData} />;
}
