"use client";

import React, { useState } from 'react';
import { PenTool, Calendar, Clock, ChevronLeft, UserRound } from 'lucide-react';

const mockArticles = [
  {
    id: 1,
    title: "مستقبل الدولة المدنية في ظل التحولات الإقليمية",
    excerpt: "مقال يتناول انعكاسات المتغيرات السياسية في الشرق الأوسط على مشروع الدولة الوطنية في اليمن، وأهمية التمسك بالمشروع الوطني الجامع كخيار لا بديل عنه للخروج من المآزق المتتالية.",
    date: "25 مايو 2026",
    readTime: "8 دقائق",
    author: "أ. عبدالملك المخلافي"
  },
  {
    id: 2,
    title: "الدبلوماسية كسلاح فعال في معركة الوعي القومي",
    excerpt: "استعراض مبسط للدور المحوري الذي يلعبه العمل الدبلوماسي في توضيح الصورة الحقيقية للرأي العام العالمي، ومقارعة التضليل المنهجي في المؤسسات الدولية.",
    date: "12 فبراير 2026",
    readTime: "6 دقائق",
    author: "أ. عبدالملك المخلافي"
  },
  {
    id: 3,
    title: "الحوار الوطني الشامل المرجعية الأساسية لبناء اليمن",
    excerpt: "لا تزال مخرجات الحوار الوطني الشامل تمثل البوصلة الحقيقية الوحيدة لانتشال البلاد من النزاعات المستمرة وإعادة تأسيس العقد الاجتماعي بين أبناء الوطن الواحد.",
    date: "10 أكتوبر 2025",
    readTime: "10 دقائق",
    author: "أ. عبدالملك المخلافي"
  },
  {
    id: 4,
    title: "العمل القومي المشترك في مواجهة التدخلات الإقليمية",
    excerpt: "قراءة في راهن العمل العربي المشترك وحتمية تضافر الجهود لحماية سيادة الدول العربية من كافة أشكال التمدد والتدخلات الخارجية المقوضة للأمن والسلم.",
    date: "3 مارس 2025",
    readTime: "7 دقائق",
    author: "أ. عبدالملك المخلافي"
  },
  {
    id: 5,
    title: "رؤية لترميم النسيج الاجتماعي بعد الحرب",
    excerpt: "إن إعادة الإعمار ليس فقط في البنيان بل في ترميم وجدان الأمة وإعادة بناء النسيج الاجتماعي الذي تضرر بفعل دعوات التقسيم والفرز المناطقي والمذهبي.",
    date: "19 سبتمبر 2024",
    readTime: "12 دقيقة",
    author: "أ. عبدالملك المخلافي"
  }
];

export default function ArticlesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  
  const totalPages = Math.ceil(mockArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = mockArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] text-white p-10 md:p-20 relative overflow-hidden mb-12 shadow-2xl">
         {/* Background Decor */}
         <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
         <img src="/new-logo.jpeg" alt="" className="absolute -left-20 -bottom-32 w-[50rem] h-auto object-contain grayscale invert mix-blend-screen opacity-10 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-start gap-4 max-w-7xl mx-auto">
            <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-5 py-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-sm backdrop-blur-sm shadow-inner mt-4">
               مدونة ومقالات
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white flex items-center gap-4 drop-shadow-xl tracking-tight leading-tight mt-2">
               المقالات
            </h1>
            <p className="text-slate-300 font-medium max-w-3xl text-lg md:text-xl mt-4 leading-relaxed border-r-4 border-[#b18c39] pr-4">
              منبر للأفكار والتحليلات العميقة حول مسار العمل الوطني، الرؤى الإستراتيجية للقضايا الإقليمية، وحوارات حول السياسة ومستقبل الدولة والديمقراطية.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid md:grid-cols-2 gap-10">
            {paginatedArticles.map((article, index) => (
              <div 
                key={`${currentPage}-${article.id}`} 
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col animate-in fade-in slide-in-from-bottom-8"
                style={{ animationFillMode: 'both', animationDelay: `${index * 150}ms` }}
              >
                 <PenTool className="absolute -right-8 -bottom-8 w-40 h-40 text-slate-50 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 pointer-events-none" />
                 
                 <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                           <UserRound className="w-5 h-5 text-slate-500" />
                         </div>
                         <div>
                           <div className="text-sm md:text-base font-black text-slate-800">{article.author}</div>
                           <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-1">
                             <Calendar className="w-3.5 h-3.5" />
                             {article.date}
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-1.5 text-xs font-black text-[#b18c39] bg-[#b18c39]/5 px-4 py-2 rounded-full border border-[#b18c39]/10">
                         <Clock className="w-3.5 h-3.5" />
                         {article.readTime}
                       </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-4 group-hover:text-[#b18c39] transition-colors">
                       {article.title}
                    </h3>
                    
                    <p className="text-slate-600 font-medium leading-relaxed text-lg mb-8 line-clamp-3 text-justify flex-1">
                       {article.excerpt}
                    </p>
                    
                    <button className="self-end flex items-center gap-2 text-[#b18c39] font-black text-sm group/btn hover:text-slate-900 transition-colors bg-[#b18c39]/5 hover:bg-[#b18c39]/10 px-5 py-2.5 rounded-full mt-auto">
                        قراءة المقال كاملًا
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
