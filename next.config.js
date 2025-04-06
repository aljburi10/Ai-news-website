/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // استيراد ملفات التطبيق من مجلد src
  experimental: {
    outputFileTracingRoot: './',
  },
  
  // تحسينات الصور
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig