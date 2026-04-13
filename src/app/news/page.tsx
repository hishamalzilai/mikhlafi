import React from 'react';
import { Newspaper } from 'lucide-react';

export default function NewsPage() {
  return (
    <div className="animate-in fade-in min-h-[60vh]">
      <div className="flex justify-between items-end border-b-4 border-slate-800 pb-5 mb-16">
        <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4">
          <Newspaper size={40} className="text-[#b18c39]" />
          المركز الإعلامي
        </h3>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        {[1, 2, 3, 4].map(i => (
           <div key={i} className="bg-white p-8 rounded-none border border-slate-200 flex flex-col md:flex-row gap-8 group hover:shadow-xl transition-all duration-500 cursor-pointer">
             <div className="w-full md:w-48 h-48 bg-slate-50 rounded-none shrink-0 flex items-center justify-center text-slate-300 shadow-inner">
                <Newspaper size={48} />
             </div>
             <div className="space-y-4">
               <span className="text-[10px] font-black text-[#b18c39] px-4 py-1 bg-amber-50 rounded-none uppercase tracking-[0.2em] border border-amber-100">11 أبريل 2026</span>
               <h4 className="font-bold text-2xl mb-3 leading-tight group-hover:text-[#b18c39] transition-colors tracking-tight">لقاء رسمي رفيع المستوى لبحث سبل تعزيز التعاون الدولي في العاصمة عدن</h4>
               <p className="text-sm text-slate-500 line-clamp-3 font-medium leading-relaxed">ناقش المستشار في هذا اللقاء أهمية تظافر الجهود الدولية لدعم مؤسسات الدولة والشرعية الدستورية.</p>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}
