"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/actions';
import { newsSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function saveNewsAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const publishedDate = formData.get('published_date') as string;
    const imageFile = formData.get('image') as File | null;

    let image_url = formData.get('existing_image_url') as string || '';

    // 1. Handle image upload if a new file is provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `news/${fileName}`;
      
      const buffer = await imageFile.arrayBuffer();
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from('media')
        .upload(filePath, buffer, { 
          contentType: imageFile.type,
          upsert: true 
        });
        
      if (uploadError) throw new Error("فشل رفع الصورة: " + uploadError.message);
      
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('media')
        .getPublicUrl(filePath);
        
      image_url = publicUrlData.publicUrl;
    }

    const newsData = {
      title,
      excerpt,
      content,
      published_date: publishedDate || new Date().toISOString().split('T')[0],
      image_url
    };

    // Validate with Zod
    newsSchema.parse(newsData);

    if (id) {
      // Update
      const { error } = await supabaseAdmin
        .from('news')
        .update(newsData)
        .eq('id', id);
      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabaseAdmin
        .from('news')
        .insert([newsData]);
      if (error) throw error;
    }

    revalidatePath('/news');
    revalidatePath('/hq-management-system/news');
    
    return { success: true };
  } catch (err: any) {
    console.error("Save News Error:", err);
    return { success: false, error: err.message || "حدث خطأ غير متوقع" };
  }
}

export async function deleteNewsAction(id: number) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { error } = await supabaseAdmin.from('news').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/news');
    revalidatePath('/hq-management-system/news');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
