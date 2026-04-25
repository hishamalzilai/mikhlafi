"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { checkAdminSession } from './actions';
import { testimonialSchema } from '@/lib/schemas';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, author_name, author_title, content, author_image, order_index')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createTestimonial(formData: any) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error('Unauthorized');

  try {
    const validatedData = testimonialSchema.parse(formData);
    const { data, error } = await supabase
      .from('testimonials')
      .insert([validatedData]);

    if (error) throw new Error(error.message);
    revalidatePath('/testimonials');
    revalidatePath('/hq-management-system/testimonials');
    return data;
  } catch (err: any) {
     throw new Error(err.errors?.[0]?.message || err.message);
  }
}

export async function updateTestimonial(id: string, formData: any) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error('Unauthorized');

  try {
    const validatedData = testimonialSchema.parse(formData);
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/testimonials');
    revalidatePath('/hq-management-system/testimonials');
    return data;
  } catch (err: any) {
    throw new Error(err.errors?.[0]?.message || err.message);
  }
}

export async function deleteTestimonial(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/testimonials');
  revalidatePath('/hq-management-system/testimonials');
  return { success: true };
}
