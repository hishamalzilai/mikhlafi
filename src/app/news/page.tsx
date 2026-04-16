"use client";

import React, { useState } from 'react';
import { Newspaper, ChevronLeft } from 'lucide-react';

const mockNews = [
  {
    id: 1,
    title: "لقاء رسمي رفيع المستوى لبحث سبل تعزيز التعاون الدولي في العاصمة عدن",
    excerpt: "ناقش المستشار في هذا اللقاء أهمية تظافر الجهود الدولية لدعم مؤسسات الدولة والشرعية الدستورية.",
    date: "11 أبريل 2026"
  },
  {
    id: 2,
    title: "تصريح هام حول التطورات الأخيرة في مسار التسوية",
    excerpt: "أكد أ. عبدالملك المخلافي على الموقف الثابت من المرجعيات الثلاث كأساس لأي تسوية سلمية قادمة.",
    date: "25 مارس 2026"
  },
  {
    id: 3,
    title: "مشاركة في الندوة الاستراتيجية حول الأمن الإقليمي",
    excerpt: "طرح رؤية شاملة لكيفية تحصين الأمن القومي العربي في ظل الاستقطاب الإقليمي الحاد.",
    date: "14 فبراير 2026"
  },
  {
    id: 4,
    title: "تعليق صحفي على قرارات مجلس الأمن بشأن اليمن",
    excerpt: "الترحيب الكامل بالقرارات الدولية الداعمة للجمهورية اليمنية والتحذير من إعاقة مسار السلام.",
    date: "30 يناير 2026"
  },
  {
    id: 5,
    title: "نداء للمجتمع الدولي لدعم الاقتصاد الوطني",
    excerpt: "شدد على ضرورة فصل المسار الاقتصادي والمصرفي عن التعقيدات العسكرية للتخفيف من معاناة المواطنين.",
    date: "15 ديسمبر 2025"
  },
  {
    id: 6,
    title: "لقاء تشاوري مع الكتل الدبلوماسية الأجنبية في الخارج",
    excerpt: "جهود مستمرة لتوحيد الرؤى والخطاب السياسي ونقل رسائل واضحة حول استمرار أفق الحل الديمقراطي والمؤسسي.",
    date: "5 نوفمبر 2025"
  }
];

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  
  const totalPages = Math.ceil(mockNews.length / ITEMS_PER_PAGE);
  const paginatedNews = mockNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen pb-24 bg-slate-50/30 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] text-white p-10 md:p-20 relative overflow-hidden mb-16 shadow-2xl">
         {/* Background Decor */}
         <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
         <img src="/new-logo.jpeg" alt="" className="absolute -left-20 -bottom-32 w-[50rem] h-auto object-contain grayscale invert mix-blend-screen opacity-10 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-start gap-4 max-w-7xl mx-auto">
            <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-5 py-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-sm backdrop-blur-sm shadow-inner mt-4 flex items-center gap-2">
               المنبر الإخباري
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white flex items-center gap-4 drop-shadow-xl tracking-tight leading-tight mt-2">
               الأخبار والآراء
            </h1>
            <p className="text-slate-300 font-medium max-w-3xl text-lg md:text-xl mt-4 leading-relaxed border-r-4 border-[#b18c39] pr-4">
              منصة متخصصة ترصد أبرز المستجدات والتصريحات الصحفية الموثقة، وتستعرض الآراء والمواقف السياسية والدبلوماسية الهامة.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid md:grid-cols-2 gap-10">
            {paginatedNews.map((news, index) => (
              <div 
                key={`${currentPage}-${news.id}`} 
                className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col gap-6 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 overflow-hidden relative"
                style={{ animationFillMode: 'both', animationDelay: `${index * 150}ms` }}
              >
                 <Newspaper className="absolute -left-10 -top-10 w-48 h-48 text-slate-50 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none" />
                 
                 <div className="relative z-10 flex flex-col h-full">
                    <span className="self-start text-[10px] md:text-xs font-black text-[#b18c39] px-4 py-1.5 bg-[#b18c39]/5 rounded-full uppercase tracking-widest border border-[#b18c39]/10 mb-6">
                       {news.date}
                    </span>
                    <h4 className="font-black text-2xl md:text-3xl mb-4 leading-snug group-hover:text-[#b18c39] transition-colors">
                       {news.title}
                    </h4>
                    <p className="text-base md:text-lg text-slate-600 line-clamp-3 font-medium leading-relaxed flex-1 text-justify mb-8">
                       {news.excerpt}
                    </p>
                    
                    <button className="flex items-center gap-2 text-[#b18c39] font-black text-sm group/btn hover:text-slate-900 transition-colors bg-[#b18c39]/5 hover:bg-[#b18c39]/10 px-5 py-2.5 rounded-full self-start">
                        التفاصيل
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                    </button>
                 </div>
              </div>
            ))}
         </div>

         {/* Pagination UI */}
         {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4">
               {/* Previous Button (Right arrow in RTL) */}
               <button 
                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
                 className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
               >
                 <ChevronLeft className="w-5 h-5 rotate-180" />
               </button>
               
               {/* Page Numbers */}
               <div className="flex items-center gap-2">
                 {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all duration-300 ${
                        currentPage === i + 1
                        ? 'bg-[#b18c39] text-white shadow-lg shadow-[#b18c39]/30 scale-110'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
                      }`}
                    >
                      {i + 1}
                    </button>
                 ))}
               </div>

               {/* Next Button (Left arrow in RTL) */}
               <button 
                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                 disabled={currentPage === totalPages}
                 className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>
            </div>
         )}
      </div>
    </div>
  );
}
