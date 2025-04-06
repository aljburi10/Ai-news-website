// next.config.mjs
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعلام Next.js بأن التطبيق في مجلد src
  experimental: {
    externalDir: true
  },
  
  // تحديد مكان مجلد التطبيق
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, 'src'),
    };
    return config;
  }
};

export default nextConfig;
