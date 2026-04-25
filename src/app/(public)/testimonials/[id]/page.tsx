import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Content from './Content';

export const revalidate = 60;

export async function generateStaticParams() {
  const { data } = await supabase.from('testimonials').select('id');
  
  return (data || []).map((item) => ({
    id: String(item.id),
  }));
}

async function getTestimonial(id: string) {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function TestimonialReadPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const data = await getTestimonial(resolvedParams.id);

  if (!data) {
    notFound();
  }

  return <Content data={data} />;
}
