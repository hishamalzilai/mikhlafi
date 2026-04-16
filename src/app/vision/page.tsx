"use client";

import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ChevronLeft } from 'lucide-react';

// Mock Data
const studies = [
  {
    id: 1,
    title: "الرؤية الوطنية الشاملة للسلام المستدام في اليمن",
    excerpt: "دراسة معمقة للمرتكزات الأساسية التي تقوم عليها عملية السلام، مع التركيز على الشرعية الدستورية ومرجعيات الحوار الوطني الشامل كضامن لإنهاء الانقلاب واستعادة الدولة.",
    year: "2026",
    date: "12 مارس 2026",
    category: "دراسة سياسية",
    readTime: "15 دقيقة"
  },
  {
    id: 2,
    title: "التحديات الدبلوماسية في مسار الحل السياسي اليمني",
    excerpt: "ورقة بحثية تسلط الضوء على دور الدبلوماسية اليمنية في إيصال صوت الشرعية للمحافل الدولية وتفنيد الروايات المضللة التي تعيق مسار السلام العادل.",
    year: "2025",
    date: "5 أكتوبر 2025",
    category: "ورقة بحثية",
    readTime: "12 دقيقة"
  },
  {
    id: 3,
    title: "الفكر الناصري وتطبيقاته في الواقع اليمني المعاصر",
    excerpt: "بحث تحليلي يستعرض المبادئ الناصرية ومدى مواءمتها للدولة المدنية الحديثة في اليمن، وتاريخ التنظيم الوحدوي الشعبي الناصري في النضال الوطني.",
    year: "2024",
    date: "20 يوليو 2024",
    category: "مقال فكري",
    readTime: "8 دقائق"
  },
  {
    id: 4,
    title: "آليات تفعيل الدور العربي في الملف اليمني",
    excerpt: "مقاربة استراتيجية حول ضرورة تعزيز الدور الإقليمي والعربي بقيادة المملكة العربية السعودية، كحجر زاوية لاستعادة الاستقرار في المنطقة العربية.",
    year: "2024",
    date: "14 فبراير 2024",
    category: "استراتيجية",
    readTime: "10 دقائق"
  },
  {
    id: 5,
    title: "إضاءات على التحولات السياسية بعد عاصفة الحزم",
    excerpt: "دراسة تاريخية سياسية للتحولات الجيوسياسية التي أحدثها التدخل العربي لإنقاذ اليمن، والمآلات المستقبلية في ظل التحديات المعقدة.",
    year: "2023",
    date: "9 نوفمبر 2023",
    category: "دراسة تاريخية",
    readTime: "20 دقيقة"
  },
  {
    id: 6,
    title: "جذور الأزمة اليمنية وتداعياتها الإقليمية (بحث قديم)",
    excerpt: "ورقة عمل مبكرة تناقش التمرحل التاريخي للصراعات في اليمن، والمسببات الجذرية لغياب الاستقرار قبل الدخول في الأزمات المعاصرة.",
    year: "2010",
    date: "15 مايو 2010",
    category: "ورقة عمل",
    readTime: "25 دقيقة"
  }
];

export default function VisionPage() {
  const [searchYear, setSearchYear] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const handleSearchChange = (val: string) => {
    setSearchYear(val);
    setCurrentPage(1);
  };

  // Sort descending by year
  const sortedStudies = [...studies].sort((a, b) => Number(b.year) - Number(a.year));

  const filteredStudies = searchYear.trim() === '' 
    ? sortedStudies 
    : sortedStudies.filter(s => s.year.includes(searchYear.trim()));

  const totalPages = Math.ceil(filteredStudies.length / ITEMS_PER_PAGE);
  const paginatedStudies = filteredStudies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-50/30 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] text-white p-10 md:p-20 relative overflow-hidden mb-12 shadow-2xl">
         {/* Background Decor */}
         <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
         <img src="/new-logo.jpeg" alt="" className="absolute -left-20 -bottom-32 w-[50rem] h-auto object-contain grayscale invert mix-blend-screen opacity-10 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-start gap-4 max-w-7xl mx-auto">
            <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-5 py-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-sm backdrop-blur-sm shadow-inner mt-4">
               الفكر والرؤية
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white flex items-center gap-4 drop-shadow-xl tracking-tight leading-tight mt-2">
               دراسات وأبحاث
            </h1>
            <p className="text-slate-300 font-medium max-w-3xl text-lg md:text-xl mt-4 leading-relaxed border-r-4 border-[#b18c39] pr-4">
              مساحة مخصصة لتوثيق الدراسات والأبحاث، المواقف النظرية، والدراسات المعمقة. نستعرض هنا المرتكزات الفكرية التي ساهمت في تشكيل السياسات وتمثيل الجمهورية اليمنية في المحافل الديمقراطية.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Date Filter */}
         <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 md:p-4 md:px-8 rounded-2xl md:rounded-full shadow-sm border border-slate-200/60 sticky top-28 z-20">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                 <Calendar className="w-5 h-5 text-slate-700" />
               </div>
               <h3 className="text-lg font-black text-slate-900">البحث برقم السنة:</h3>
            </div>
            
            <div className="flex-1 w-full md:w-auto md:max-w-md relative">
               <input 
                 type="text" 
                 placeholder="أدخل السنة (مثال: 2024)" 
                 value={searchYear}
                 onChange={(e) => handleSearchChange(e.target.value)}
                 className="w-full px-6 py-3 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#b18c39] focus:ring-2 focus:ring-[#b18c39]/20 transition-all text-slate-700 font-bold"
               />
               {searchYear && (
                 <button 
                   onClick={() => handleSearchChange('')}
                   className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-sm"
                 >
                   مسح
                 </button>
               )}
            </div>
         </div>

         {/* Studies Grid */}
         <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10">
            {paginatedStudies.map((study, index) => (
              <div 
                key={`${searchYear}-${currentPage}-${study.id}`} 
                className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 flex flex-col h-full"
                style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}
              >
                 <BookOpen className="absolute -left-8 -top-8 w-40 h-40 text-slate-50 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none" />
                 
                 <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                       <span className="text-xs font-black text-[#b18c39] px-4 py-1.5 bg-[#b18c39]/5 border border-[#b18c39]/20 rounded-full">
                         {study.category}
                       </span>
                       <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                         <Clock className="w-4 h-4" />
                         {study.readTime}
                       </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-4 group-hover:text-[#b18c39] transition-colors line-clamp-2">
                       {study.title}
                    </h3>
                    
                    <p className="text-slate-600 font-medium leading-relaxed text-lg mb-8 line-clamp-3 text-justify flex-1">
                       {study.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                       <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                          <Calendar className="w-4 h-4" />
                          {study.date}
                       </div>
                       
                       <button className="flex items-center gap-2 text-[#b18c39] font-black text-sm group/btn hover:text-slate-900 transition-colors">
                          اقرأ الدراسة
                          <ChevronLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                       </button>
                    </div>
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
                 className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all"
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
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
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
                 className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>
            </div>
         )}

         {filteredStudies.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
               <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
               <h3 className="text-2xl font-black text-slate-700 mb-2">لا توجد دراسات</h3>
               <p className="text-lg text-slate-500">جاري إضافة المزيد من الدراسات والأبحاث لهذه السنة.</p>
            </div>
         )}
      </div>
    </div>
  );
}
