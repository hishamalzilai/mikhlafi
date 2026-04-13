import type { Metadata } from 'next';
import './globals.css';
import MainLayout from '@/components/MainLayout';

export const metadata: Metadata = {
  title: 'عبدالملك المخلافي - البوابة الرسمية',
  description: 'البوابة الرقمية الشاملة والأرشيف التاريخي للمفكر والسياسي اليمني عبدالملك المخلافي.',
};

export const viewport = {
  themeColor: '#fafaf9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen selection:bg-amber-100 selection:text-amber-900 bg-[#fafaf9] text-[#1c1917]">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
