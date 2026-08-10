'use client';

import { useActionState } from 'react';
import { Send } from 'lucide-react';
import { submitContactMessage } from './actions';

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-black text-slate-700 uppercase tracking-widest">الاسم الكامل</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            className="w-full bg-slate-50 border border-slate-200 px-5 py-4 focus:ring-2 focus:ring-[#b18c39] focus:border-transparent outline-none transition-all font-medium text-slate-900"
            placeholder="أدخل اسمك هنا..."
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-black text-slate-700 uppercase tracking-widest">البريد الإلكتروني</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={255}
            className="w-full bg-slate-50 border border-slate-200 px-5 py-4 focus:ring-2 focus:ring-[#b18c39] focus:border-transparent outline-none transition-all font-medium text-slate-900"
            placeholder="email@example.com"
            dir="ltr"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-black text-slate-700 uppercase tracking-widest">الموضوع</label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          minLength={2}
          maxLength={200}
          className="w-full bg-slate-50 border border-slate-200 px-5 py-4 focus:ring-2 focus:ring-[#b18c39] focus:border-transparent outline-none transition-all font-medium text-slate-900"
          placeholder="ما هو موضوع رسالتك؟"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-black text-slate-700 uppercase tracking-widest">الرسالة</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          className="w-full bg-slate-50 border border-slate-200 px-5 py-4 focus:ring-2 focus:ring-[#b18c39] focus:border-transparent outline-none transition-all font-medium text-slate-900 resize-none"
          placeholder="اكتب استفسارك أو رسالتك هنا بالتفصيل..."
        ></textarea>
      </div>

      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-bold text-sm">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm">
          تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-slate-900 text-white font-black py-5 uppercase tracking-[0.2em] hover:bg-[#b18c39] transition-all flex items-center justify-center gap-4 shadow-xl group/btn disabled:opacity-50"
      >
        {pending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
        <Send className="w-5 h-5 transition-transform group-hover/btn:-translate-x-2" />
      </button>
    </form>
  );
}
