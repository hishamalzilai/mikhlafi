import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, MessageCircle, Newspaper, Calendar, Star, Play, BarChart3, Globe, Users, Scale, Archive, BookOpen, Quote, FileText, User } from 'lucide-react';
import { YemeniEagle } from '@/components/MainLayout';

export default function Home() {
  return (
    <>
      <div className="animate-in fade-in space-y-24 md:space-y-32">
        {/* 1. سكشن الواجهة (Hero Section) */}
        <section className="grid lg:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#b18c39] text-white px-4 py-1.5 text-xs font-black shadow-lg uppercase tracking-[0.2em]">مفكر وسياسي يمني</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8 drop-shadow-sm">
              عبد الملك عبد الجليل المخلافي
            </h1>
            <div className="relative pl-8 md:pl-12 border-r-8 border-[#b18c39] py-4 bg-slate-50 pr-6 md:pr-10 shadow-inner">
               <Quote className="absolute -right-4 -top-6 text-slate-200 w-16 h-16 rotate-180" />
               <p className="text-xl md:text-3xl font-black leading-[1.6] text-slate-800 relative z-10">
                 "سيادة مؤسسات الدولة هي الضمانة الوحيدة لمستقبل اليمن الاتحادي"
               </p>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative aspect-[3/4] w-full max-w-sm mx-auto shadow-2xl border-b-[16px] border-[#b18c39] bg-slate-200 overflow-hidden flex items-center justify-center group cursor-pointer hover:shadow-3xl transition-all">
               <img src="/ol45hZcGOgfrIsNajVjc.webp" alt="عبد الملك عبد الجليل المخلافي" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </section>

        {/* 2. سكشن المحطات الوطنية (Interactive Timeline) */}
        <section className="bg-slate-900 text-white p-10 md:p-16 relative overflow-hidden shadow-2xl mx-[-1rem] md:mx-[-2rem] lg:mx-[-4rem] xl:mx-0 xl:rounded-none">
           <img src="/new-logo.jpeg" alt="" className="absolute -left-20 -bottom-20 w-[40rem] h-auto object-contain grayscale invert mix-blend-screen opacity-[0.05] rotate-12" />
           <div className="relative z-10">
             <div className="text-center space-y-4 mb-16">
                <h3 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">المحطات الوطنية</h3>
                <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">خلاصة السيرة والمسيرة الحافلة بالمهام الوطنية والدبلوماسية والسياسية.</p>
             </div>
             <div className="grid md:grid-cols-4 gap-6">
                {[
                  { year: '2018 - الآن', title: 'مستشار رئيس مجلس القيادة الرئاسي', icon: Shield, desc: 'تقديم الاستشارات السياسية والدبلوماسية في الملفات السيادية.' },
                  { year: '2015 - 2018', title: 'نائب رئيس الوزراء ووزير الخارجية', icon: Globe, desc: 'قيادة الدبلوماسية اليمنية في أدق المحطات التاريخية.' },
                  { year: '1997 - 2005', title: 'عضو مجلس النواب والعمل التشريعي', icon: Scale, desc: 'العمل التشريعي والقانوني تحت قبة البرلمان اليمني.' },
                  { year: '1993 - 1997', title: 'قيادة العمل السياسي الحزبي', icon: Users, desc: 'تعزيز النهج الديمقراطي والأمين العام للتنظيم الوحدوي.' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 p-8 border border-slate-700/50 hover:bg-[#b18c39] hover:border-[#b18c39] transition-all duration-500 group relative shadow-inner">
                     <div className="text-[#b18c39] group-hover:text-white transition-colors mb-6">
                        <item.icon size={36} strokeWidth={1.5} />
                     </div>
                     <span className="text-xs font-black tracking-[0.2em] text-slate-400 group-hover:text-amber-100 mb-3 block">{item.year}</span>
                     <h4 className="font-black text-xl text-white mb-4 leading-tight">{item.title}</h4>
                     <p className="text-sm text-slate-300 group-hover:text-white/90 leading-relaxed font-bold">{item.desc}</p>
                  </div>
                ))}
             </div>
             <div className="text-center mt-12 pt-8 border-t border-slate-800">
                <Link href="/bio" className="inline-flex items-center gap-3 text-white font-black hover:text-[#b18c39] transition-colors">
                  تصفح المسيرة والمهام بالتفصيل <ArrowLeft size={16} />
                </Link>
             </div>
           </div>
        </section>

        {/* 4. سكشن الفكر السياسي والرؤية */}
        <section className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
           <div className="order-2 lg:order-1 relative p-8 md:p-16 bg-slate-50 border-r-[12px] border-[#b18c39] shadow-inner ml-[-1rem] md:ml-[-2rem] lg:ml-0">
              <Quote className="text-slate-200 w-24 h-24 absolute top-4 left-4" />
              <div className="relative z-10">
                 <h4 className="text-xl md:text-3xl font-black text-slate-900 leading-relaxed italic mb-8">
                   "إن بناء الدولة اليمنية الحديثة يبدأ من احترام الدستور وتفعيل سلطة القانون، والتمسك بالثوابت الوطنية."
                 </h4>
                 <Link href="/vision" className="text-[#b18c39] font-black text-sm flex items-center gap-3 hover:gap-5 transition-all uppercase tracking-widest">
                   قراءة في العمق الفكري <ArrowLeft size={18}/>
                 </Link>
              </div>
           </div>
           <div className="order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                 <BookOpen className="text-[#b18c39] w-8 h-8" />
                 <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">مقالات ودراسات</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-bold text-lg text-justify border-r-4 border-slate-200 pr-6">
                مساحة مخصصة لتوثيق المقالات الصحفية والأبحاث، المواقف النظرية، والدراسات المعمقة. نستعرض هنا المرتكزات الفكرية التي ساهمت في تشكيل السياسات وتمثيل الشرعية في المحافل الديمقراطية.
              </p>
              <div className="pt-4 flex flex-col gap-4">
                 <Link href="/vision" className="flex items-center gap-4 p-4 border border-slate-200 bg-white hover:border-[#b18c39] transition-all cursor-pointer shadow-sm group">
                    <div className="w-12 h-12 bg-slate-50 rounded-none flex items-center justify-center shrink-0 group-hover:bg-[#b18c39] group-hover:text-white transition-all text-slate-400">
                       <FileText size={20} />
                    </div>
                    <div>
                       <h5 className="font-bold text-slate-900 text-base mb-1 group-hover:text-[#b18c39] transition-colors">مشروع الدولة الاتحادية ومآلات التسوية السلمية</h5>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">دراسات استراتيجية</p>
                    </div>
                 </Link>
                 <Link href="/vision" className="flex items-center gap-4 p-4 border border-slate-200 bg-white hover:border-[#b18c39] transition-all cursor-pointer shadow-sm group">
                    <div className="w-12 h-12 bg-slate-50 rounded-none flex items-center justify-center shrink-0 group-hover:bg-[#b18c39] group-hover:text-white transition-all text-slate-400">
                       <Scale size={20} />
                    </div>
                    <div>
                       <h5 className="font-bold text-slate-900 text-base mb-1 group-hover:text-[#b18c39] transition-colors">الديمقراطية والتعددية في ظل التجربة اليمنية</h5>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">أوراق المؤتمرات القومية</p>
                    </div>
                 </Link>
              </div>
           </div>
        </section>

        {/* 5. سكشن الإنتاج المرئي والبياني (المكتبة الرقمية) */}
        <section className="bg-[#faf5ec] p-10 md:p-16 border-t-8 border-slate-200 relative overflow-hidden mx-[-1rem] md:mx-[-2rem] lg:mx-0 lg:rounded-none">
           <div className="relative z-10 flex flex-col items-center text-center space-y-6 mb-16">
              <span className="bg-white px-4 py-1.5 text-xs font-black text-[#b18c39] uppercase tracking-[0.2em] shadow-sm border border-slate-200">المكتبة الرقمية</span>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">الإنتاج المرئي والبياني</h3>
              <p className="text-slate-600 font-bold max-w-3xl text-lg opacity-90 leading-relaxed">
                 تقديم التاريخ السياسي المعاصر بأسلوب رقمي يسهل استهلاكه ومشاركته. فيديوجرافيك يسجل أهم المواقف، وإنفوجرافيك يلخص البيانات والمعلومات السيادية بوضوح.
              </p>
           </div>
           <div className="grid lg:grid-cols-2 gap-10">
              <div className="group relative overflow-hidden aspect-video bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center">
                 <div className="absolute inset-0 bg-slate-800 opacity-60 group-hover:opacity-40 transition-all duration-700"></div>
                 <div className="relative z-10 text-center flex flex-col items-center w-full p-8 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <Play className="text-white w-20 h-20 opacity-80 mb-6 drop-shadow-xl group-hover:scale-110 group-hover:text-[#b18c39] transition-all" />
                    <h4 className="font-black text-3xl text-white drop-shadow-md mb-2">فيديوجرافيك المواقف</h4>
                    <p className="text-slate-300 font-bold text-sm mb-6">توثيق مرئي لأهم الخطابات والمقابلات والمحطات المرئية</p>
                    <Link href="/library" className="bg-[#b18c39] text-white px-8 py-3 rounded-none font-black text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl opacity-0 group-hover:opacity-100">استعرض القسم المرئي <ArrowLeft size={14}/></Link>
                 </div>
              </div>
              <div className="group relative overflow-hidden aspect-video bg-slate-800 border-4 border-white shadow-xl flex items-center justify-center">
                 <div className="absolute inset-0 bg-slate-700 opacity-60 group-hover:opacity-40 transition-all duration-700"></div>
                 <div className="relative z-10 text-center flex flex-col items-center w-full p-8 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <BarChart3 className="text-white w-20 h-20 opacity-80 mb-6 drop-shadow-xl group-hover:scale-110 group-hover:text-[#b18c39] transition-all" />
                    <h4 className="font-black text-3xl text-white drop-shadow-md mb-2">إنفوجرافيك البيانات</h4>
                    <p className="text-slate-300 font-bold text-sm mb-6">بطاقات ورسوم معلوماتية تلخص الرؤى والمواقف الوطنية</p>
                    <Link href="/library" className="bg-[#b18c39] text-white px-8 py-3 rounded-none font-black text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl opacity-0 group-hover:opacity-100">استعرض القسم البياني <ArrowLeft size={14}/></Link>
                 </div>
              </div>
           </div>
        </section>

        {/* 5. سكشن خزانة الوثائق (Featured Archive) */}
        <section className="border-t-8 border-[#b18c39] bg-white p-12 md:p-20 shadow-xl relative text-center overflow-hidden mb-16">
           <Archive className="text-slate-50 w-[30rem] h-[30rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80 rotate-12" />
           <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto space-y-8">
              <span className="bg-[#b18c39]/10 text-[#b18c39] px-4 py-1.5 font-black uppercase tracking-[0.2em] border border-[#b18c39]/30 text-xs shadow-inner">الذاكرة الوطنية</span>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">خزانة الوثائق والأرشيف</h3>
              <p className="text-xl text-slate-600 font-bold leading-relaxed">
                 الركن الأساسي لتعزيز الشفافية وحفظ الذاكرة الوطنية المعاصرة. يضم الأرشيف الرقمي وثائق تمتد لأكثر من 30 عاماً، خطابات تاريخية هامة، واتفاقيات محورية شكلت تاريخ اليمن.
              </p>
              <Link href="/archive" className="bg-slate-900 text-white px-12 py-5 rounded-none font-black text-sm hover:bg-[#b18c39] transition-all flex items-center gap-4 shadow-xl uppercase tracking-widest mt-6">
                 الولوج إلى الخزانة <ArrowLeft size={20} />
              </Link>
           </div>
        </section>

        {/* 6. سجل الرؤى والتصريحات (News & Statements) */}
        <section className="space-y-10">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-slate-200 pb-5 gap-4 md:gap-0">
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
                <Newspaper className="text-[#b18c39] w-10 h-10 shrink-0" />
                تصريحات ومواقف
              </h3>
              <Link href="/news" className="text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest mt-2 md:mt-0">سجل التصريحات الكامل</Link>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { title: "لقاءات مكثفة لمناقشة الترتيبات السياسية للشرعية", desc: "استعراض مسارات إحلال السلام وتأكيد الموقف الثابت للشرعية الدستورية اليمنية في المحافل الدولية.", date: "مستجدات" },
               { title: "تصريح صحفي حول سيادة المؤسسات الوطنية", desc: "نقاش موسع حول ترتيبات المرحلة القادمة والحفاظ على سيادة المؤسسات في العاصمة المؤقتة.", date: "مواقف" },
               { title: "حوار استراتيجي في منتدى السياسات", desc: "مشاركة تفاعلية حول مستقبل اليمن الاتحادي وضمانات الاستقرار الإقليمي والدولي.", date: "ندوات" }
             ].map((item, i) => (
               <div key={i} className="bg-white p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-t-transparent hover:border-t-[#b18c39] group">
                 <div className="text-[10px] font-black text-slate-400 mb-4 tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-none border border-slate-100">{item.date}</div>
                 <h4 className="font-bold text-xl leading-snug mb-4 group-hover:text-[#b18c39] transition-colors">{item.title}</h4>
                 <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">{item.desc}</p>
                 <Link href="/news" className="text-xs font-black text-[#b18c39] flex items-center gap-2 hover:gap-4 transition-all">
                   التفاصيل <ArrowLeft size={14}/>
                 </Link>
               </div>
             ))}
           </div>
        </section>
      </div>
    </>
  );
}
