import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield, Newspaper, Play, Globe, Users, Scale, Archive, BookOpen, Quote, FileText } from 'lucide-react';
import { getHomepageSettings } from '@/app/hq-management-system/home-actions';
import { supabaseAdmin } from '@/lib/supabase-admin';

import TimelineCarousel from '@/components/TimelineCarousel';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const content = await getHomepageSettings();
  
  // Fetch latest 2 studies
  const { data: latestStudies } = await supabaseAdmin
    .from('studies')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(2);

  // Fetch latest media: 1 Video and 1 Photo
  const { data: latestVideo } = await supabaseAdmin
    .from('media_library')
    .select('*')
    .eq('type', 'video')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: latestPhoto } = await supabaseAdmin
    .from('media_library')
    .select('*')
    .eq('type', 'photo')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Fetch latest 3 news
  const { data: latestNews } = await supabaseAdmin
    .from('news')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(3);

  // Fallback defaults in case no data yet
  const heroTitle = content?.hero_title || "عبد الملك عبد الجليل المخلافي";
  const heroQuote = content?.hero_quote || "سيادة مؤسسات الدولة هي الضمانة الوحيدة لمستقبل اليمن الاتحادي";
  const heroSubtitle = content?.hero_subtitle || "مفكر وسياسي يمني";
  const visionQuote = content?.vision_quote || "إن بناء الدولة اليمنية الحديثة يبدأ من احترام الدستور وتفعيل سلطة القانون، والتمسك بالثوابت الوطنية.";

  // Default milestones if none in DB
  const defaultMilestones = [
    { year: '2018 - الآن', title: 'مستشار رئيس مجلس القيادة الرئاسي', icon: 'Shield', desc: 'تقديم الاستشارات السياسية والدبلوماسية في الملفات السيادية.' },
    { year: '2015 - 2018', title: 'نائب رئيس الوزراء ووزير الخارجية', icon: 'Globe', desc: 'قيادة الدبلوماسية اليمنية في أدق المحطات التاريخية.' },
    { year: '1997 - 2005', title: 'عضو مجلس النواب والعمل التشريعي', icon: 'Scale', desc: 'العمل التشريعي والقانوني تحت قبة البرلمان اليمني.' },
    { year: '1993 - 1997', title: 'قيادة العمل السياسي الحزبي', icon: 'Users', desc: 'تعزيز النهج الديمقراطي والأمين العام للتنظيم الوحدوي.' }
  ];

  const timelineItems = content?.timeline_items && content.timeline_items.length > 0 
    ? content.timeline_items 
    : defaultMilestones;

  return (
    <>
      <div className="animate-in fade-in space-y-24 md:space-y-32">
        {/* 1. سكشن الواجهة (Hero Section) */}
        <section className="grid lg:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#b18c39] text-white px-4 py-1.5 text-xs font-black shadow-lg uppercase tracking-[0.2em]">{heroSubtitle}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8 drop-shadow-sm">
              {heroTitle}
            </h1>
            <div className="relative pl-8 md:pl-12 border-r-8 border-[#b18c39] py-4 bg-slate-50 pr-6 md:pr-10 shadow-inner">
               <Quote className="absolute -right-4 -top-6 text-slate-200 w-16 h-16 rotate-180" />
               <p className="text-xl md:text-3xl font-black leading-[1.6] text-slate-800 relative z-10">
                 "{heroQuote}"
               </p>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative aspect-[3/4] w-full max-w-sm mx-auto shadow-2xl border-b-[16px] border-[#b18c39] bg-slate-200 overflow-hidden flex items-center justify-center group cursor-pointer hover:shadow-3xl transition-all">
               <Image 
                 src="/ol45hZcGOgfrIsNajVjc.webp" 
                 alt="عبد الملك عبد الجليل المخلافي" 
                 fill
                 priority
                 sizes="(max-width: 768px) 100vw, 400px"
                 className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </section>

        {/* 2. سكشن الفكر السياسي والرؤية (Vision & Studies) */}
        <section className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
           <div className="order-2 lg:order-1 relative p-8 md:p-16 bg-slate-50 border-r-[12px] border-[#b18c39] shadow-inner ml-[-1rem] md:ml-[-2rem] lg:ml-0">
              <Quote className="text-slate-200 w-24 h-24 absolute top-4 left-4" />
              <div className="relative z-10">
                 <h4 className="text-xl md:text-3xl font-black text-slate-900 leading-relaxed italic mb-8">
                   "{visionQuote}"
                 </h4>
                 <Link href="/vision" className="text-[#b18c39] font-black text-sm flex items-center gap-3 hover:gap-5 transition-all uppercase tracking-widest">
                   قراءة في العمق الفكري <ArrowLeft size={18}/>
                 </Link>
              </div>
           </div>
           <div className="order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                 <BookOpen className="text-[#b18c39] w-8 h-8" />
                 <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">دراسات وأبحاث</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-bold text-lg text-justify border-r-4 border-slate-200 pr-6">
                مساحة مخصصة لتوثيق المقالات الصحفية والأبحاث، المواقف النظرية، والدراسات المعمقة. نستعرض هنا المرتكزات الفكرية التي ساهمت في تشكيل السياسات وتمثيل الشرعية في المحافل الديمقراطية.
              </p>
              <div className="pt-4 flex flex-col gap-4">
                 {latestStudies?.map((study) => (
                   <Link key={study.id} href={`/vision/${study.id}`} className="flex items-center gap-4 p-4 border border-slate-200 bg-white hover:border-[#b18c39] transition-all cursor-pointer shadow-sm group">
                      <div className="w-12 h-12 bg-slate-50 rounded-none flex items-center justify-center shrink-0 group-hover:bg-[#b18c39] group-hover:text-white transition-all text-slate-400">
                         <FileText size={20} />
                      </div>
                      <div>
                         <h5 className="font-bold text-slate-900 text-base mb-1 group-hover:text-[#b18c39] transition-colors">{study.title}</h5>
                         <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{study.category}</p>
                      </div>
                   </Link>
                 ))}
                 {(!latestStudies || latestStudies.length === 0) && (
                   <p className="text-slate-400 text-sm font-bold italic">جاري تحديث الدراسات...</p>
                 )}
              </div>
           </div>
        </section>

        {/* 3. سجل الرؤى والتصريحات (News & Statements) */}
        <section className="space-y-10">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-slate-200 pb-5 gap-4 md:gap-0">
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
                <Newspaper className="text-[#b18c39] w-10 h-10 shrink-0" />
                أخبار وآراء
              </h3>
              <Link href="/news" className="text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest mt-2 md:mt-0">سجل التصريحات الكامل</Link>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {latestNews?.map((news, i) => (
               <div key={news.id} className="bg-white p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-t-transparent hover:border-t-[#b18c39] group flex flex-col h-full">
                 <div className="text-[10px] font-black text-[#b18c39] mb-4 tracking-widest bg-[#b18c39]/5 inline-block px-3 py-1 rounded-none border border-[#b18c39]/10 self-start uppercase">
                   {news.date || news.published_date || 'مستجدات'}
                 </div>
                 <h4 className="font-bold text-xl leading-snug mb-4 group-hover:text-[#b18c39] transition-colors line-clamp-2">
                   {news.title}
                 </h4>
                 <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                   {news.excerpt}
                 </p>
                 <Link href={`/news/${news.id}`} className="text-xs font-black text-[#b18c39] flex items-center gap-2 hover:gap-4 transition-all mt-auto">
                   التفاصيل <ArrowLeft size={14}/>
                 </Link>
               </div>
             ))}
             {(!latestNews || latestNews.length === 0) && (
               <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-400 font-bold italic">جاري تحديث الأخبار...</p>
               </div>
             )}
           </div>
        </section>

        {/* 4. سكشن المحطات الوطنية (Interactive Timeline) */}
        <section className="bg-slate-900 text-white p-10 md:p-16 relative overflow-hidden shadow-2xl mx-[-1rem] md:mx-[-2rem] lg:mx-[-4rem] xl:mx-0 xl:rounded-none">
           <div className="absolute -left-20 -bottom-20 w-[40rem] h-auto pointer-events-none grayscale invert mix-blend-screen opacity-[0.05] rotate-12">
             <Image src="/logo-last.png" alt="" width={640} height={640} className="object-contain" />
           </div>
           <div className="relative z-10">
              <div className="text-center space-y-4 mb-16">
                 <h3 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">المحطات الوطنية</h3>
                 <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">خلاصة السيرة والمسيرة الحافلة بالمهام الوطنية والدبلوماسية والسياسية.</p>
              </div>
              
              <TimelineCarousel items={timelineItems} />

              <div className="text-center mt-12 pt-8 border-t border-slate-800">
                 <Link href="/bio" className="inline-flex items-center gap-3 text-white font-black hover:text-[#b18c39] transition-colors">
                    تصفح المسيرة والمهام بالتفصيل <ArrowLeft size={16} />
                 </Link>
              </div>
           </div>
        </section>

        {/* 5. سكشن الإنتاج المرئي (المكتبة الرقمية) */}
        <section className="bg-slate-950 p-10 md:p-16 border-t-8 border-[#b18c39] relative overflow-hidden mx-[-1rem] md:mx-[-2rem] lg:mx-0 lg:rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] pointer-events-none"></div>
           <div className="relative z-10 flex flex-col items-center text-center space-y-6 mb-16">
              <span className="bg-[#b18c39]/10 text-[#b18c39] px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] shadow-sm border border-[#b18c39]/30 rounded-full backdrop-blur-sm">المكتبة الرقمية الرائدة</span>
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">الإنتاج المرئي</h3>
              <p className="text-slate-400 font-bold max-w-3xl text-lg leading-relaxed">
                 نقدم التاريخ السياسي المعاصر عبر وسائط رقمية حديثة؛ فيديوجرافيك يوثق اللحظات الحاسمة، ويجسد المواقف السيادية بوضوح واحترافية.
              </p>
           </div>
           <div className="grid lg:grid-cols-2 gap-10">
              {/* Video Card */}
              <div className="group relative overflow-hidden aspect-video bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
                 <Image 
                   src={latestVideo?.thumbnail_url || "https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                   alt={latestVideo?.title || "فيديوجرافيك المواقف"} 
                   fill
                   sizes="(max-width: 1024px) 100vw, 600px"
                   className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                 />
                 <div className="relative z-10 text-center flex flex-col items-center w-full p-8 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="w-20 h-20 bg-[#b18c39]/90 rounded-full flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-all cursor-pointer">
                       <Play className="text-white w-10 h-10 ml-1" />
                    </div>
                    <h4 className="font-black text-3xl text-white drop-shadow-md mb-2">فيديوجرافيك المواقف</h4>
                    <p className="text-slate-300 font-bold text-sm mb-6 line-clamp-1 px-4">{latestVideo?.description || "توثيق مرئي لأهم الخطابات والمقابلات والمحطات السيادية"}</p>
                    <Link href="/library" className="bg-[#b18c39] text-white px-8 py-3 rounded-none font-black text-xs hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 shadow-xl opacity-0 group-hover:opacity-100">استعرض الفيديوهات <ArrowLeft size={14}/></Link>
                 </div>
              </div>
              
              {/* Photo Card */}
              <div className="group relative overflow-hidden aspect-video bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
                 <Image 
                   src={latestPhoto?.thumbnail_url || "https://images.unsplash.com/photo-1577900236166-50e50942d962?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                   alt={latestPhoto?.title || "معرض الصور الوطنية"} 
                   fill
                   sizes="(max-width: 1024px) 100vw, 600px"
                   className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                 />
                 <div className="relative z-10 text-center flex flex-col items-center w-full p-8 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="w-20 h-20 bg-slate-800/90 rounded-full border border-slate-700 flex items-center justify-center mb-6 shadow-2xl group-hover:bg-[#b18c39] group-hover:border-[#b18c39] transition-all cursor-pointer">
                       <Users className="text-white w-10 h-10" />
                    </div>
                    <h4 className="font-black text-3xl text-white drop-shadow-md mb-2">معرض الصور الوطنية</h4>
                    <p className="text-slate-300 font-bold text-sm mb-6 line-clamp-1 px-4">{latestPhoto?.description || "لقطات توثيقية ترصد النشاط الدبلوماسي والمشاركات الدولية"}</p>
                    <Link href="/library" className="bg-[#b18c39] text-white px-8 py-3 rounded-none font-black text-xs hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 shadow-xl opacity-0 group-hover:opacity-100">استعرض الصور <ArrowLeft size={14}/></Link>
                 </div>
              </div>
           </div>
        </section>

        {/* 6. سكشن خزانة الوثائق (Featured Archive) */}
        <section className="border-t-8 border-[#b18c39] bg-white p-12 md:p-20 shadow-xl relative text-center overflow-hidden">
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
      </div>
    </>
  );
}
