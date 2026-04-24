"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadFile, formatSize, type UploadProgress } from '@/lib/upload';
import { Loader2, Plus, Trash2, Edit, CheckCircle2, Archive, Image as ImageIcon, FileText, Video, Calendar, Eye, Link2, Tag, Upload, X, ExternalLink, CloudUpload, Zap } from 'lucide-react';

const ARCHIVE_TYPES = [
  { id: 'photo', label: 'صورة تاريخية', icon: '📸', color: 'text-amber-600 bg-amber-50 border-amber-200', accept: 'image/*' },
  { id: 'document', label: 'وثيقة', icon: '📄', color: 'text-blue-600 bg-blue-50 border-blue-200', accept: '.pdf,.doc,.docx' },
  { id: 'letter', label: 'رسالة', icon: '✉️', color: 'text-teal-600 bg-teal-50 border-teal-200', accept: '.pdf,.doc,.docx,image/*' },
  { id: 'video', label: 'تسجيل مرئي', icon: '🎬', color: 'text-purple-600 bg-purple-50 border-purple-200', accept: 'video/*' },
];

export default function AdminArchivePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('all');
  const ITEMS_PER_PAGE = 10;

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('photo');
  const [publishedDate, setPublishedDate] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Upload states
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [coverUploadProgress, setCoverUploadProgress] = useState<UploadProgress | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('archive').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setIsAdding(false); setEditId(null);
    setTitle(''); setDescription(''); setType('photo'); setPublishedDate('');
    setFileUrl(''); setCoverUrl('');
    setPreviewUrl(''); setUploadProgress(null); setCoverUploadProgress(null);
    setCompressionInfo(''); setIsDragging(false);
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setType(item.type || 'photo');
    setPublishedDate(item.published_date || '');
    setFileUrl(item.file_url || '');
    setCoverUrl(item.cover_url || '');
    setPreviewUrl(item.file_url || item.cover_url || '');
    setIsAdding(true);
  };

  // Handle file upload with compression
  const handleFileUpload = async (file: File, target: 'content' | 'cover') => {
    const progressSetter = target === 'content' ? setUploadProgress : setCoverUploadProgress;

    try {
      const result = await uploadFile(
        file,
        type as 'photo' | 'document' | 'video',
        (progress) => progressSetter(progress)
      );

      if (target === 'content') {
        setFileUrl(result.url);
        if (type === 'photo') setPreviewUrl(result.url);
        if (result.compressionRatio > 0) {
          setCompressionInfo(`✅ تم الضغط: ${formatSize(result.originalSize)} → ${formatSize(result.compressedSize)} (وفّرت ${result.compressionRatio}%)`);
        }
      } else {
        setCoverUrl(result.url);
      }

      // Clear progress after delay
      setTimeout(() => progressSetter(null), 3000);

    } catch (error: any) {
      progressSetter({ stage: 'error', percent: 0, message: error.message });
      setTimeout(() => progressSetter(null), 5000);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFileUpload(file, 'content');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newEntity: any = {
        title, description, type,
        published_date: publishedDate || new Date().toISOString().split('T')[0],
        file_url: fileUrl || null,
        cover_url: coverUrl || null,
      };
      if (editId) {
        const res = await fetch('/api/admin/archive', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...newEntity }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setSuccessMsg('تم تعديل المادة الأرشيفية بنجاح!');
      } else {
        const res = await fetch('/api/admin/archive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntity),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setSuccessMsg('تمت إضافة المادة الأرشيفية بنجاح!');
      }
      resetForm(); fetchItems();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
      alert("خطأ: " + error.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه المادة الأرشيفية نهائياً؟")) return;
    try {
      const res = await fetch('/api/admin/archive', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      fetchItems();
    } catch (e: any) {
      alert("خطأ في الحذف: " + e.message);
    }
  };

  const filteredItems = filterType === 'all' ? items : items.filter(i => i.type === filterType);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const getTypeInfo = (t: string) => ARCHIVE_TYPES.find(at => at.id === t) || ARCHIVE_TYPES[0];
  const getTypeIcon = (t: string) => {
    switch (t) { case 'photo': return <ImageIcon className="w-4 h-4" />; case 'document': return <FileText className="w-4 h-4" />; case 'video': return <Video className="w-4 h-4" />; default: return <FileText className="w-4 h-4" />; }
  };
  const currentTypeInfo = getTypeInfo(type);

  const photoCount = items.filter(i => i.type === 'photo').length;
  const docCount = items.filter(i => i.type === 'document').length;
  const letterCount = items.filter(i => i.type === 'letter').length;
  const videoCount = items.filter(i => i.type === 'video').length;

  // Progress bar component
  const ProgressBar = ({ progress, label }: { progress: UploadProgress | null; label?: string }) => {
    if (!progress) return null;
    const isError = progress.stage === 'error';
    const isDone = progress.stage === 'done';
    return (
      <div className={`mt-3 p-3 rounded-xl border ${isError ? 'bg-red-50 border-red-200' : isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'} animate-in fade-in duration-300`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-bold ${isError ? 'text-red-600' : isDone ? 'text-emerald-600' : 'text-blue-600'}`}>
            {progress.message}
          </span>
          {!isError && <span className="text-xs font-black text-slate-500">{progress.percent}%</span>}
        </div>
        {!isError && (
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-[#b18c39]'}`}
              style={{ width: `${progress.percent}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة الأرشيف الشامل</h1>
          <p className="text-slate-500 font-medium mt-1">إضافة وتنظيم الصور التاريخية، الوثائق الرسمية، والتسجيلات المرئية.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus className="w-5 h-5" /> إضافة مادة جديدة
          </button>
        )}
      </div>

       {/* Stats Cards */}
       {!isAdding && (
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md"><Archive className="w-6 h-6 text-[#b18c39]" /></div>
               <div><div className="text-2xl font-black text-slate-900">{items.length}</div><div className="text-xs font-bold text-slate-500">إجمالي المواد</div></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200"><ImageIcon className="w-6 h-6 text-amber-600" /></div>
               <div><div className="text-2xl font-black text-slate-900">{photoCount}</div><div className="text-xs font-bold text-slate-500">صور تاريخية</div></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200"><FileText className="w-6 h-6 text-blue-600" /></div>
               <div><div className="text-2xl font-black text-slate-900">{docCount}</div><div className="text-xs font-bold text-slate-500">وثائق</div></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center border border-teal-200"><FileText className="w-6 h-6 text-teal-600" /></div>
               <div><div className="text-2xl font-black text-slate-900">{letterCount}</div><div className="text-xs font-bold text-slate-500">رسائل</div></div>
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

      {/* Add/Edit Form */}
      {isAdding ? (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-black text-slate-800 mb-6 border-b pb-4 flex items-center gap-3">
            <Archive className="w-6 h-6 text-[#b18c39]" />
            {editId ? 'تعديل المادة الأرشيفية' : 'إضافة مادة أرشيفية جديدة'}
          </h2>
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {/* Type Selection Cards */}
            <div>
              <label className="block text-slate-700 font-bold mb-3">نوع المادة الأرشيفية *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ARCHIVE_TYPES.map(archiveType => (
                  <button key={archiveType.id} type="button" onClick={() => { setType(archiveType.id); setFileUrl(''); setPreviewUrl(''); setUploadProgress(null); }}
                    className={`p-5 rounded-xl border-2 text-right transition-all duration-300 flex items-center gap-4 group ${type === archiveType.id ? 'border-[#b18c39] bg-[#b18c39]/5 shadow-lg shadow-[#b18c39]/10 scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}>
                    <span className="text-3xl">{archiveType.icon}</span>
                    <div>
                      <div className={`font-black text-base ${type === archiveType.id ? 'text-[#b18c39]' : 'text-slate-700'}`}>{archiveType.label}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">
                        {archiveType.id === 'photo' ? 'صور فوتوغرافية توثيقية' : archiveType.id === 'document' ? 'وثائق ورسائل رسمية' : 'مقاطع فيديو ومقابلات'}
                      </div>
                    </div>
                    {type === archiveType.id && <div className="mr-auto"><CheckCircle2 className="w-6 h-6 text-[#b18c39]" /></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-slate-700 font-bold mb-2">العنوان *</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold" placeholder="مثال: صورة تذكارية من مؤتمر الحوار الوطني..." />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-700 font-bold mb-2">الوصف التفصيلي *</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-medium resize-none text-slate-600 leading-relaxed" placeholder="اكتب وصفاً تفصيلياً عن هذه المادة الأرشيفية..."></textarea>
            </div>

            {/* === File Upload Section === */}
            <div className="bg-slate-50 p-6 border border-slate-100 rounded-2xl space-y-5">
              <h3 className="text-base font-black text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-3">
                <CloudUpload className="w-5 h-5 text-[#b18c39]" />
                رفع الملفات
                <span className="text-xs font-medium text-slate-400 mr-auto flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {type === 'photo' ? 'يتم ضغط الصور تلقائياً بصيغة WebP' : type === 'video' ? 'يتم رفع الفيديو مباشرة' : 'يتم رفع الوثيقة مباشرة'}
                </span>
              </h3>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group ${isDragging
                    ? 'border-[#b18c39] bg-[#b18c39]/10 scale-[1.01]'
                    : fileUrl
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-slate-300 bg-white hover:border-[#b18c39] hover:bg-[#b18c39]/5'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={currentTypeInfo.accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'content');
                  }}
                />

                {fileUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    {type === 'photo' && previewUrl ? (
                      <div className="w-full max-w-sm h-48 rounded-xl overflow-hidden border border-slate-200 shadow-md mx-auto">
                        <img src={previewUrl} alt="معاينة" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-emerald-600 font-bold text-sm">تم رفع الملف بنجاح!</p>
                      <p className="text-slate-400 text-xs font-medium mt-1">اضغط هنا لتغيير الملف</p>
                    </div>
                    {compressionInfo && (
                      <div className="text-xs font-bold text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> {compressionInfo}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-[#b18c39]/20' : 'bg-slate-100 group-hover:bg-[#b18c39]/10'}`}>
                      <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-[#b18c39]' : 'text-slate-400 group-hover:text-[#b18c39]'}`} />
                    </div>
                    <div>
                      <p className="text-slate-700 font-bold">
                        {isDragging ? 'أفلت الملف هنا...' : 'اسحب الملف وأفلته هنا'}
                      </p>
                      <p className="text-slate-400 text-sm font-medium mt-1">
                        أو <span className="text-[#b18c39] font-bold underline">تصفح الملفات</span> من جهازك
                      </p>
                    </div>
                    <p className="text-xs text-slate-300 font-bold">
                      {type === 'photo' ? 'JPG, PNG, WebP — يتم الضغط تلقائياً إلى أقل من 500KB'
                        : type === 'video' ? 'MP4, WebM, MOV'
                          : 'PDF, DOC, DOCX'}
                    </p>
                  </div>
                )}
              </div>

              <ProgressBar progress={uploadProgress} />

              {/* Cover Upload for Videos */}
              {type === 'video' && (
                <div>
                  <label className="block text-slate-600 font-bold mb-2 text-sm">صورة الغلاف (اختياري)</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => coverInputRef.current?.click()} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:border-[#b18c39] transition-all text-sm font-bold text-slate-600 shadow-sm">
                      <ImageIcon className="w-4 h-4" />
                      {coverUrl ? 'تغيير الغلاف' : 'رفع صورة غلاف'}
                    </button>
                    {coverUrl && <span className="text-xs text-emerald-500 font-bold">✅ تم الرفع</span>}
                  </div>
                  <input ref={coverInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'cover'); }} />
                  <ProgressBar progress={coverUploadProgress} />
                </div>
              )}

              {/* Manual URL fallback */}
              <details className="mt-2">
                <summary className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                  أو أدخل الرابط يدوياً ▾
                </summary>
                <div className="mt-3 space-y-3">
                  <div className="relative">
                    <Link2 className="w-5 h-5 absolute top-3 right-3 text-slate-400" />
                    <input type="url" value={fileUrl} onChange={e => { setFileUrl(e.target.value); if (type === 'photo') setPreviewUrl(e.target.value); }} className="w-full bg-white border border-slate-200 rounded-xl p-3 pr-10 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-medium text-slate-700 text-sm" placeholder="https://example.com/file.jpg" dir="ltr" />
                  </div>
                </div>
              </details>
            </div>

            {/* Date */}
            <div className="max-w-sm">
              <label className="block text-slate-700 font-bold mb-2">التاريخ</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute top-3.5 right-3 text-slate-400" />
                <input type="date" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold text-slate-700" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 pt-6 border-t border-slate-100">
              <button type="submit" disabled={saving || uploadProgress?.stage === 'uploading' || uploadProgress?.stage === 'compressing'} className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-10 py-4 rounded-xl font-black transition-all shadow-lg shadow-[#b18c39]/20 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editId ? 'حفظ التعديلات' : 'نشر في الأرشيف')}
              </button>
              <button type="button" onClick={resetForm} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto">
                إلغاء الأمر
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => { setFilterType('all'); setCurrentPage(1); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filterType === 'all' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
              الكل ({items.length})
            </button>
            {ARCHIVE_TYPES.map(t => (
              <button key={t.id} onClick={() => { setFilterType(t.id); setCurrentPage(1); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${filterType === t.id ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                <span>{t.icon}</span> {t.label} ({items.filter(i => i.type === t.id).length})
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-20 text-center flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#b18c39]" /></div>
            ) : filteredItems.length === 0 ? (
              <div className="p-24 text-center text-slate-500 flex flex-col items-center">
                <Archive className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-xl font-black text-slate-700 mb-2">لا توجد أي مواد أرشيفية</h3>
                <p>ابدأ بإضافة أول مادة أرشيفية لتنعكس مباشرة على الموقع!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right whitespace-nowrap">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-sm">
                    <tr>
                      <th className="p-5 font-black">م</th>
                      <th className="p-5 font-black">المعاينة</th>
                      <th className="p-5 font-black">العنوان</th>
                      <th className="p-5 font-black">النوع</th>
                      <th className="p-5 font-black">التاريخ</th>
                      <th className="p-5 font-black text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((item, i) => {
                      const typeInfo = getTypeInfo(item.type);
                      return (
                        <tr key={item.id} className="border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors group">
                          <td className="p-5 font-bold text-slate-400">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                          <td className="p-5">
                            {(item.file_url || item.cover_url) ? (
                              <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                                {item.type === 'photo' ? (
                                  <img src={item.file_url || item.cover_url} alt="" className="w-full h-full object-cover" />
                                ) : item.type === 'video' ? (
                                  <div className="w-full h-full bg-purple-50 flex items-center justify-center"><Video className="w-5 h-5 text-purple-400" /></div>
                                ) : (
                                  <div className="w-full h-full bg-blue-50 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-400" /></div>
                                )}
                              </div>
                            ) : (
                              <div className="w-16 h-12 rounded-lg bg-slate-100 border border-dashed border-slate-200 flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-slate-300" />
                              </div>
                            )}
                          </td>
                          <td className="p-5 font-bold text-slate-800 max-w-xs truncate" title={item.title}>{item.title}</td>
                          <td className="p-5">
                            <span className={`text-xs font-black px-3 py-1.5 border rounded-full inline-flex items-center gap-1.5 ${typeInfo.color}`}>
                              {getTypeIcon(item.type)} {typeInfo.label}
                            </span>
                          </td>
                          <td className="p-5 text-slate-500 font-medium" dir="ltr">{item.published_date}</td>
                          <td className="p-5">
                            <div className="flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                              <a href={`/archive/${item.id}`} target="_blank" className="p-2.5 text-slate-500 bg-slate-50 hover:bg-slate-600 hover:text-white rounded-lg transition-all shadow-sm" title="معاينة"><Eye className="w-4 h-4" /></a>
                              <button onClick={() => handleEdit(item)} className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-lg transition-all shadow-sm" title="تعديل"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm" title="حذف"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4">
                    <button type="button" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-50 text-sm font-bold transition-all shadow-sm">السابق</button>
                    <span className="text-slate-500 font-bold text-sm">صفحة {currentPage} من {totalPages} — {filteredItems.length} مادة</span>
                    <button type="button" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-50 text-sm font-bold transition-all shadow-sm">التالي</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
