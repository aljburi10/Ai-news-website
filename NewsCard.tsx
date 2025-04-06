import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface NewsItem {
  id: number
  title: string
  slug: string
  summary: string
  image_url: string
  source_name: string
  category_name?: string
  published_at: string
}

interface NewsCardProps {
  news: NewsItem
}

export default function NewsCard({ news }: NewsCardProps) {
  // تنسيق التاريخ باستخدام date-fns مع دعم اللغة العربية
  const formattedDate = formatDistanceToNow(new Date(news.published_at), {
    addSuffix: true,
    locale: arSA,
  });
  
  return (
    <div className="news-card bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      {/* صورة الخبر */}
      <div className="relative aspect-video">
        <Image
          src={news.image_url || 'https://placehold.co/400x225?text=أخبار+الذكاء+الاصطناعي'}
          alt={news.title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      <div className="p-4">
        {/* التصنيف (إذا كان موجودًا) */}
        {news.category_name && (
          <Link 
            href={`/?category=${encodeURIComponent(news.category_name)}`}
            className="inline-block bg-indigo-100 text-indigo-800 text-xs rounded px-2 py-1 mb-2"
          >
            {news.category_name}
          </Link>
        )}
        
        {/* عنوان الخبر */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-indigo-600">
          <Link href={`/news/${news.slug}`}>
            {news.title}
          </Link>
        </h3>
        
        {/* ملخص الخبر */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {news.summary}
        </p>
        
        {/* معلومات إضافية وزر القراءة */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <span>{news.source_name}</span>
            <span className="mx-1">•</span>
            <span>{formattedDate}</span>
          </div>
          
          <Link
            href={`/news/${news.slug}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            اقرأ المزيد
          </Link>
        </div>
      </div>
    </div>
  );
}