import React from 'react';
import { YemeniEagle } from '@/components/MainLayout';

export default function ComingSoonPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in">
       <YemeniEagle className="w-32 h-32 text-stone-200 mb-8" />
       <h2 className="text-3xl font-black text-stone-900 mb-4">قريباً</h2>
       <p className="text-lg font-bold text-stone-500">جاري الإعداد والتجهيز لهذا القسم، سيتم افتتاحه قريباً.</p>
    </div>
  );
}
