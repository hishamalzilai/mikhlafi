import React from 'react';
import { Mail, ShieldCheck, History, Share2, MessageSquare, Send, Globe, Award, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function ArchiveCooperationContent() {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center mb-20 pt-10">
        {/* Importance Text */}
        <div className="space-y-8 group">
           <div className="bg-white p-8 md:p-12 border-r-8 border-[#b18c39] shadow-xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
              <Landmark className="absolute -left-10 -bottom-10 w-48 h-48 text-slate-50 -rotate-12 pointer-events-none" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight relative z-10">نداء الواجب الوطني</h2>
              <p className="text-slate-700 text-lg md:text-xl font-medium leading-[2.1] text-justify relative z-10">
                يدعو الموقع جميع أصدقاء ومحبي ورفاق السياسي والمفكر الوطني والقومي عبد الملك المخلافي، ممن رافقوا مسيرته وتابعوا تجربته، إلى التعاون من خلال إرسال أي صور أو وثائق أو مقالات أو دراسات له أو عنه، وذلك إسهامًا في حفظ الذاكرة الوطنية وصون إرثه الفكري والسياسي.
              </p>
           </div>

           <div className="flex items-start gap-5 p-6 bg-red-50 border border-red-100 rounded-none shadow-md">
              <div className="w-12 h-12 bg-red-100 flex items-center justify-center shrink-0 shadow-inner">
                 <ShieldCheck className="w-6 h-6 text-red-600" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-red-900 mb-2 uppercase tracking-wider">سياق الدعوة</h3>
                 <p className="text-red-700 font-bold leading-relaxed text-base">
                    تأتي هذه الدعوة في ظل ما تعرضت له ممتلكاته ووثائقه من نهب ومصادرة، آخرها قيام جماعة الحوثي بمصادرة منزله بما يحتويه من أرشيف وتاريخ شخصي.
                 </p>
              </div>
           </div>
        </div>

        {/* Visual CTA Card */}
        <div className="relative group">
           <div className="absolute inset-0 bg-[#b18c39]/10 -rotate-2 scale-105 blur-2xl group-hover:bg-[#b18c39]/20 transition-all"></div>
           <div className="relative bg-[#1e293b] border border-slate-700 p-10 md:p-14 shadow-2xl flex flex-col items-center gap-8 text-center text-white">
              <div className="w-20 h-20 bg-[#b18c39] text-white flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-all">
                 <Share2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">شاركنا في حماية التاريخ</h3>
              <p className="text-slate-400 font-bold text-base leading-relaxed">
                 كل صورة أو وثيقة تمثل قطعة من حقيقة سياسية وطنية نسعى لإكمالها اليوم للأجيال القادمة.
              </p>
              
              <div className="w-full space-y-4 pt-4">
                 <Link href="/contact" className="w-full bg-[#b18c39] hover:bg-[#9a7930] text-white font-black py-5 flex items-center justify-center gap-3 text-lg shadow-xl transition-all">
                    <Send className="w-5 h-5" />
                    تواصل معنا لإرسال المواد
                 </Link>
              </div>

              {/* Contact channels hidden as requested */}
           </div>
        </div>
      </div>

      {/* Benefits Row */}
      <div className="grid md:grid-cols-3 gap-6 py-12 border-t border-slate-200">
         <div className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100">
            <Award className="w-10 h-10 text-[#b18c39] shrink-0" />
            <div>
               <h4 className="font-black text-base text-slate-900">الأمانة العلمية</h4>
               <p className="text-[10px] font-bold text-slate-500 mt-1">نلتزم بدقة التوثيق وعرض المواد بهويتها التاريخية.</p>
            </div>
         </div>
         <div className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100">
            <History className="w-10 h-10 text-[#b18c39] shrink-0" />
            <div>
               <h4 className="font-black text-base text-slate-900">الإتاحة الرقمية</h4>
               <p className="text-[10px] font-bold text-slate-500 mt-1">توفير الأرشيف للباحثين والمهتمين بالتحول الديمقراطي.</p>
            </div>
         </div>
         <div className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-10 h-10 text-[#b18c39] shrink-0" />
            <div>
               <h4 className="font-black text-base text-slate-900">مواجهة العبث</h4>
               <p className="text-[10px] font-bold text-slate-500 mt-1">إعادة بناء ما دمره النهب ومصادرة المقتنيات.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
