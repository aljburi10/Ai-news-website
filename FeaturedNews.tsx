'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface NewsItem {
  id: number
  title: string
  slug: string
  summary: string
  image_url: string
  source_name: string
  published_at: string
}

export default function FeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // جلب الأخبار المميزة عند تحميل المكون
  useEffect(() => {
    fetchFeaturedNews();
  }, []);
  
  // دالة جلب الأخبار المميزة
  async function fetchFeaturedNews() {
    try {
      setLoading(true);
      const response = await fetch('/api/news/featured');
      
      if (!response.ok) {
        throw new Error('فشل في جلب الأخبار المميزة');
      }
      
      const data = await response.json();
      setFeaturedNews(data);
      
    } catch (error: any) {
      console.error('Error fetching featured news:', error);
      setError(error.message || 'حدث خطأ أثناء جلب الأخبار المميزة');
    } finally {
      setLoading(false);
    }
  }
  
  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="featured-news-skeleton animate-pulse mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="bg-gray-200 rounded-lg h-96"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }
  
  // عرض إذا لم تكن هناك أخبار مميزة
  if (featuredNews.length === 0) {
    return null;
  }
  
  // الخبر الأول (الأهم)
  const mainFeatured = featuredNews[0];
  
  // باقي الأخبار المميزة (3 على الأكثر)
  const otherFeatured = featuredNews.slice(1, 4);
  
  return (
    <div className="featured-news mb-10">
      <h2 className="text-2xl font-bold mb-6">الأخبار المميزة</h2>
      
      {/* العرض الرئيسي */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
        {/* الخبر الرئيسي */}
        <div className="relative overflow-hidden rounded-lg shadow-lg h-96">
          <Image
            src={mainFeatured.image_url || 'https://placehold.co/800x600?text=أخبار+الذكاء+الاصطناعي'}
            alt={mainFeatured.title}
            fill
            style={{
              objectFit: 'cover',
            }}
            className="transition-transform duration-500 hover:scale-105"
          />
          
          {/* تراكب النص */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="absolute bottom-0 p-6 text-white">
              <div className="flex items-center text-sm opacity-90 mb-2">
                <span>{mainFeatured.source_name}</span>
                <span className="mx-2">•</span>
                <span>
                  {formatDistanceToNow(new Date(mainFeatured.published_at), {
                    addSuffix: true,
                    locale: arSA,
                  })}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                <Link 
                  href={`/news/${mainFeatured.slug}`} 
                  className="hover:text-indigo-300 transition"
                >
                  {mainFeatured.title}
                </Link>
              </h3>
              
              <p className="opacity-90 line-clamp-2 mb-4">{mainFeatured.summary}</p>
              
              <Link
                href={`/news/${mainFeatured.slug}`}
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
              >
                اقرأ المزيد
              </Link>
            </div>
          </div>
        </div>
        
        {/* قائمة الأخبار المميزة الأخرى */}
        <div className="space-y-4">
          {otherFeatured.map((news) => (
            <div key={news.id} className="featured-item grid grid-cols-3 gap-3 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-24 col-span-1">
                <Image
                  src={news.image_url || 'https://placehold.co/300x200?text=أخبار+الذكاء+الاصطناعي'}
                  alt={news.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <div className="p-3 col-span-2">
                <h4 className="font-semibold text-base line-clamp-2 mb-1">
                  <Link href={`/news/${news.slug}`} className="hover:text-indigo-600">
                    {news.title}
                  </Link>
                </h4>
                
                <div className="flex items-center text-xs text-gray-500">
                  <span>{news.source_name}</span>
                  <span className="mx-1">•</span>
                  <span>
                    {formatDistanceToNow(new Date(news.published_at), {
                      addSuffix: true,
                      locale: arSA,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}