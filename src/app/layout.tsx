import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'الموقع الرسمي | عبدالملك المخلافي',
  description: 'الموقع الرقمي الشامل والأرشيف التاريخي للمفكر والسياسي اليمني عبدالملك المخلافي.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
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
        {children}
      </body>
    </html>
  );
}
