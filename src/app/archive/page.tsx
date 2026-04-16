"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, FileText, Video, Calendar, ArrowUpRight, Search } from 'lucide-react';

const mockArchiveItems = [
  {
    id: 1,
    type: "photo",
    title: "مؤتمر الحوار الوطني الشامل",
    description: "لحظة توقيع الوثيقة الختامية لمؤتمر الحوار الوطني الشامل بحضور شخصيات وطنية وممثلي المجتمع الدولي.",
    date: "25 يناير 2014",
    link: "#"
  },
  {
    id: 2,
    type: "document",
    title: "رسالة إلى الأمم المتحدة حول إحلال السلام",
    description: "نص الرسالة الموجهة لمجلس الأمن بشأن الالتزام بدعم الشرعية والقرارات الدولية المتعلقة بإنهاء الانقلاب في اليمن.",
    date: "14 أغسطس 2016",
    link: "#"
  },
  {
    id: 3,
    type: "video",
    title: "كلمة الجمهورية اليمنية في الجمعية العامة",
    description: "تسجيل مرئي للخطاب التاريخي المنبري الذي ألقاه أ. عبدالملك المخلافي أمام الجمعية العامة للأمم المتحدة.",
    date: "20 سبتمبر 2017",
    link: "#"
  },
  {
    id: 4,
    type: "photo",
    title: "مؤتمر جنيف للسلام ومشاورات التسوية",
    description: "جانب من المشاورات السياسية المعقدة لتثبيت ركائز السلام العادل والشامل في اليمن برعاية المبعوث الأممي.",
    date: "15 ديسمبر 2015",
    link: "#"
  },
  {
    id: 5,
    type: "document",
    title: "رؤية التنظيم الوحدوي الشعبي الناصري",
    description: "مسودة الأطروحات الفكرية والتنظيمية المقدمة خلال الدورة الانتخابية في الثمانينات والتي تعتبر مرجعاً مهماً لتاريخ التنظيم السياسي السري والمعلن.",
    date: "12 يوليو 1982",
    link: "#"
  },
  {
    id: 6,
    type: "video",
    title: "لقاء صحفي مطول حول مسار المفاوضات",
    description: "لقاء إعلامي حول الثوابت الوطنية التي لا تنازل عنها في أي مشاورات مستقبلية والتمسك بالمرجعيات الثلاث.",
    date: "8 مارس 2018",
    link: "#"
  },
  {
    id: 7,
    type: "photo",
    title: "تأسيس المؤتمر القومي العربي في تونس",
    description: "صورة توثق التئام النخب القومية العربية للمطالبة بمستقبل عربي موحد.",
    date: "3 يونيو 2012",
    link: "#"
  }
];

export default function ArchivePage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo' | 'document' | 'video'>('all');
  
  const filteredItems = activeFilter === 'all' 
    ? mockArchiveItems 
    : mockArchiveItems.filter(item => item.type === activeFilter);

  const getIcon = (type: string) => {
    switch(type) {
      case 'photo': return <ImageIcon className="w-8 h-8 text-[#b18c39]" />;
      case 'document': return <FileText className="w-8 h-8 text-[#b18c39]" />;
      case 'video': return <Video className="w-8 h-8 text-[#b18c39]" />;
      default: return <FileText className="w-8 h-8 text-[#b18c39]" />;
    }
  };

  const getBadgeTxt = (type: string) => {
    switch(type) {
      case 'photo': return "صورة تاريخية";
      case 'document': return "وثيقة رسمية";
      case 'video': return "تسجيل مرئي";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] text-white p-10 md:p-20 relative overflow-hidden mb-16 shadow-2xl">
         {/* Background Decor */}
         <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
         <img src="/new-logo.jpeg" alt="" className="absolute -left-20 -bottom-32 w-[50rem] h-auto object-contain grayscale invert mix-blend-screen opacity-10 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-start gap-4 max-w-7xl mx-auto">
            <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-5 py-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-sm backdrop-blur-sm shadow-inner mt-4 flex items-center gap-2">
               <Search className="w-4 h-4" />
               خزانة الذاكرة وتوثيق التاريخ
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white flex items-center gap-4 drop-shadow-xl tracking-tight leading-tight mt-2">
               الأرشيف الشامل
            </h1>
            <p className="text-slate-300 font-medium max-w-3xl text-lg md:text-xl mt-4 leading-relaxed border-r-4 border-[#b18c39] pr-4">
              منصة توثيقية ترصد أهم الصور التاريخية، الوثائق ورسائل المراسلات، والمواد المرئية التي تجسد المحطات السياسية والوطنية عبر عقود بمختلف مفصلياتها.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Filter Navigation */}
         <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'photo', label: 'صور تاريخية' },
              { id: 'document', label: 'وثائق ورسائل' },
              { id: 'video', label: 'مرئيات ومقابلات' },
            ].map(filter => (
               <button
                 key={filter.id}
                 onClick={() => setActiveFilter(filter.id as any)}
                 className={`px-8 py-3 rounded-full text-sm md:text-base font-black transition-all duration-300 border shadow-sm ${
                   activeFilter === filter.id 
                   ? 'bg-[#b18c39] text-white border-[#b18c39] shadow-lg shadow-[#b18c39]/30 scale-105' 
                   : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                 }`}
               >
                 {filter.label}
               </button>
            ))}
         </div>

         {/* Archive Grid (Masonry style emulation using columns) */}
         <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, index) => (
              <div 
                key={`${activeFilter}-${item.id}`} 
                className="bg-white rounded-3xl border border-slate-200 p-8 relative overflow-hidden group hover:shadow-2xl hover:border-[#b18c39]/40 transition-all duration-500 break-inside-avoid animate-in fade-in slide-in-from-bottom-8 cursor-pointer block"
                style={{ animationFillMode: 'both', animationDelay: `${index * 50}ms` }}
              >
                 {/* Premium Icon Header */}
                 <div className="mb-8 w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#b18c39]/5 transition-transform duration-500">
                    {getIcon(item.type)}
                 </div>
                 
                 <span className="text-xs font-black text-[#b18c39] px-3 py-1.5 bg-[#b18c39]/10 rounded-full mb-4 inline-block tracking-wide">
                    {getBadgeTxt(item.type)}
                 </span>
                 
                 <h3 className="text-2xl font-black text-slate-900 leading-snug mb-4 pr-3 border-r-4 border-transparent group-hover:border-[#b18c39] transition-all">
                    {item.title}
                 </h3>
                 
                 <p className="text-slate-500 font-medium leading-relaxed text-base mb-8 text-justify">
                    {item.description}
                 </p>
                 
                 <div className="flex justify-between items-center pt-5 border-t border-slate-100 text-sm font-bold text-slate-400">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-slate-300" />
                       {item.date}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#b18c39] transition-colors">
                       <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                 </div>
              </div>
            ))}
         </div>
         
         {filteredItems.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
               <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
               <h3 className="text-2xl font-black text-slate-700 mb-2">لا توجد مواد تطابق تصنيفك حالياً.</h3>
               <p className="text-lg text-slate-500">القسم قيد التحديث المستمر لإضافة كافة المواد الأرشيفية.</p>
            </div>
         )}
      </div>
    </div>
  );
}
