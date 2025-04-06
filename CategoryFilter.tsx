'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: number
  name: string
  slug: string
  is_active: number
}

export default function CategoryFilter() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // جلب التصنيفات وتحديد التصنيف النشط من معلمات URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    setActiveCategory(categoryParam);
    
    fetchCategories();
  }, [searchParams]);
  
  // التعامل مع النقر على تصنيف
  function handleCategoryClick(slug: string | null) {
    // إذا تم النقر على التصنيف النشط، قم بإلغاء تحديده
    if (slug === activeCategory) {
      slug = null;
    }
    
    // تحديث حالة التصنيف النشط
    setActiveCategory(slug);
    
    // إرسال حدث تغيير التصنيف
    const categoryChangeEvent = new CustomEvent('categoryChange', {
      detail: { categorySlug: slug }
    });
    window.dispatchEvent(categoryChangeEvent);
    
    // تحديث URL
    if (slug) {
      router.push(`/?category=${slug}`);
    } else {
      router.push('/');
    }
  }
  
  // جلب التصنيفات من الـ API
  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('فشل في جلب التصنيفات');
      }
      
      const data = await response.json();
      setCategories(data.filter((cat: Category) => cat.is_active === 1));
      
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }
  
  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="my-8">
        <div className="flex flex-wrap gap-2 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // إذا لم تكن هناك تصنيفات نشطة
  if (categories.length === 0) {
    return null;
  }
  
  return (
    <div className="my-8">
      <div className="flex flex-wrap gap-2">
        {/* زر "الكل" */}
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === null
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          الكل
        </button>
        
        {/* أزرار التصنيفات */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.slug
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}