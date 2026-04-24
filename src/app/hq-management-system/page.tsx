"use client";

import { Activity, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 mb-10">
         <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#b18c39]" />
         </div>
         <div>
            <h1 className="text-3xl font-black text-slate-900">نظرة عامة</h1>
            <p className="text-slate-500 font-medium">لوحة التحكم والمؤشرات العامة</p>
         </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center p-12">
            <Activity className="w-12 h-12 text-[#b18c39] mb-4" />
            <h3 className="text-2xl font-black text-slate-800 mb-2">أهلاً بك في النظام الموحد</h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mt-2">
               جميع العمليات من نشر، وتعديل، وحذف، تتم بصورة لحظية (Real-Time). يرجى اختيار القسم المراد من القائمة الجانبية لإدارة محتوياته.
            </p>
         </div>
         {/* More stats can go here if needed in the future */}
      </div>
    </div>
  );
}
