import React from 'react';
import { Mail, MapPin, Globe, MessageSquare, Send, Share2 } from 'lucide-react';

export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] text-white p-10 md:p-20 relative overflow-hidden mb-16 shadow-2xl">
         {/* Background Decor */}
         <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
         <img src="/logoedit.png" alt="" className="absolute -left-20 -bottom-32 w-[50rem] h-auto object-contain grayscale invert mix-blend-screen opacity-10 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-start gap-4 max-w-7xl mx-auto">
            <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-5 py-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-sm backdrop-blur-sm shadow-inner mt-4 flex items-center gap-2">
               <MessageSquare className="w-4 h-4" />
               قنوات التواصل الرسمية
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white flex items-center gap-4 drop-shadow-xl tracking-tight leading-tight mt-2">
               تواصل معنا
            </h1>
            <p className="text-slate-300 font-medium max-w-3xl text-lg md:text-xl mt-4 leading-relaxed border-r-4 border-[#b18c39] pr-4">
              نرحب بكافة الاستفسارات، المقترحات، والتواصل الإعلامي عبر القنوات الرسمية الموضحة أدناه.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid lg:grid-cols-12 gap-16">
            {/* Contact Form Section */}
            <div className="lg:col-span-7 bg-white p-8 md:p-12 border border-slate-200 shadow-xl rounded-none relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                     <Send className="text-[#b18c39] w-8 h-8" />
                     أرسل رسالتك الآن
                  </h3>
                  
                  <form className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-sm font-black text-slate-700 uppercase tracking-widest">الاسم الكامل</label>
                           <input 
                             type="text" 
                             className="w-full bg-slate-50 border border-slate-200 px-5 py-4 focus:ring-2 focus:ring-[#b18c39] focus:border-transparent outline-none transition-all font-medium text-slate-900" 
                             placeholder="أدخل اسمك هنا..."
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-black text-slate-700 uppercase tracking-widest">البريد الإلكتروني</label>
                           <input 
                             type="email" 
                             className="w-full bg-slate-50 border border-slate-200 px-5 py-4 focus:ring-2 focus:ring-[#b18c39] focus:border-transparent outline-none transition-all font-medium text-slate-900" 
                             placeholder="email@example.com"
                             dir="ltr"
                           />
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest">الموضوع</label>
                        <input 
                          type="text" 
                          className="w-full bg-slate-50 border border-slate-200 px-5 py-4 focus:ring-2 focus:ring-[#b18c39] focus:border-transparent outline-none transition-all font-medium text-slate-900" 
                          placeholder="ما هو موضوع رسالتك؟"
                        />
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest">الرسالة</label>
                        <textarea 
                          rows={6}
                          className="w-full bg-slate-50 border border-slate-200 px-5 py-4 focus:ring-2 focus:ring-[#b18c39] focus:border-transparent outline-none transition-all font-medium text-slate-900 resize-none" 
                          placeholder="اكتب استفسارك أو رسالتك هنا بالتفصيل..."
                        ></textarea>
                     </div>
                     
                     <button className="w-full bg-slate-900 text-white font-black py-5 uppercase tracking-[0.2em] hover:bg-[#b18c39] transition-all flex items-center justify-center gap-4 shadow-xl group/btn">
                        إرسال الرسالة
                        <Send className="w-5 h-5 transition-transform group-hover/btn:-translate-x-2" />
                     </button>
                  </form>
               </div>
               {/* Accent decoration */}
               <div className="absolute top-0 right-0 w-32 h-1 bg-[#b18c39]"></div>
            </div>

            {/* Info and Social Section */}
            <div className="lg:col-span-5 space-y-10">
               {/* Contact Cards */}
               <div className="space-y-6">
                  <div className="bg-white p-8 border-r-8 border-[#b18c39] shadow-lg flex items-start gap-6 group hover:translate-x-[-8px] transition-all duration-500">
                     <div className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xl group-hover:bg-[#b18c39] transition-colors">
                        <Mail className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">البريد الإلكتروني الرسمي</h4>
                        <p className="text-xl font-black text-slate-900 break-all" dir="ltr">info@abdulmalik-almekhlafi.com</p>
                        <p className="text-sm text-slate-500 font-bold mt-1">للتواصل المباشر والرد السريع</p>
                     </div>
                  </div>

                  <div className="bg-white p-8 border-r-8 border-slate-900 shadow-lg flex items-start gap-6 group hover:translate-x-[-8px] transition-all duration-500">
                     <div className="w-14 h-14 bg-slate-100 text-[#b18c39] flex items-center justify-center shrink-0 border border-slate-200 shadow-sm group-hover:bg-[#b18c39] group-hover:text-white transition-colors">
                        <Globe className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">الموقع الرسمي</h4>
                        <p className="text-xl font-black text-slate-900" dir="ltr">www.abdulmalik-almekhlafi.com</p>
                        <p className="text-sm text-slate-500 font-bold mt-1">المنصة الرقمية الموثقة</p>
                     </div>
                  </div>

                  <div className="bg-[#1e293b] p-8 border-r-8 border-[#b18c39] shadow-2xl flex items-start gap-6 group">
                     <div className="w-14 h-14 bg-[#b18c39] text-white flex items-center justify-center shrink-0 shadow-lg">
                        <Share2 className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">التواصل الاجتماعي الرسمي</h4>
                        <div className="flex gap-6">
                           <a href="#" className="w-12 h-12 bg-slate-800 text-white flex items-center justify-center hover:bg-[#b18c39] transition-all border border-slate-700 hover:border-[#b18c39] shadow-lg group-hover:rotate-6 font-black text-xl italic pt-1 text-center">X</a>
                           <a href="#" className="w-12 h-12 bg-slate-800 text-white flex items-center justify-center hover:bg-[#b18c39] transition-all border border-slate-700 hover:border-[#b18c39] shadow-lg group-hover:rotate-12 font-black text-2xl italic pt-1 text-center font-serif">f</a>
                           <a href="#" className="w-12 h-12 bg-slate-800 text-white flex items-center justify-center hover:bg-[#b18c39] transition-all border border-slate-700 hover:border-[#b18c39] shadow-lg group-hover:rotate-6 font-black text-xl italic pt-1 text-center">Y</a>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Watermark Logo Container */}
               <div className="pt-8 opacity-20 hidden lg:block">
                  <img src="/logoedit.png" alt="" className="w-full grayscale contrast-125" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
