"use server";

import { supabase } from '@/lib/supabase';

// Define unified search result type
export type SearchResult = {
  id: string;
  type: 'news' | 'article' | 'study' | 'archive' | 'media';
  title: string;
  excerpt: string;
  date: string;
  url: string;
};

export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 3) return [];
  
  const { data, error } = await supabase.rpc('search_all', { query_text: query.trim() });

  if (error) {
    console.error("Search RPC error:", error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    excerpt: item.excerpt || '',
    date: item.date_val ? new Date(item.date_val).toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
    url: item.url_val
  }));
}
