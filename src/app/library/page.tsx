"use client";

import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, Search, Clock, Film, X, Expand } from 'lucide-react';

const mockMedia = [
  {
    id: 1,
    type: "video",
    title: "حوار خاص مع التلفزيون",
    description: "نقاش موسع حول آخر التطورات الميدانية والسياسية، والتأكيد على وحدة الصف الجمهوري والمؤسسات الوطنية.",
    date: "12 مايو 2026",
    duration: "45:00",
    thumbnail: "https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    type: "video",
    title: "أبرز التصريحات الصحفية والمواقف",
    description: "حصاد مرئي لأهم المواقف والرسائل السياسية التي وجهت للرأي العام الداخلي والخارجي لتوثيق المواقف السيادية.",
    date: "30 ديسمبر 2025",
    duration: "04:15",
    thumbnail: "https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    type: "photo",
    title: "المرجعيات الوطنية للسلام",
    description: "تغطية المؤتمر الصحفي لعرض أبرز التحديثات.",
    date: "20 مارس 2025",
    duration: "عدسة الكاميرا",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    type: "video",
    title: "المشاركة في برنامج استراتيجي حواري",
    description: "التأكيد على المرجعيات الثلاث والدستورية كأساس لأي حل شامل ومستدام وتجنب دعوات التقسيم.",
    date: "10 أكتوبر 2025",
    duration: "52:10",
    thumbnail: "https://images.unsplash.com/photo-1596720426673-e4e142ab11b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    type: "photo",
    title: "اللقاء التشاوري في العاصمة المؤقتة عدن",
    description: "لقطة جماعية للقيادات الوطنية تعكس تكاتف الجهود وتوحيد الرؤى والصف الجمهوري للمرحلة القادمة.",
    date: "14 فبراير 2026",
    duration: "عدسة الكاميرا",
    thumbnail: "https://images.unsplash.com/photo-1605333390977-fb1b151cc018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 6,
    type: "video",
    title: "مسار التحالفات وتأثيرها على الشرعية",
    description: "مقطع فيديو يشرح التحركات الدولية والمحلية لإنهاء الأزمة.",
    date: "15 نوفمبر 2025",
    duration: "05:22",
    thumbnail: "https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 7,
    type: "photo",
    title: "جانب من المشاركة في القمة العربية",
    description: "توثيق فوتوغرافي للنشاط الدبلوماسي المكثف والتمثيل الرسمي والمشرف للجمهورية اليمنية.",
    date: "22 مايو 2025",
    duration: "عدسة الكاميرا",
    thumbnail: "https://images.unsplash.com/photo-1577900236166-50e50942d962?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 8,
    type: "photo",
    title: "استقبال المبعوث الأممي في مكتب الخارجية",
    description: "مناقشات مستمرة لتفعيل آليات الهدنة وتطبيق القرارات الدولية ذات الصلة.",
    date: "12 يناير 2026",
    duration: "عدسة الكاميرا",
    thumbnail: "https://plus.unsplash.com/premium_photo-1661601614264-159e13d6a066?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
];

export default function LibraryPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'photo'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<{url: string, title: string, desc: string} | null>(null);
  const ITEMS_PER_PAGE = 8; // Increased for better grid view

  // Close lightbox on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if(e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const filteredItems = activeFilter === 'all' 
    ? mockMedia 
    : mockMedia.filter(item => item.type === activeFilter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (filter: any) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset pagination on filter change
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-slate-100">
        {/* Ultra Cinematic Header */}
        <div className="bg-slate-950 border-b-[6px] border-[#b18c39] p-10 md:p-24 relative overflow-hidden mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.03] mix-blend-screen pointer-events-none"></div>
           <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#b18c39] rounded-full blur-[150px] opacity-[0.12] mix-blend-screen pointer-events-none"></div>
           <img src="/new-logo.jpeg" alt="" className="absolute -left-20 -bottom-32 w-[60rem] h-auto object-contain grayscale invert mix-blend-screen opacity-[0.05] pointer-events-none drop-shadow-2xl" />
           
           <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-5xl mx-auto">
              <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-6 py-2.5 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(177,140,57,0.1)] flex items-center gap-2">
                 <Film className="w-4 h-4" />
                 استوديوهات العرض الرقمي
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] tracking-tight leading-tight">
                 المكتبة المرئية
              </h1>
              <p className="text-slate-400 font-bold max-w-3xl text-xl mt-2 leading-relaxed">
                نافذة بصرية متكاملة توثق المسيرة الوطنية عبر الصور والمقاطع المرئية بأسلوب عصري.
              </p>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Filter Navigation */}
           <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
              {[
                { id: 'all', label: 'الجميع' },
                { id: 'photo', label: 'الصور' },
                { id: 'video', label: 'الفيديوهات' },
              ].map(filter => (
                 <button
                   key={filter.id}
                   onClick={() => handleFilterChange(filter.id)}
                   className={`px-8 py-3.5 rounded-none text-sm md:text-base font-black transition-all duration-500 border ${
                     activeFilter === filter.id 
                     ? 'bg-[#b18c39] text-white border-[#b18c39] shadow-[0_0_25px_rgba(177,140,57,0.4)] scale-105' 
                     : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                   }`}
                 >
                   {filter.label}
                 </button>
              ))}
           </div>

           {/* UNIFIED RAW MEDIA GRID (MASONRY-STYLE) for ALL Filters */}
           <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {paginatedItems.map((item, index) => (
                 <div 
                   key={item.id}
                   onClick={() => setSelectedPhoto({ url: item.thumbnail, title: item.title, desc: item.description })}
                   className="relative cursor-pointer group break-inside-avoid animate-in fade-in overflow-hidden border border-slate-800 shadow-xl"
                   style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}
                 >
                   {/* Bare media image */}
                   <img 
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 grayscale group-hover:grayscale-0" 
                   />
                   
                   {/* Full overlay with Icon */}
                   <div className="absolute inset-0 bg-[#b18c39]/0 group-hover:bg-[#b18c39]/20 transition-all duration-500 flex items-center justify-center">
                      <div className="bg-black/40 backdrop-blur-sm p-4 rounded-full opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] border border-white/20">
                         {item.type === 'video' ? <Play className="w-8 h-8 text-white ml-1" /> : <Expand className="w-8 h-8 text-white" />}
                      </div>
                   </div>

                   {/* Content Badge (Always shown on hover or specific types) */}
                   <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="bg-[#b18c39] text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">
                        {item.type === 'video' ? 'مقطع مرئي' : 'صورة'}
                      </span>
                   </div>

                   {/* Duration for Videos */}
                   {item.type === 'video' && (
                      <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                         <span className="bg-black/80 backdrop-blur-md text-white border border-slate-700/50 shadow-lg text-[10px] font-bold px-2 py-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                         </span>
                      </div>
                   )}
                 </div>
              ))}
           </div>
           
           {filteredItems.length === 0 && (
              <div className="text-center py-24 bg-slate-900 border border-slate-800 animate-in fade-in shadow-inner">
                 <Search className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                 <h3 className="text-2xl font-black text-slate-300 mb-2">لا توجد وسائط تطابق فلترك حالياً.</h3>
                 <p className="text-lg text-slate-600">سيتم تزويد المكتبة بالمزيد من المواد الرقمية تباعاً.</p>
              </div>
           )}

           {/* Pagination UI */}
           {totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center gap-4">
                 <button 
                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                   disabled={currentPage === 1}
                   className="w-14 h-14 rounded-none flex items-center justify-center border border-slate-700 bg-slate-800 text-slate-400 hover:bg-[#b18c39] hover:text-white hover:border-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md hover:shadow-[0_0_15px_rgba(177,140,57,0.3)]"
                 >
                   <ChevronLeft className="w-5 h-5 rotate-180" />
                 </button>
                 
                 <div className="flex items-center gap-3">
                   {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-14 h-14 rounded-none flex items-center justify-center font-black transition-all duration-500 ${
                          currentPage === i + 1
                          ? 'bg-[#b18c39] text-white shadow-[0_0_20px_rgba(177,140,57,0.4)] scale-110 border border-[#b18c39]'
                          : 'border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        {i + 1}
                      </button>
                   ))}
                 </div>

                 <button 
                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                   disabled={currentPage === totalPages}
                   className="w-14 h-14 rounded-none flex items-center justify-center border border-slate-700 bg-slate-800 text-slate-400 hover:bg-[#b18c39] hover:text-white hover:border-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md hover:shadow-[0_0_15px_rgba(177,140,57,0.3)]"
                 >
                   <ChevronLeft className="w-5 h-5" />
                 </button>
              </div>
           )}
        </div>
      </div>

      {/* Cinematic Photo Lightbox / Modal */}
      {selectedPhoto && (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/98 backdrop-blur-xl px-4 md:px-12 py-12">
            <button 
               onClick={() => setSelectedPhoto(null)} 
               className="absolute top-6 right-6 md:top-10 md:right-10 w-14 h-14 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full flex items-center justify-center border border-slate-600 transition-all hover:scale-110 shadow-2xl z-[10000] hover:text-[#b18c39]"
            >
               <X className="w-6 h-6" />
            </button>
            
            <div className="relative w-full h-full max-w-7xl flex items-center justify-center z-[9999] animate-in zoom-in-95 duration-500">
               {selectedPhoto?.url && <img src={selectedPhoto.url} alt="الوسائط" className="max-w-full max-h-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-slate-800/50 rounded-lg block mx-auto" />}
            </div>
         </div>
      )}
    </>
  );
}
