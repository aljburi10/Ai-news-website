/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات مبسطة تتوافق مع Next.js 15
  output: 'standalone',
  distDir: '.next',
  
  // مسار مجلد المصدر - للإشارة إلى أن التطبيق في مجلد src
  transpilePackages: ['src'],
  
  // تمكين الصور
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '**'
    }]
  }
}

module.exports = nextConfig