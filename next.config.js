/** @type {import('next').NextConfig} */
const nextConfig = {
  // تمكين الصور من المواقع الخارجية
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // تعطيل تحسين الخطوط التلقائي لاستخدام الخطوط العربية المخصصة
  optimizeFonts: false,
  // تعطيل البرمجيات المضمنة (ضروري لبعض الميزات)
  swcMinify: true,
  // شفرة الدالة التي تتحقق من تاريخ تعديل الصفحة للتحديث
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['rss-parser'],
  },
  // تكوين Webpack لمعالجة الحقول الخاصة
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;