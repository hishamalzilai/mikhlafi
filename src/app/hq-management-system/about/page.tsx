import { getAboutContentAction } from '../about-actions';
import AboutForm from './about-form';

export const metadata = {
  title: 'إدارة صفحة من نحن - لوحة التحكم',
};

export default async function AboutManagementPage() {
  const currentContent = await getAboutContentAction();

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-2">إدارة صفحة من نحن</h1>
        <p className="text-slate-500 font-medium">قم بتعديل النص التعريفي (من نحن) المعروض في الموقع.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <AboutForm initialData={currentContent || { text: '' }} />
      </div>
    </div>
  );
}
