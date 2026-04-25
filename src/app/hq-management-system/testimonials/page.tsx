"use client";

import React, { useState, useEffect } from 'react';
import { 
  getTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../testimonials-actions';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  UserRound, 
  FileText, 
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    author_name: '',
    author_title: '',
    content: '',
    author_image: '',
    order_index: '0'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
        setSuccessMsg('تم تحديث الشهادة بنجاح!');
      } else {
        await createTestimonial(formData);
        setSuccessMsg('تمت إضافة الشهادة بنجاح!');
      }
      setTimeout(() => setSuccessMsg(''), 3000);
      cancel();
      fetchData();
    } catch (err) {
      alert('خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      author_name: item.author_name,
      author_title: item.author_title || '',
      content: item.content,
      author_image: item.author_image || '',
      order_index: item.order_index.toString()
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشهادة نهائياً؟')) return;
    try {
      await deleteTestimonial(id);
      fetchData();
    } catch (err) {
      alert('خطأ أثناء الحذف');
    }
  };

  const cancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ author_name: '', author_title: '', content: '', author_image: '', order_index: '0' });
  };

  return (
    <div className="animate-in fade-in duration-500" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
           <h1 className="text-2xl font-black text-slate-900">إدارة شهادات الموقف والمسيرة</h1>
           <p className="text-slate-500 font-medium mt-1">إضافة وتعديل قراءات النخبة والمقالات التوثيقية.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> إضافة مقال/شهادة جديدة
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
           <CheckCircle2 className="w-5 h-5" /> {successMsg}
        </div>
      )}

      {isAdding ? (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
             <h2 className="text-xl font-black text-slate-800">{editingId ? 'تعديل بيانات الشهادة' : 'محرر سجل التقدير'}</h2>
             <button onClick={cancel} className="text-slate-400 hover:text-slate-600"><ArrowRight size={20} className="rotate-180" /></button>
          </div>
          
          <form onSubmit={handleSave} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="block text-slate-700 font-bold">اسم الشخصية / الكاتب *</label>
                  <div className="relative">
                    <UserRound className="w-5 h-5 absolute top-3.5 right-4 text-slate-400" />
                    <input 
                      required
                      type="text"
                      value={formData.author_name}
                      onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pr-12 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold"
                      placeholder="اسم صاحب الشهادة..."
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="block text-slate-700 font-bold">الصفة أو اللقب</label>
                  <input 
                    type="text"
                    value={formData.author_title}
                    onChange={(e) => setFormData({...formData, author_title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold"
                    placeholder="مثال: سياسي ومفكر يمني"
                  />
               </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-700 font-bold">محتوى الشهادة / المقال *</label>
              <textarea 
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-medium leading-relaxed"
                placeholder="اكتب نص الشهادة أو المقال كاملاً هنا..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <div className="space-y-2">
                  <label className="block text-slate-700 font-bold">رابط صورة الكاتب (URL)</label>
                  <div className="relative">
                    <ImageIcon className="w-5 h-5 absolute top-3.5 right-4 text-slate-400" />
                    <input 
                      type="text"
                      value={formData.author_image}
                      onChange={(e) => setFormData({...formData, author_image: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 pr-12 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold"
                      placeholder="https://..."
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="block text-slate-700 font-bold">ترتيب العرض</label>
                  <input 
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({...formData, order_index: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold"
                  />
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                type="submit"
                disabled={saving}
                className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-10 py-4 rounded-xl font-black transition-all shadow-lg shadow-[#b18c39]/20 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? 'حفظ التعديلات' : 'نشر الشهادة')}
              </button>
              <button 
                type="button"
                onClick={cancel}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-10 py-4 rounded-xl font-bold transition-all w-full sm:w-auto"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#b18c39]" /></div>
          ) : testimonials.length === 0 ? (
            <div className="p-24 text-center text-slate-500 flex flex-col items-center">
               <FileText className="w-16 h-16 text-slate-200 mb-4" />
               <h3 className="text-xl font-black text-slate-700 mb-2">لا يوجد أي شهادات حالياً</h3>
               <p>ابدأ بتوثيق أول شهادة لتظهر مباشرة في سجل الموقف والمسيرة.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right whitespace-nowrap">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-sm">
                  <tr>
                    <th className="p-5 font-black text-center">ترتيب</th>
                    <th className="p-5 font-black">الشخصية</th>
                    <th className="p-5 font-black">المحتوى</th>
                    <th className="p-5 font-black text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5 text-center font-bold text-slate-400">{item.order_index}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
                            {item.author_image ? (
                              <img src={item.author_image} alt={item.author_name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <UserRound size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-black text-slate-800">{item.author_name}</div>
                            <div className="text-xs text-slate-400 font-bold mt-0.5">{item.author_title || 'بدون صفة'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 max-w-[300px] truncate font-medium text-slate-500">
                        {item.content}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-lg transition-all shadow-sm"
                            title="تعديل"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm"
                            title="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
