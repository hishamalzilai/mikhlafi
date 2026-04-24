"use client";

import React, { useRef, useState, useEffect } from 'react';
import { 
  Shield, 
  Globe, 
  Scale, 
  Users, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { TimelineItem } from '@/app/hq-management-system/home-actions';

const ICON_MAP: Record<string, any> = {
  Shield,
  Globe,
  Scale,
  Users,
  BookOpen,
  Calendar
};

interface TimelineCarouselProps {
  items: TimelineItem[];
}

export default function TimelineCarousel({ items }: TimelineCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(true);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // In RTL, scrollLeft is negative or zero
      setShowRightArrow(scrollLeft < 0);
      setShowLeftArrow(Math.abs(scrollLeft) + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      // Observer for content changes
      const observer = new ResizeObserver(checkScroll);
      observer.observe(el);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        observer.disconnect();
      };
    }
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group/carousel">
      {/* Side Fade Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-500"></div>

      {/* Navigation Arrows - Glassmorphism style */}
      <div className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 transition-all duration-500 ${showRightArrow ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <button 
          onClick={() => scroll('right')}
          className="bg-slate-900/10 backdrop-blur-sm hover:bg-[#b18c39] text-white/40 hover:text-white w-12 h-12 flex items-center justify-center rounded-full transition-all border border-white/5 hover:border-[#b18c39] hover:scale-110 active:scale-95"
          aria-label="Previous"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 transition-all duration-500 ${showLeftArrow ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <button 
          onClick={() => scroll('left')}
          className="bg-slate-900/10 backdrop-blur-sm hover:bg-[#b18c39] text-white/40 hover:text-white w-12 h-12 flex items-center justify-center rounded-full transition-all border border-white/5 hover:border-[#b18c39] hover:scale-110 active:scale-95"
          aria-label="Next"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Carousel Container */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-12 pt-4 px-12 md:px-24"
        style={{ 
          scrollSnapType: 'x mandatory',
          cursor: 'grab',
          userSelect: 'none'
        }}
        onMouseDown={(e) => {
          const el = scrollRef.current;
          if (!el) return;
          el.style.scrollSnapType = 'none';
          el.style.cursor = 'grabbing';
          const startX = e.pageX - el.offsetLeft;
          const scrollLeft = el.scrollLeft;
          
          const onMouseMove = (e: MouseEvent) => {
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 2;
            el.scrollLeft = scrollLeft - walk;
          };
          
          const onMouseUp = () => {
            el.style.scrollSnapType = 'x mandatory';
            el.style.cursor = 'grab';
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
          };
          
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        }}
      >
        {items.map((item, i) => {
          const IconComponent = ICON_MAP[item.icon] || Shield;
          return (
            <div 
              key={i} 
              className="min-w-[300px] md:min-w-[400px] bg-slate-800/40 backdrop-blur-sm p-10 border border-slate-700/50 hover:bg-[#b18c39]/10 hover:border-[#b18c39]/50 transition-all duration-700 group/card relative shadow-2xl scroll-snap-align-start"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="absolute top-0 right-0 w-1 h-0 group-hover/card:h-full bg-[#b18c39] transition-all duration-700"></div>
              <div className="text-[#b18c39] group-hover/card:scale-110 transition-transform duration-500 mb-8 inline-block">
                <IconComponent size={48} strokeWidth={1} />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] text-[#b18c39] opacity-70 mb-4 block uppercase font-mono">{item.year}</span>
              <h4 className="font-black text-2xl text-white mb-6 leading-tight tracking-tight">{item.title}</h4>
              <p className="text-sm text-slate-400 group-hover/card:text-white transition-colors duration-500 leading-relaxed font-bold border-r-2 border-slate-700 group-hover/card:border-[#b18c39] pr-6">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
