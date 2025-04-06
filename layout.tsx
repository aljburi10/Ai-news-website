import './globals.css';
import type { Metadata } from 'next';
import { Amiri, Tajawal } from 'next/font/google';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdScript from './components/ads/AdScript';

// تعريف الخطوط العربية
const tajawal = Tajawal({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
});

const amiri = Amiri({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

// تعريف وصف الموقع
export const metadata: Metadata = {
  title: 'موقع أخبار الذكاء الاصطناعي | أحدث أخبار الذكاء الاصطناعي باللغة العربية',
  description: 'موقع إخباري متخصص في أخبار الذكاء الاصطناعي والتكنولوجيا المتقدمة باللغة العربية. يقدم آخر التطورات في مجال الذكاء الاصطناعي وتطبيقاته.',
  keywords: 'ذكاء اصطناعي, أخبار الذكاء الاصطناعي, تكنولوجيا, ChatGPT, تعلم آلة, أخبار عربية',
  openGraph: {
    title: 'موقع أخبار الذكاء الاصطناعي | أحدث أخبار الذكاء الاصطناعي باللغة العربية',
    description: 'موقع إخباري متخصص في أخبار الذكاء الاصطناعي والتكنولوجيا المتقدمة باللغة العربية. يقدم آخر التطورات في مجال الذكاء الاصطناعي وتطبيقاته.',
    type: 'website',
    locale: 'ar_SA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} ${amiri.variable} font-sans bg-gray-50`}>
        {/* نص برمجي AdSense */}
        <AdScript />
        
        {/* رأس الصفحة */}
        <Header />
        
        {/* المحتوى الرئيسي */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        
        {/* تذييل الصفحة */}
        <Footer />
      </body>
    </html>
  );
}