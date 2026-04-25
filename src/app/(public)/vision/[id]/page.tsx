import { supabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import VisionContent from './VisionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function getStudy(id: string) {
  const { data, error } = await supabaseAdmin
    .from('studies')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function StudyReadPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const studyData = await getStudy(resolvedParams.id);
  if (!studyData) notFound();
  return <VisionContent studyData={studyData} />;
}
