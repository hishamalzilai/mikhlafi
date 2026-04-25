"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/upload';
import { Plus, Archive, Image as ImageIcon, Video, Trash2, Edit3, Loader2, CheckCircle2, Film, Clock, Search } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function LibraryManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [thumbnail, setThumbnail] = useState('');
  const [duration, setDuration] = useState(''); // e.g. "03:45"
  
  const [uploadProgress, setUploadProgress] = useState<{ progress: number, status: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { getLibraryAction } = await import('../library-actions');
      const result = await getLibraryAction();
      if (result.success && result.data) {
        setItems(result.data);
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      let fileToUpload = file;
      setUploadProgress({ progress: 0, status: 'جاري التحضير...' });

      // Compress Images
      if (file.type.startsWith('image/')) {
        setUploadProgress({ progress: 10, status: 'جاري ضغط الصورة...' });
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        fileToUpload = await imageCompression(file, options);
      }

      setUploadProgress({ progress: 30, status: 'جاري رفع الملف إلى الخادم...' });
      
      const { uploadMediaAction } = await import('../upload-actions');
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('path', 'library');
      formData.append('bucket', 'media');

      const result = await uploadMediaAction(formData);

      if (!result.success || !result.url) throw new Error(result.error || "خطأ في استلام رابط الملف");
      
      setUploadProgress({ progress: 80, status: 'إنهاء الرفع...' });

      const publicUrl = result.url;
      
      setThumbnail(publicUrl);
      setPreviewUrl(publicUrl);
      setUploadProgress({ progress: 100, status: 'اكتمل الرفع!' });
      
      setTimeout(() => setUploadProgress(null), 2000);

    } catch (err: any) {
      console.error(err);
      setUploadProgress({ progress: 0, status: `خطأ: ${err.message}` });
      setTimeout(() => setUploadProgress(null), 5000);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('photo');
    setThumbnail('');
    setDuration('');
    setPreviewUrl('');
    setEditId(null);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      if (editId) formData.append('id', String(editId));
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', type);
      formData.append('thumbnail_url', thumbnail);
      formData.append('duration', duration);

      const { saveLibraryItemAction } = await import('../library-actions');
      const result = await saveLibraryItemAction(formData);
      
      if (!result.success) throw new Error(result.error);

      setSuccessMsg(editId ? 'تم تحديث المادة بنجاح!' : 'تم إضافة المادة بنجاح!');
      setTimeout(() => setSuccessMsg(''), 3000);
      resetForm();
      fetchItems();
    } catch (err: any) {
      alert(`حدث خطأ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setType(item.type || 'photo');
    setThumbnail(item.thumbnail_url || '');
    setDuration(item.duration || '');
    setPreviewUrl(item.thumbnail || '');
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
      try {
        const { deleteLibraryItemAction } = await import('../library-actions');
        const result = await deleteLibraryItemAction(id);
        if (!result.success) throw new Error(result.error);
        setItems(items.filter(i => i.id !== id));
      } catch (e: any) {
        alert('خطأ أثناء الحذف: ' + e.message);
      }
    }
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Pagination Logic
  const filteredItems = filterType === 'all' ? items : items.filter(i => i.type === filterType);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const photoCount = items.filter(i => i.type === 'photo').length;
  const videoCount = items.filter(i => i.type === 'video').length;

  return (
    <div className="animate-in fade-in duration-500">
       {/* Header */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900">إدارة المكتبة المرئية</h1>
            <p className="text-slate-500 font-medium mt-1">تحديث وتنظيم الصور وتسجيلات الفيديو للمكتبة الإعلامية.</p>
          </div>
          {!isAdding && (
             <button onClick={() => setIsAdding(true)} className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
                <Plus className="w-5 h-5" /> إضافة مادة مرئية
             </button>
          )}
       </div>

       {/* Stats Grid */}
       {!isAdding && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md"><Film className="w-6 h-6 text-[#b18c39]" /></div>
               <div><div className="text-2xl font-black text-slate-900">{items.length}</div><div className="text-xs font-bold text-slate-500">إجمالي الوسائط</div></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200"><ImageIcon className="w-6 h-6 text-amber-600" /></div>
               <div><div className="text-2xl font-black text-slate-900">{photoCount}</div><div className="text-xs font-bold text-slate-500">الصور الفوتوغرافية</div></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-200"><Video className="w-6 h-6 text-purple-600" /></div>
               <div><div className="text-2xl font-black text-slate-900">{videoCount}</div><div className="text-xs font-bold text-slate-500">تسجيلات مرئية</div></div>
            </div>
         </div>
       )}

       {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
             <CheckCircle2 className="w-5 h-5" /> {successMsg}
          </div>
       )}

       {/* Form Section */}
       {isAdding && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100 mb-8 animate-in zoom-in-95 duration-500">
             <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 bg-[#b18c39]/10 rounded-2xl flex items-center justify-center">
                   {editId ? <Edit3 className="w-7 h-7 text-[#b18c39]" /> : <Plus className="w-7 h-7 text-[#b18c39]" />}
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900">{editId ? 'تعديل المادة' : 'إضافة مادة جديدة'}</h2>
                   <p className="text-slate-500 font-medium mt-1">يُرجى إدخال تفاصيل المادة المرئية بدقة ليتم عرضها في المنصة.</p>
                </div>
             </div>

             <form onSubmit={handleSave} className="space-y-8">
                {/* Media Type */}
                <div>
                   <label className="block text-slate-700 font-bold mb-4">نوع المادة المرئية</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => setType('photo')} className={`p-5 rounded-2xl border-2 flex flex-col justify-center items-center gap-3 transition-all ${type === 'photo' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                         <ImageIcon className={`w-8 h-8 ${type === 'photo' ? 'text-amber-500' : 'text-slate-400'}`} />
                         <span className="font-black">صورة فوتوغرافية</span>
                      </button>
                      <button type="button" onClick={() => setType('video')} className={`p-5 rounded-2xl border-2 flex flex-col justify-center items-center gap-3 transition-all ${type === 'video' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                         <Video className={`w-8 h-8 ${type === 'video' ? 'text-purple-500' : 'text-slate-400'}`} />
                         <span className="font-black">تسجيل مرئي (مقطع فيديو)</span>
                      </button>
                   </div>
                </div>

                {/* Upload Section */}
                <div>
                   <label className="block text-slate-700 font-bold mb-3 mt-8">
                     {type === 'video' ? 'لصورة غلاف الفيديو (Thumbnail)' : 'رفع الصورة'} *
                   </label>
                   
                   <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative overflow-hidden w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group ${isDragging ? 'border-[#b18c39] bg-[#b18c39]/5 scale-[1.02]' : previewUrl ? 'border-[#b18c39]/30 bg-[#b18c39]/5' : 'border-slate-300 bg-slate-50 hover:border-[#b18c39]/50 hover:bg-slate-100'}`}
                   >
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { if(e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]) }} />
                     
                     {previewUrl ? (
                        <>
                           <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-40 transition-opacity duration-300" />
                           <div className="relative z-10 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-slate-800 font-bold bg-white/90 px-6 py-3 rounded-full shadow-xl transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                              تغيير الصورة
                           </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center text-slate-500 text-center px-4">
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                             <ImageIcon className="w-8 h-8 text-[#b18c39]" />
                           </div>
                           <p className="font-black text-slate-700 text-lg mb-1">اضغط هنا أو اسحب الملف للإفلات</p>
                           <p className="text-sm font-medium">يتم ضغط الصور تلقائياً لدعم سرعة الموقع (WebP)</p>
                        </div>
                     )}

                     {uploadProgress && (
                        <div className="absolute bottom-4 left-4 right-4 z-20">
                           <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-slate-200">
                              <div className="flex justify-between text-xs font-bold mb-2">
                                 <span className="text-slate-800">{uploadProgress.status}</span>
                                 <span className="text-[#b18c39]">{Math.round(uploadProgress.progress)}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                 <div className="bg-[#b18c39] h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress.progress}%` }}></div>
                              </div>
                           </div>
                        </div>
                     )}
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div>
                      <label className="block text-slate-700 font-bold mb-3">العنوان الأساسي *</label>
                      <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#b18c39]/30 focus:border-[#b18c39] transition-all font-bold" placeholder="أدخل عنوان المادة..." />
                   </div>

                   {type === 'video' && (
                     <div>
                        <label className="block text-slate-700 font-bold mb-3">مدة طول المقطع (مثال: 03:45)</label>
                        <div className="relative">
                           <Clock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                           <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#b18c39]/30 focus:border-[#b18c39] transition-all font-bold" placeholder="00:00" />
                        </div>
                     </div>
                   )}
                </div>

                <div>
                   <label className="block text-slate-700 font-bold mb-3">الوصف (اختياري)</label>
                   <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#b18c39]/30 focus:border-[#b18c39] transition-all font-medium leading-relaxed" placeholder="أدخل وصف المادة هنا..." />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                   <button type="submit" disabled={saving || !thumbnail} className="flex-1 bg-[#b18c39] hover:bg-[#9a7930] text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#b18c39]/20 flex items-center justify-center gap-2 text-lg">
                      {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                      {editId ? 'تحديث المادة' : 'حفظ المادة'}
                   </button>
                   <button type="button" onClick={resetForm} className="px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-lg">
                      إلغاء الأمر
                   </button>
                </div>
             </form>
          </div>
       )}

       {/* Filters */}
       {!isAdding && items.length > 0 && (
         <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm inline-flex">
               <button onClick={() => { setFilterType('all'); setCurrentPage(1); }} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${filterType === 'all' ? 'bg-[#b18c39] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>الكل</button>
               <button onClick={() => { setFilterType('photo'); setCurrentPage(1); }} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${filterType === 'photo' ? 'bg-[#b18c39] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>صور</button>
               <button onClick={() => { setFilterType('video'); setCurrentPage(1); }} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${filterType === 'video' ? 'bg-[#b18c39] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>فيديوهات</button>
            </div>
         </div>
       )}

       {/* Table/List Section */}
       {!isAdding && Array.isArray(items) && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                {loading ? (
                   <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-[#b18c39]" />
                      <p className="font-bold text-lg">جاري تحميل وسائط المكتبة...</p>
                   </div>
                ) : items.length === 0 ? (
                   <div className="p-16 text-center text-slate-500 font-bold border-dashed border-2 border-slate-100 m-8 rounded-3xl bg-slate-50">
                      <Film className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      لا توجد مواد مرئية حتى الآن في المكتبة.
                   </div>
                ) : (
                   <table className="w-full text-right border-collapse">
                      <thead>
                         <tr className="bg-slate-900 border-b border-slate-800">
                            <th className="p-5 font-black text-slate-100 text-sm whitespace-nowrap">الوسائط</th>
                            <th className="p-5 font-black text-slate-100 text-sm whitespace-nowrap">النوع</th>
                            <th className="p-5 font-black text-slate-100 text-sm whitespace-nowrap">مدة الفيديو</th>
                            <th className="p-5 font-black text-slate-100 text-sm w-full">تاريخ الإضافة</th>
                            <th className="p-5 font-black text-slate-100 text-sm whitespace-nowrap text-center">إجراءات</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                         {paginatedItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                               <td className="p-5 align-middle">
                                  <div className="flex items-center gap-4">
                                     <div className="w-20 h-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 relative shrink-0 shadow-sm group-hover:shadow-md transition-all">
                                        <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                                        {item.type === 'video' && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                                              <PlayIcon className="w-3 h-3 text-[#b18c39] ml-0.5" />
                                            </div>
                                          </div>
                                        )}
                                     </div>
                                     <div>
                                        <div className="font-black text-slate-900 line-clamp-1">{item.title}</div>
                                        <div className="text-xs text-slate-500 mt-1 font-bold line-clamp-1">{item.description}</div>
                                     </div>
                                  </div>
                               </td>
                               <td className="p-5 align-middle">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${item.type === 'video' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                     {item.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                                     {item.type === 'video' ? 'فيديو' : 'صورة'}
                                  </span>
                               </td>
                               <td className="p-5 align-middle text-slate-600 font-bold text-sm whitespace-nowrap">
                                  {item.type === 'video' && item.duration ? (
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-slate-400" /> {item.duration}</span>
                                  ) : '-'}
                               </td>
                               <td className="p-5 align-middle text-slate-500 font-bold text-sm whitespace-nowrap">
                                  {new Date(item.created_at).toLocaleDateString('ar-SA')}
                               </td>
                               <td className="p-5 align-middle">
                                  <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => handleEdit(item)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm tooltip" title="تعديل">
                                        <Edit3 className="w-4 h-4" />
                                     </button>
                                     <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm tooltip" title="حذف">
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                )}
             </div>

             {/* Pagination */}
             {!loading && items.length > 0 && totalPages > 1 && (
                <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                   <div className="text-sm font-bold text-slate-500">
                      عرض {paginatedItems.length} من أصل {filteredItems.length}
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50 shadow-sm">
                         السابق
                      </button>
                      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50 shadow-sm">
                         التالي
                      </button>
                   </div>
                </div>
             )}
          </div>
       )}
    </div>
  );
}

// Helper icon component
const PlayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);
