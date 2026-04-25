import { supabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import Content from './Content';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function getTestimonial(id: string) {
  const { data, error } = await supabaseAdmin
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
