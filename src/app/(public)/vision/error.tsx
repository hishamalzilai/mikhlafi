"use client";

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 animate-in fade-in duration-500">
       <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8 border-4 border-red-100">
          <AlertTriangle className="w-10 h-10 text-red-400" />
       </div>
       <h2 className="text-3xl font-black text-slate-900 mb-4 text-center">حدث خطأ أثناء تحميل الصفحة</h2>
       <p className="text-lg text-slate-500 font-medium mb-8 text-center max-w-md">
         نعتذر عن هذا الخطأ غير المتوقع. يرجى المحاولة مرة أخرى.
       </p>
       <button
         onClick={() => reset()}
         className="flex items-center gap-3 bg-slate-900 hover:bg-[#b18c39] text-white px-8 py-4 rounded-full font-black transition-all shadow-lg"
       >
         <RotateCcw className="w-5 h-5" />
         إعادة المحاولة
       </button>
    </div>
  );
}
