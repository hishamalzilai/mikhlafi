"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/actions';
import { articleSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function saveArticleAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const publishedDate = formData.get('published_date') as string;

    const articleData = {
      title,
      excerpt,
      content,
      author,
      published_date: publishedDate || new Date().toISOString().split('T')[0],
    };

    // Validate with Zod
    articleSchema.parse(articleData);

    if (id) {
      // Update
      const { error } = await supabaseAdmin
        .from('articles')
        .update(articleData)
        .eq('id', id);
      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabaseAdmin
        .from('articles')
        .insert([articleData]);
      if (error) throw error;
    }

    revalidatePath('/articles');
    revalidatePath('/hq-management-system/articles');
    
    return { success: true };
  } catch (err: any) {
    console.error("Save Article Error:", err);
    return { success: false, error: err.message || "حدث خطأ غير متوقع" };
  }
}

export async function deleteArticleAction(id: number) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { error } = await supabaseAdmin.from('articles').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/articles');
    revalidatePath('/hq-management-system/articles');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
