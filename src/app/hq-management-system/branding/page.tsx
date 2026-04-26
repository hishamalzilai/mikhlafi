"use client";

import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Maximize, RefreshCw, CheckCircle2, AlertCircle, Layout, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getBrandingSettings, updateBrandingSettings, BrandingSettings } from '../branding-actions';

export default function BrandingManagement() {
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getBrandingSettings();
      setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await updateBrandingSettings(settings);
      if (res.success) {
        setMessage({ type: 'success', text: 'تم حفظ إعدادات الهوية البصرية بنجاح' });
      } else {
        setMessage({ type: 'error', text: res.error || 'حدث خطأ أثناء الحفظ' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-10 h-10 text-[#b18c39] animate-spin" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Link href="/hq-management-system" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#b18c39] transition-colors mb-4 font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">إدارة الهوية البصرية</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">تحكم في الشعارات وقياساتها في الهيدر والفوتر.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-[#b18c39]/20 flex items-center gap-3 disabled:opacity-50 disabled:scale-95 active:scale-95"
        >
          {saving ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          حفظ التغييرات
        </button>
      </div>

      {message && (
        <div className={`p-5 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <p className="font-bold">{message.text}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Header Settings */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-8">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 bg-[#b18c39]/10 rounded-xl flex items-center justify-center text-[#b18c39]">
              <Layout className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">شعار رأس الصفحة (Header)</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" /> رابط الشعار
              </label>
              <input 
                type="text"
                value={settings.header_logo_url}
                onChange={(e) => setSettings({...settings, header_logo_url: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 font-bold focus:border-[#b18c39]/30 outline-none transition-all"
                placeholder="/logo.png"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-slate-400" /> مقياس الشعار (Scaling)
                </label>
                <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-[#b18c39]">
                  {settings.header_logo_scale}x
                </span>
              </div>
              <input 
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={settings.header_logo_scale}
                onChange={(e) => setSettings({...settings, header_logo_scale: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#b18c39]"
              />
              <div className="flex justify-between text-[10px] font-black text-slate-400 px-1">
                <span>0.5x</span>
                <span>1.0x (افتراضي)</span>
                <span>2.5x</span>
              </div>
            </div>
          </div>

          {/* Header Preview */}
          <div className="mt-4 p-8 bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">معاينة مباشرة (Header Preview)</span>
             <div className="bg-white py-6 px-4 border border-slate-200 rounded-2xl flex items-center justify-center min-h-[160px]">
                <img 
                  src={settings.header_logo_url} 
                  alt="Preview" 
                  style={{ transform: `scale(${settings.header_logo_scale})`, transition: 'transform 0.3s' }}
                  className="max-h-32 object-contain"
                />
             </div>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-8">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Layout className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">شعار ذيل الصفحة (Footer)</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" /> رابط الشعار
              </label>
              <input 
                type="text"
                value={settings.footer_logo_url}
                onChange={(e) => setSettings({...settings, footer_logo_url: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 font-bold focus:border-[#b18c39]/30 outline-none transition-all"
                placeholder="/logo-footer.png"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-slate-400" /> مقياس الشعار (Scaling)
                </label>
                <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-900">
                  {settings.footer_logo_scale}x
                </span>
              </div>
              <input 
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={settings.footer_logo_scale}
                onChange={(e) => setSettings({...settings, footer_logo_scale: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-[10px] font-black text-slate-400 px-1">
                <span>0.5x</span>
                <span>1.0x (افتراضي)</span>
                <span>2.5x</span>
              </div>
            </div>
          </div>

          {/* Footer Preview */}
          <div className="mt-4 p-8 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-6 text-center">معاينة مباشرة على خلفية الفوتر</span>
             <div className="py-6 px-4 flex items-center justify-center min-h-[160px]">
                <img 
                  src={settings.footer_logo_url} 
                  alt="Preview" 
                  style={{ transform: `scale(${settings.footer_logo_scale})`, transition: 'transform 0.3s' }}
                  className="max-h-32 object-contain"
                />
             </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 text-amber-900 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 shrink-0 mt-1" />
        <div>
          <h4 className="font-black mb-1">تعليمات هامة:</h4>
          <p className="text-sm font-medium leading-relaxed">
            استخدم روابط صور محلية (مثل `/logo-last.png`) أو روابط خارجية كاملة. 
            المتصفح سيقوم بنسخ صورة الشعار ومعالجتها لتناسب القياس الذي تحدده هنا. 
            تأكد من أن الصور بخلفية شفافة (PNG) لأفضل مظهر.
          </p>
        </div>
      </div>
    </div>
  );
}
