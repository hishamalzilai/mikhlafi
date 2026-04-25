"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Edit2, Edit3, Trash2, 
  Image as ImageIcon, Video, FileText, Check, ChevronRight,
  Upload, X, Play, Clock, Loader2, CheckCircle2, Film
} from 'lucide-react';
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
  const [duration, setDuration] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
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
      if (result.success && result.data) setItems(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setSaving(true);
    const uploadedItems: any[] = [];
    
    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const statusPrefix = fileArray.length > 1 ? `(${i + 1}/${fileArray.length}) ` : '';
        setUploadProgress({ progress: 10, status: `${statusPrefix}جاري التحضير...` });

        let fileToUpload = file;
        if (file.type.startsWith('image/')) {
          setUploadProgress({ progress: 20, status: `${statusPrefix}جاري ضغط الصورة...` });
          const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
          fileToUpload = await imageCompression(file, options);
        }

        setUploadProgress({ progress: 40, status: `${statusPrefix}جاري الرفع...` });
        const { uploadMediaAction } = await import('../upload-actions');
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('path', 'library');
        formData.append('bucket', 'media');

        const result = await uploadMediaAction(formData);
        if (!result.success || !result.url) throw new Error(result.error);

        uploadedItems.push({
          title: file.name.split('.')[0],
          description: '',
          type: file.type.startsWith('image/') ? 'photo' : 'video',
          thumbnail_url: result.url,
          duration: null
        });
      }

      const { bulkSaveLibraryItemsAction } = await import('../library-actions');
      await bulkSaveLibraryItemsAction(uploadedItems);
      fetchItems();
      resetForm();
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  const handleYoutubeChange = (url: string) => {
    setYoutubeUrl(url);
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
      else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
      
      if (videoId) {
        const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        setThumbnail(url);
        setPreviewUrl(thumb);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('photo');
    setThumbnail('');
    setDuration('');
    setYoutubeUrl('');
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

      setSuccessMsg(editId ? 'تم التحديث!' : 'تمت الإضافة!');
      setTimeout(() => setSuccessMsg(''), 3000);
      resetForm();
      fetchItems();
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('حذف هذه المادة؟')) {
      const { deleteLibraryItemAction } = await import('../library-actions');
      await deleteLibraryItemAction(id);
      fetchItems();
    }
  };

  const filteredItems = filterType === 'all' ? items : items.filter(i => i.type === filterType);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
       {/* Header */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900">إدارة المكتبة المرئية</h1>
            <p className="text-slate-500 font-medium mt-1">تنظيم الصور وفيديوهات اليوتيوب للمنصة.</p>
          </div>
          {!isAdding && (
             <button onClick={() => setIsAdding(true)} className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg flex items-center gap-3">
                <Plus className="w-6 h-6" /> إضافة مادة جديدة
             </button>
          )}
       </div>

       {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl font-black flex items-center gap-3 animate-in slide-in-from-top-4">
             <CheckCircle2 className="w-6 h-6" /> {successMsg}
          </div>
       )}

       {isAdding && (
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95">
             <div className="flex items-center gap-5 mb-10 pb-8 border-b border-slate-100">
                <div className="w-16 h-16 bg-[#b18c39]/10 rounded-2xl flex items-center justify-center text-[#b18c39]">
                   {editId ? <Edit3 className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                </div>
                <div>
                   <h2 className="text-3xl font-black text-slate-900">{editId ? 'تعديل البيانات' : 'إضافة مادة للمكتبة'}</h2>
                   <p className="text-slate-500 font-medium">أضف روابط يوتيوب أو ارفع صورك مباشرة.</p>
                </div>
             </div>

             <form onSubmit={handleSave} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-slate-900 font-black text-sm block px-1">نوع المادة</label>
                      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1.5">
                         <button type="button" onClick={() => setType('photo')} className={`flex-1 py-4 rounded-xl font-black transition-all ${type === 'photo' ? 'bg-white text-[#b18c39] shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>صورة</button>
                         <button type="button" onClick={() => setType('video')} className={`flex-1 py-4 rounded-xl font-black transition-all ${type === 'video' ? 'bg-white text-[#b18c39] shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>فيديو (يوتيوب)</button>
                      </div>
                   </div>
                   {type === 'video' && (
                     <div className="space-y-4">
                        <label className="text-slate-900 font-black text-sm block px-1">المدة الزمنية</label>
                        <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="مثال: 05:30" className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 font-black focus:border-[#b18c39] outline-none transition-all" />
                     </div>
                   )}
                </div>

                {type === 'video' && (
                   <div className="space-y-4">
                      <label className="text-slate-900 font-black text-sm block px-1">رابط فيديو اليوتيوب</label>
                      <input type="text" value={youtubeUrl} onChange={(e) => handleYoutubeChange(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 font-black focus:border-[#b18c39] outline-none transition-all text-left dir-ltr" />
                   </div>
                )}

                <div className="space-y-4">
                   <label className="text-slate-900 font-black text-sm block px-1">{type === 'photo' ? 'رفع الصورة' : 'أو رفع غلاف مخصص للفيديو'}</label>
                   <div 
                     onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                     onDragLeave={() => setIsDragging(false)}
                     onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); }}
                     onClick={() => fileInputRef.current?.click()}
                     className={`relative h-64 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-[#b18c39] bg-[#b18c39]/5' : 'border-slate-300 hover:border-[#b18c39]/50 bg-slate-50'}`}
                   >
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple={type === 'photo'} onChange={(e) => e.target.files && handleFileUpload(e.target.files)} />
                      {previewUrl ? (
                         <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover rounded-[2rem] opacity-80" alt="Preview" />
                      ) : (
                         <div className="text-center space-y-4">
                            <Upload className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="font-black text-slate-500">اضغط هنا أو اسحب الملفات للرفع</p>
                         </div>
                      )}
                      {uploadProgress && (
                         <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-10 z-20">
                            <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                               <div className="bg-[#b18c39] h-full transition-all" style={{ width: `${uploadProgress.progress}%` }}></div>
                            </div>
                            <p className="font-black text-[#b18c39]">{uploadProgress.status}</p>
                         </div>
                      )}
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-slate-900 font-black text-sm block px-1">العنوان</label>
                   <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 font-black focus:border-[#b18c39] outline-none" placeholder="عنوان المادة..." />
                </div>

                <div className="flex gap-4 pt-10 border-t border-slate-100">
                   <button type="submit" disabled={saving || !thumbnail} className="flex-1 bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black text-xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                      {saving ? <Loader2 className="animate-spin w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
                      حفظ المادة
                   </button>
                   <button type="button" onClick={resetForm} className="px-10 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">إلغاء</button>
                </div>
             </form>
          </div>
       )}

       {/* List View */}
       {!isAdding && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {paginatedItems.map(item => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative">
                   <div className="aspect-video relative overflow-hidden bg-slate-100">
                      <img src={item.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={item.title} />
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="w-12 h-12 text-white drop-shadow-lg" />
                        </div>
                      )}
                   </div>
                   <div className="p-6">
                      <h3 className="font-black text-slate-900 text-lg line-clamp-1 mb-2">{item.title}</h3>
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${item.type === 'video' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                           {item.type === 'video' ? 'فيديو' : 'صورة'}
                        </span>
                        <div className="flex gap-2">
                           <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                        </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
}
