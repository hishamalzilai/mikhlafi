import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'الموقع الرسمي | عبدالملك المخلافي',
  description: 'الموقع الرقمي الشامل والأرشيف التاريخي للمفكر والسياسي اليمني عبدالملك المخلافي، يضم السيرة الذاتية، الرؤية السياسية، والمكتبة الرقمية.',
  metadataBase: new URL('https://abdulmalik-almekhlafi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'الموقع الرسمي | عبدالملك المخلافي',
    description: 'المحتفظ الرقمي والأرشيف التاريخي للمفكر والسياسي اليمني عبدالملك المخلافي.',
    url: 'https://abdulmalik-almekhlafi.com',
    siteName: 'عبدالملك المخلافي',
    images: [
      {
        url: '/ol45hZcGOgfrIsNajVjc.webp',
        width: 1200,
        height: 630,
        alt: 'عبدالملك المخلافي',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'عبدالملك المخلافي | الموقع الرسمي',
    description: 'الموقع الرقمي الشامل والأرشيف التاريخي للمفكر والسياسي اليمني عبدالملك المخلافي.',
    images: ['/ol45hZcGOgfrIsNajVjc.webp'],
  },
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
