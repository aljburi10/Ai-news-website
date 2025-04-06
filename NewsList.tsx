'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NewsCard from './NewsCard';
import AdBanner from '../ads/AdBanner';

interface NewsItem {
  id: number
  title: string
  slug: string
  summary: string
  image_url: string
  source_name: string
  category_name: string
  published_at: string
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  
  // الاستماع لتغييرات معلمات URL (تغيير التصنيف)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    
    // إذا تغير التصنيف، أعد تعيين القائمة
    if (categoryParam !== activeCategorySlug) {
      setNews([]);
      setPage(1);
      setHasMore(true);
      setActiveCategorySlug(categoryParam);
      
      // جلب الأخبار بالتصنيف الجديد
      fetchNews(categoryParam, 1);
    }
  }, [searchParams]);
  
  // الاستماع لأحداث تغيير التصنيف
  useEffect(() => {
    // إنشاء EventTarget و CustomEvent
    const handleCategoryChange = (e: CustomEvent) => {
      const { categorySlug } = e.detail;
      setActiveCategorySlug(categorySlug);
      setNews([]);
      setPage(1);
      setHasMore(true);
      fetchNews(categorySlug, 1);
    };
    
    // إضافة EventListener
    window.addEventListener('categoryChange' as any, handleCategoryChange as any);
    
    // تنظيف EventListener عند unmount
    return () => {
      window.removeEventListener('categoryChange' as any, handleCategoryChange as any);
    };
  }, []);
  
  // جلب الأخبار من الـ API
  async function fetchNews(categorySlug: string | null, pageNum: number) {
    try {
      setLoading(true);
      
      // بناء URL مع معلمات البحث
      let url = `/api/news?page=${pageNum}&limit=9`;
      if (categorySlug) {
        url += `&category=${categorySlug}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('فشل في جلب الأخبار');
      }
      
      const result = await response.json();
      
      if (pageNum === 1) {
        // أول مرة: استبدل القائمة
        setNews(result.data);
      } else {
        // تحميل المزيد: أضف للقائمة الحالية
        setNews(prev => [...prev, ...result.data]);
      }
      
      // تحديث حالة وجود المزيد
      setHasMore(result.pagination.hasMore);
      
    } catch (error: any) {
      console.error('Error fetching news:', error);
      setError(error.message || 'حدث خطأ أثناء جلب الأخبار');
    } finally {
      setLoading(false);
    }
  }
  
  // تحميل المزيد من الأخبار
  function loadMore() {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(activeCategorySlug, nextPage);
    }
  }
  
  // عرض حالة الخطأ
  if (error && news.length === 0) {
    return (
      <div className="mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">آخر الأخبار</h2>
      
      {/* عرض الأخبار في شبكة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {news.map((item, index) => (
          <>
            <NewsCard key={item.id} news={item} />
            
            {/* إضافة إعلان بعد كل 6 عناصر */}
            {(index + 1) % 6 === 0 && (
              <div key={`ad-${index}`} className="col-span-full my-4">
                <AdBanner slot="1234567890" format="horizontal" />
              </div>
            )}
          </>
        ))}
      </div>
      
      {/* حالة التحميل الأولي */}
      {loading && news.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
          ))}
        </div>
      )}
      
      {/* حالة عدم وجود نتائج */}
      {!loading && news.length === 0 && (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">لا توجد أخبار</h3>
          <p className="text-gray-600">
            لم يتم العثور على أخبار في هذا التصنيف. يرجى تجربة تصنيف آخر.
          </p>
        </div>
      )}
      
      {/* زر تحميل المزيد */}
      {news.length > 0 && (
        <div className="flex justify-center mt-8">
          {hasMore ? (
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التحميل...
                </span>
              ) : (
                'تحميل المزيد'
              )}
            </button>
          ) : (
            <p className="text-gray-600">لا توجد المزيد من الأخبار للعرض</p>
          )}
        </div>
      )}
    </div>
  );
}