import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://abdulmalik-almekhlafi.com'),
  title: {
    default: 'عبدالملك المخلافي | الموقع الرسمي',
    template: '%s | عبدالملك المخلافي'
  },
  description: 'الموقع الرقمي الشامل والأرشيف التاريخي للمفكر والسياسي اليمني عبدالملك المخلافي، يضم السيرة الذاتية، الرؤية السياسية، والمكتبة الرقمية.',
  keywords: ['عبدالملك المخلافي', 'اليمن', 'سياسة يمنية', 'فكر سياسي', 'أرشيف وطني', 'دبلوماسية'],
  authors: [{ name: 'عبدالملك المخلافي' }],
  creator: 'عبدالملك المخلافي',
  publisher: 'المكتب الإعلامي - عبدالملك المخلافي',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'الموقع الرسمي | عبدالملك المخلافي',
    description: 'المحتفظ الرقمي والأرشيف التاريخي للمفكر والسياسي اليمني عبدالملك المخلافي. استعرض المسيرة الوطنية، الدراسات، والمواقف السيادية.',
    url: 'https://abdulmalik-almekhlafi.com',
    siteName: 'عبدالملك المخلافي',
    locale: 'ar_AR',
    type: 'website',
    images: [
      {
        url: '/logo-last.png',
        width: 1200,
        height: 630,
        alt: 'عبدالملك المخلافي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الموقع الرسمي | عبدالملك المخلافي',
    description: 'الموقع الرقمي الشامل والأرشيف التاريخي للمفكر والسياسي اليمني عبدالملك المخلافي.',
    creator: '@almekhlafi_a',
    images: ['/logo-last.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/apple-icon.png',
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
