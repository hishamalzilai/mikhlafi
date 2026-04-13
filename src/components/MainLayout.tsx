"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  Globe, 
  Mail
} from 'lucide-react';

export const PortalLogo = ({ className }: { className?: string }) => (
  <img src="/new-logo.jpeg" alt="البوابة الرقمية لعبدالملك المخلافي" className={`object-contain mix-blend-multiply ${className || ''}`} />
);

export const YemeniEagle = PortalLogo;

export const navLinks = [
  { id: 'home', path: '/', title: 'الرئيسية' },
  { id: 'bio', path: '/bio', title: 'السيرة والمحطات' },
  { id: 'vision', path: '/vision', title: 'مقالات ودراسات' },
  { id: 'archive', path: '/archive', title: 'الأرشيف الشامل' },
  { id: 'news', path: '/news', title: 'تصريحات ومواقف' },
  { id: 'library', path: '/library', title: 'المكتبة المرئية' },
  { id: 'contact', path: '/contact', title: 'تواصل' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
      setCurrentDate(new Intl.DateTimeFormat('ar-YE', options).format(new Date()));
    } catch (e) {
      setCurrentDate(new Date().toLocaleDateString('ar-EG'));
    }
  }, []);

  return (
    <>
      <div className="bg-[#f5f5f4] text-slate-700 py-2 text-[10px] md:text-xs border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-[#b18c39] transition-colors font-bold tracking-tight">
              <Globe size={14} /> ENGLISH
            </button>
            <div className="h-3 w-px bg-slate-300"></div>
            <span className="font-bold opacity-80 uppercase hidden sm:block">{currentDate}</span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto mt-1 md:mt-0">
             <div className="relative w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="البحث في البوابة..." 
                  className="bg-white border border-slate-200 rounded-none py-1.5 md:py-1 px-8 text-xs focus:ring-1 focus:ring-[#b18c39] transition-all w-full md:w-56 outline-none"
                />
                <Search size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
             </div>
          </div>
        </div>
      </div>

      <header className="bg-white py-3 md:py-4 border-b-4 border-slate-100 shadow-sm relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center relative z-10 gap-3 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 text-center md:text-right">
            <PortalLogo className="h-20 md:h-28 w-auto" /> 
          </div>
          <div className="hidden lg:block text-left opacity-20" dir="ltr">
             <p className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] leading-none">The Digital Portal</p>
             <p className="text-[9px] md:text-[10px] font-bold text-slate-800 uppercase mt-1">Abdulmalik Al-Mekhlafi</p>
          </div>
        </div>
      </header>

      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-md border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4">
          <ul className="hidden lg:flex items-center justify-between text-slate-700 text-sm font-bold w-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.id} className={`flex-1 text-center border-l border-slate-50 ${isActive ? 'bg-[#b18c39] text-white shadow-inner' : 'hover:text-[#b18c39] hover:bg-slate-50 transition-all cursor-pointer'}`}>
                  <Link href={link.path} className="block py-5 w-full h-full">
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="lg:hidden p-5 flex justify-between text-slate-800">
             <span className="font-bold text-slate-500">القائمة</span>
             <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="text-[#b18c39]" /> : <Menu className="text-[#b18c39]" />}
             </button>
          </div>
          {isMenuOpen && (
            <div className="lg:hidden flex flex-col bg-white border-t border-slate-100">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.id}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`p-4 text-right border-b border-slate-50 text-sm font-bold ${isActive ? 'bg-[#b18c39] text-white' : 'text-slate-700'}`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-4 py-8 md:py-16 overflow-hidden">
        {children}
      </main>

      <footer className="bg-white text-slate-800 mt-32 pt-32 pb-12 border-t-[10px] border-[#b18c39] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 md:gap-24 mb-16 md:mb-24 text-center md:text-right">
            <div className="col-span-2 flex flex-col items-center md:items-start">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 mb-8 md:mb-12">
                <PortalLogo className="h-24 md:h-32 w-auto" />
              </div>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg font-bold md:pr-16 tracking-tight">
                البوابة الرسمية الشاملة والأرشيف التاريخي للمفكر والسياسي اليمني عبدالملك المخلافي، بهدف توثيق المواقف، الأبحاث، وحفظ الذاكرة الوطنية المعاصرة.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-black text-slate-900 text-xl mb-12 border-b border-slate-100 pb-4 inline-block tracking-[0.2em]">خارطة البوابة</h4>
              <ul className="space-y-6 text-sm font-bold text-slate-500">
                {navLinks.slice(1, 7).map(link => (
                   <li key={link.id} className="hover:text-[#b18c39] transition-colors flex items-center md:justify-start justify-center gap-4 group font-black uppercase text-xs tracking-widest">
                    <div className="hidden md:block w-2 h-0.5 bg-slate-300 group-hover:bg-[#b18c39] transition-all"></div> 
                    <Link href={link.path}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-black text-slate-900 text-xl mb-12 border-b border-slate-100 pb-4 inline-block tracking-[0.2em]">تواصل مباشر</h4>
              <ul className="space-y-6 text-sm font-bold text-slate-500">
                <li className="flex items-center justify-center md:justify-start gap-4 hover:text-[#b18c39] transition-colors cursor-pointer group" dir="ltr">
                  <Mail className="text-slate-300 group-hover:text-[#b18c39] transition-colors shrink-0 w-5 h-5" /> <span className="text-right">info@mikhlafi-advisor.ye</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-4 hover:text-[#b18c39] transition-colors cursor-pointer group" dir="ltr">
                  <Globe className="text-slate-300 group-hover:text-[#b18c39] transition-colors shrink-0 w-5 h-5" /> <span className="text-right">mikhlafi-advisor.ye</span>
                </li>
                <li className="pt-10 flex gap-6 justify-center md:justify-start w-full">
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center hover:bg-[#b18c39] hover:text-white transition-all cursor-pointer border border-slate-200 font-black text-xl italic shadow-sm shadow-[#b18c39]/10">X</div>
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center hover:bg-[#b18c39] hover:text-white transition-all cursor-pointer border border-slate-200 font-black text-xl italic shadow-sm shadow-[#b18c39]/10">f</div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-600">
            <p>© 2026 جميع الحقوق محفوظة - البوابة الرسمية لعبدالملك المخلافي</p>
            <p className="tracking-widest uppercase">The Official Portal</p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-[0.02] pointer-events-none">
           <YemeniEagle className="w-[60rem] h-[60rem] translate-x-1/4 translate-y-1/4" />
        </div>
      </footer>
    </>
  );
}
