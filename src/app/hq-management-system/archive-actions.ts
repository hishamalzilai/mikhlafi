"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/actions';
import { revalidatePath } from 'next/cache';

export async function saveArchiveItemAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const publishedDate = formData.get('published_date') as string;
    const fileUrl = formData.get('file_url') as string;
    const coverUrl = formData.get('cover_url') as string;

    const archiveData = {
      title,
      description,
      type,
      published_date: publishedDate || new Date().toISOString().split('T')[0],
      file_url: fileUrl || null,
      cover_url: coverUrl || null,
    };

    if (id) {
      const { error } = await supabaseAdmin.from('archive').update(archiveData).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from('archive').insert([archiveData]);
      if (error) throw error;
    }

    revalidatePath('/archive');
    revalidatePath('/hq-management-system/archive');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteArchiveItemAction(id: number) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { error } = await supabaseAdmin.from('archive').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/archive');
    revalidatePath('/hq-management-system/archive');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
