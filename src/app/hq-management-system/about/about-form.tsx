"use client";

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { saveAboutContentAction, AboutContent } from '../about-actions';

export default function AboutForm({ initialData }: { initialData: AboutContent }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [text, setText] = useState(initialData.text);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.length < 10) {
      setMessage({ type: 'error', text: 'النص يجب أن يكون 10 أحرف على الأقل' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const res = await saveAboutContentAction({ text });

    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'تم حفظ البيانات بنجاح!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'حدث خطأ أثناء الحفظ' });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">النص الكامل (من نحن)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={20}
          placeholder="أدخل النص هنا..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#b18c39] focus:ring-[#b18c39] focus:ring-2 focus:outline-none transition-all font-medium leading-loose"
          dir="rtl"
        />
        <p className="mt-2 text-sm text-slate-500">ملاحظة: سيتم الحفاظ على الفراغات والأسطر الجديدة عند عرض النص في الموقع.</p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#1c1917] hover:bg-[#b18c39] text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ التعديلات'}
        </button>
      </div>
    </form>
  );
}
