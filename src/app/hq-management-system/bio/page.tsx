"use client";

import React, { useState, useEffect } from 'react';
import { getCvData, saveCvData } from '../actions';
import { Loader2, CheckCircle2, UserRound, Plus, Trash2, GripVertical, AlertTriangle } from 'lucide-react';

export default function BioManagement() {
  const [data, setData] = useState<{ biography: string[], positions: { role: string, detail: string }[] }>({ biography: [], positions: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cv = await getCvData();
        setData(cv);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const res = await saveCvData(data);
    if (res.success) {
      setSuccessMsg('تم حفظ وتحديث السيرة والمحطات بنجاح للموقع وتحديثها لجميع الزوار!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg('حدث خطأ أثناء الحفظ. تأكد من أن السيرفر يمتلك صلاحيات الكتابة.');
    }
    setSaving(false);
  };

  const updateBioParagraph = (index: number, text: string) => {
    const newBio = [...data.biography];
    newBio[index] = text;
    setData({ ...data, biography: newBio });
  };

  const addBioParagraph = () => {
    setData({ ...data, biography: [...data.biography, ''] });
  };

  const removeBioParagraph = (index: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الفقرة نهائياً؟')) {
      const newBio = [...data.biography];
      newBio.splice(index, 1);
      setData({ ...data, biography: newBio });
    }
  };

  const updatePosition = (index: number, field: 'role' | 'detail', text: string) => {
    const newPos = [...data.positions];
    newPos[index] = { ...newPos[index], [field]: text };
    setData({ ...data, positions: newPos });
  };

  const addPosition = () => {
    setData({ ...data, positions: [...data.positions, { role: '', detail: '' }] });
  };

  const removePosition = (index: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المحطة/البطاقة التعريفية؟')) {
       const newPos = [...data.positions];
       newPos.splice(index, 1);
       setData({ ...data, positions: newPos });
    }
  };

  const movePosition = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.positions.length - 1) return;
    
    const newPos = [...data.positions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newPos[index], newPos[targetIndex]] = [newPos[targetIndex], newPos[index]];
    setData({ ...data, positions: newPos });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#b18c39]" />
        <p className="text-slate-500 font-bold">جاري تحميل السيرة الذاتية...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
       {/* Header */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-[#b18c39]/10 rounded-2xl flex items-center justify-center hidden sm:flex">
               <UserRound className="w-7 h-7 text-[#b18c39]" />
             </div>
             <div>
               <h1 className="text-2xl font-black text-slate-900">إدارة السيرة والمحطات</h1>
               <p className="text-slate-500 font-medium mt-1">تحديث بيانات السيرة الذاتية المفصلة والبطاقة التعريفية والمحطات النضالية.</p>
             </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-50">
             {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
             حفظ التعديلات
          </button>
       </div>

       {successMsg && (
          <div className="mb-8 p-5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-3 shadow-sm animate-in zoom-in-95">
             <CheckCircle2 className="w-6 h-6 shrink-0" /> {successMsg}
          </div>
       )}
       {errorMsg && (
          <div className="mb-8 p-5 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold flex items-center gap-3 shadow-sm">
             <AlertTriangle className="w-6 h-6 shrink-0" /> {errorMsg}
          </div>
       )}

       <div className="grid xl:grid-cols-2 gap-8">
          {/* Section 1: Biography Paragraphs */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
             <div className="bg-slate-900 p-6 flex justify-between items-center">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                   النص الكامل للسيرة الذاتية (فقرات)
                </h2>
                <button onClick={addBioParagraph} className="text-xs bg-white text-slate-900 hover:bg-[#b18c39] hover:text-white px-4 py-2 font-black rounded-lg transition-colors flex items-center gap-1">
                   <Plus className="w-4 h-4" /> إضافة فقرة جديدة
                </button>
             </div>
             <div className="p-6 md:p-8 space-y-6">
                {data.biography.map((para, i) => (
                   <div key={i} className="relative group">
                      <div className="absolute top-4 right-4 flex items-center gap-2 z-10 w-8 h-8 rounded-full bg-[#b18c39]/10 text-[#b18c39] font-black justify-center">
                         {i + 1}
                      </div>
                      <textarea
                         value={para}
                         onChange={(e) => updateBioParagraph(i, e.target.value)}
                         rows={4}
                         className="w-full bg-slate-50 border border-slate-200 focus:border-[#b18c39] focus:ring-1 focus:ring-[#b18c39] rounded-2xl p-5 pt-14 text-slate-700 font-medium leading-loose transition-all resize-none shadow-sm group-hover:shadow-md"
                         placeholder="اكتب التوثيق هنا..."
                      />
                      <button onClick={() => removeBioParagraph(i)} className="absolute bottom-4 left-4 p-2 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white tooltip" title="حذف هذه الفقرة">
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                ))}
             </div>
          </div>

          {/* Section 2: Positions / Timeline */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full">
             <div className="bg-slate-900 p-6 flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                   البطاقة التعريفية والمحطات
                </h2>
                <button onClick={addPosition} className="text-xs bg-white text-slate-900 hover:bg-[#b18c39] hover:text-white px-4 py-2 font-black rounded-lg transition-colors flex items-center gap-1">
                   <Plus className="w-4 h-4" /> إضافة محطة جديدة
                </button>
             </div>
             
             <div className="p-6 md:p-8 space-y-4 flex-1 bg-slate-50">
                {data.positions.map((pos, i) => (
                   <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex flex-col gap-1 text-slate-300">
                         <button onClick={() => movePosition(i, 'up')} disabled={i === 0} className="hover:text-[#b18c39] disabled:opacity-30"><GripVertical className="w-5 h-5 -mb-2" /></button>
                         <button onClick={() => movePosition(i, 'down')} disabled={i === data.positions.length - 1} className="hover:text-[#b18c39] disabled:opacity-30"><GripVertical className="w-5 h-5 -mt-2" /></button>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block">الوظيفة / اللقب (مثل: الديانة، المنصب)</label>
                            <input 
                               value={pos.role} 
                               onChange={(e) => updatePosition(i, 'role', e.target.value)}
                               className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-[#b18c39] px-3 py-2 text-sm font-black text-[#b18c39] outline-none transition-colors"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block">التفاصيل (مثل: السنة، وصف المكان)</label>
                            <textarea 
                               value={pos.detail} 
                               onChange={(e) => updatePosition(i, 'detail', e.target.value)}
                               rows={2}
                               className="w-full bg-slate-50 border border-slate-200 focus:border-[#b18c39] rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none transition-colors resize-none"
                            />
                         </div>
                      </div>

                      <button onClick={() => removePosition(i)} className="p-3 bg-red-50 text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white shrink-0 self-start">
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                ))}
                
                {data.positions.length === 0 && (
                   <div className="text-center py-12 text-slate-500 font-bold opacity-70">
                      لا توجد أي محطات أو بيانات تعريفية بعد.
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}
