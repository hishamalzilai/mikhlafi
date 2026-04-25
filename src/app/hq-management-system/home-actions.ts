"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { homepageSchema } from '@/lib/schemas';

export type TimelineItem = {
  year: string;
  title: string;
  desc: string;
  icon: string;
};

export type HomepageContent = {
  hero_title: string;
  hero_quote: string;
  hero_subtitle: string;
  vision_quote: string;
  timeline_items?: TimelineItem[];
};

export async function getHomepageSettings() {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('content')
    .eq('id', 'homepage')
    .single();

  if (error) {
    console.error("Error fetching homepage settings:", error);
    return null;
  }

  return data.content as HomepageContent;
}

import { checkAdminSession } from './actions';

export async function updateHomepageSettings(content: HomepageContent) {
  // Security Check: Verify admin session before allowing updates
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك بإجراء هذا التعديل.' };
  }

  try {
    const validatedContent = homepageSchema.parse(content);
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ id: 'homepage', content: validatedContent, updated_at: new Date().toISOString() });

    if (error) {
      console.error("Error updating homepage settings:", error);
      return { success: false, error: error.message };
    }
  } catch (err: any) {
    return { success: false, error: err.errors?.[0]?.message || err.message };
  }

  revalidatePath('/');
  revalidatePath('/hq-management-system/home');
  return { success: true };
}
