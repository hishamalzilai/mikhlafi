import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Pre-generate all article pages at build time
export async function generateStaticParams() {
  const { data } = await supabase.from('articles').select('id');
  
  return (data || []).map((article) => ({
    id: String(article.id),
  }));
}

// Server-side data fetching
async function getArticle(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, author, date, published_date, content, excerpt')
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
