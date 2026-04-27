"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/actions';

export async function uploadMediaAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const file = formData.get('file') as File;
    const path = formData.get('path') as string || 'uploads';
    const bucket = formData.get('bucket') as string || 'media';

    if (!file) throw new Error("No file uploaded");

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name || 'image.png';
    const fileExt = originalName.split('.').pop() || 'png';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { 
      success: true, 
      url: publicUrlData.publicUrl,
      fileName: fileName
    };
  } catch (err: any) {
    console.error("[UploadAction] Error:", err);
    return { success: false, error: err.message };
  }
}
