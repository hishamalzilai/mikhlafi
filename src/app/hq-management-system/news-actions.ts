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

    console.log(`[NewsAction] Starting save: id=${id}, title=${title}`);
    
    let image_url = formData.get('existing_image_url') as string || '';

    // Handle image upload
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      console.log(`[NewsAction] Preparing image upload: ${imageFile.name} (${imageFile.size} bytes)`);
      const fileExt = imageFile.name.split('.').pop() || 'png';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `news/${fileName}`;
      
      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        
        const { error: uploadError } = await supabaseAdmin.storage
          .from('media')
          .upload(filePath, buffer, { 
            contentType: imageFile.type,
            upsert: true 
          });
          
        if (uploadError) {
          console.error("[NewsAction] Storage upload error:", uploadError);
          throw new Error("فشل رفع الصورة: " + uploadError.message);
        }
        
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('media')
          .getPublicUrl(filePath);
          
        image_url = publicUrlData.publicUrl;
        console.log(`[NewsAction] Image URL generated: ${image_url}`);
      } catch (uploadErr: any) {
        console.error("[NewsAction] Fatal upload error:", uploadErr);
        throw uploadErr;
      }
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

    if (id && id !== "null" && id !== "undefined") {
      console.log(`[NewsAction] Updating news entry: ${id}`);
      const { error } = await supabaseAdmin
        .from('news')
        .update(newsData)
        .eq('id', id);
      if (error) throw error;
    } else {
      console.log("[NewsAction] Inserting new news entry");
      const { error } = await supabaseAdmin
        .from('news')
        .insert([newsData]);
      if (error) throw error;
    }

    console.log("[NewsAction] Operation successful. Revalidating...");
    revalidatePath('/news');
    revalidatePath('/hq-management-system/news');
    
    return { success: true };
  } catch (err: any) {
    console.error("[NewsAction] Global Error:", err);
    return { success: false, error: err.message || "حدث خطأ غير متوقع" };
  }
}

export async function deleteNewsAction(id: number) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    console.log(`[NewsAction] Deleting entry: ${id}`);
    const { error } = await supabaseAdmin.from('news').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/news');
    revalidatePath('/hq-management-system/news');
    return { success: true };
  } catch (err: any) {
    console.error("[NewsAction] Delete Error:", err);
    return { success: false, error: err.message };
  }
}
