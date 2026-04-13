import React from 'react';
import { FileText, Info } from 'lucide-react';
import cvData from '@/data/cv.json';
import { YemeniEagle } from '@/components/MainLayout';

export default function BioPage() {
  return (
    <div className="animate-in fade-in min-h-[60vh] pb-24">
      {/* Header Box */}
      <div className="bg-slate-900 border-t-[8px] border-[#b18c39] text-white p-10 md:p-16 relative overflow-hidden mb-12 shadow-2xl">
         <img src="/new-logo.jpeg" alt="" className="absolute -left-10 -bottom-20 w-[40rem] h-auto object-contain grayscale invert mix-blend-screen opacity-[0.07]" />
         <div className="relative z-10 flex flex-col items-start gap-4">
            <span className="bg-[#b18c39]/20 text-[#b18c39] px-4 py-1.5 font-black uppercase tracking-[0.2em] border border-[#b18c39]/30 text-[10px] md:text-xs shadow-inner">
              مسار حياة
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-white flex items-center gap-4 drop-shadow-lg tracking-tight">
              السيرة الذاتية المفصلة
            </h3>
            <p className="text-slate-400 font-bold max-w-2xl text-base md:text-lg mt-4 leading-relaxed">
              توثيق شامل للمسار الشخصي والسياسي، والمراحل المفصلية في التاريخ المهني والدبلوماسي.
            </p>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 md:gap-16">
         {/* Main Content */}
         <div className="lg:col-span-8 flex flex-col gap-8 md:gap-10">
            {cvData.biography.map((p, i) => (
              <div key={i} className={`p-8 md:p-10 bg-white border border-slate-100 shadow-sm relative overflow-hidden group transition-all duration-500 hover:shadow-xl ${i === 0 ? 'border-r-8 border-r-[#b18c39] bg-gradient-to-l from-slate-50 to-white text-xl md:text-2xl font-black leading-loose text-slate-900' : 'text-lg md:text-xl font-bold leading-loose text-slate-700 text-justify hover:border-[#b18c39]/30'}`}>
                 <FileText className="absolute -left-4 -top-4 w-24 h-24 text-slate-50 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12" />
                 <p className="relative z-10">{p.replace(/\[\d+\]/g, '')}</p>
              </div>
            ))}
         </div>

         {/* Sidebar Info */}
         <div className="lg:col-span-4">
            <div className="bg-white border-t-[6px] border-slate-800 p-8 shadow-xl sticky top-32">
               <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-8 border-b-2 border-slate-100 pb-5 flex items-center gap-3">
                 <Info className="text-[#b18c39] w-6 h-6 shrink-0" /> 
                 البطاقة التعريفية
               </h4>
               <ul className="space-y-0">
                  {cvData.positions.map((pos, i) => (
                     <li key={i} className="flex flex-col gap-2 py-5 border-b border-slate-100 group transition-colors hover:bg-slate-50 px-4 -mx-4 rounded-none">
                       <span className="text-[10px] md:text-xs font-black text-[#b18c39] uppercase tracking-widest">{pos.role}</span>
                       <span className="text-base md:text-lg font-bold text-slate-900 leading-snug">{pos.detail}</span>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}
