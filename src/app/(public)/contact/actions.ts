"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { contactMessageSchema } from '@/lib/schemas';

export async function submitContactMessage(prevState: unknown, formData: FormData) {
  try {
    const parsed = contactMessageSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'البيانات المدخلة غير صالحة',
      };
    }

    const { name, email, subject, message } = parsed.data;

    const { error } = await supabaseAdmin
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject,
          message,
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      // If the table does not exist, log it and return a user-friendly message
      console.error('[ContactAction] insert error:', error);
      if (error.code === 'PGRST204' || error.message?.includes('relation "contact_messages" does not exist')) {
        return {
          success: false,
          error: 'نظام استقبال الرسائل غير مفعّل حالياً. يُرجى التواصل عبر البريد الإلكتروني المباشر.',
        };
      }
      return { success: false, error: 'حدث خطأ أثناء إرسال الرسالة. حاول مجدداً.' };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('[ContactAction] unexpected error:', err);
    return { success: false, error: 'حدث خطأ غير متوقع. حاول مجدداً.' };
  }
}
