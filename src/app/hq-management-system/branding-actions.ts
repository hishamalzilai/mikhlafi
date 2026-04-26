"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { brandingSchema } from '@/lib/schemas';
import { checkAdminSession } from './actions';

export type BrandingSettings = {
  header_logo_url: string;
  header_logo_scale: number;
  footer_logo_url: string;
  footer_logo_scale: number;
};

const DEFAULT_BRANDING: BrandingSettings = {
  header_logo_url: '/logo-last.png',
  header_logo_scale: 1.0,
  footer_logo_url: '/logo-last.png',
  footer_logo_scale: 1.0,
};

export async function getBrandingSettings() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('content')
      .eq('id', 'branding')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return DEFAULT_BRANDING;
      }
      console.error("Error fetching branding settings:", error);
      return DEFAULT_BRANDING;
    }

    return { ...DEFAULT_BRANDING, ...(data.content as any) } as BrandingSettings;
  } catch (err) {
    console.error("Branding fetch catch:", err);
    return DEFAULT_BRANDING;
  }
}

export async function updateBrandingSettings(settings: BrandingSettings) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك بإجراء هذا التعديل.' };
  }

  try {
    const validatedSettings = brandingSchema.parse(settings);
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ 
        id: 'branding', 
        content: validatedSettings, 
        updated_at: new Date().toISOString() 
      });

    if (error) {
      throw error;
    }

    revalidatePath('/');
    revalidatePath('/hq-management-system/branding');
    return { success: true };
  } catch (err: any) {
    console.error("Error updating branding settings:", err);
    return { success: false, error: err.errors?.[0]?.message || err.message };
  }
}
