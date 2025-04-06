/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // يحدد مسار مجلد التطبيق في src
  srcDir: 'src',
  
  // تكوين مخرجات البناء
  distDir: '.next',
  
  // تحويل مسارات الصور
  images: {
    domains: ['ai-news-images.com', 'example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // إعدادات I18n للدعم العربي
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
    localeDetection: true,
  },
  
  // ضبط التخزين المؤقت
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 2,
  },
  
  // تمكين التذييل والترويسة المضمنة
  poweredByHeader: false,
  
  // دعم وضع التوجيه الصارم
  strictMode: true,
  
  // الإعدادات التجريبية
  experimental: {
    // تم نقل بعض الخيارات لتتوافق مع النسخة الجديدة
    serverExternalPackages: ['@prisma/client'],
  },
  
  // تمكين ضغط Swc
  swcMinify: true,
}

module.exports = nextConfig