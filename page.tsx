'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface Source {
  id: number;
  name: string;
  url: string;
  feed_url: string;
  is_active: number;
}

export default function SourcesAdminPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // نموذج إضافة مصدر جديد
  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    feed_url: '',
    is_active: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  
  // جلب المصادر عند تحميل الصفحة
  useEffect(() => {
    fetchSources();
  }, []);
  
  // دالة جلب المصادر
  async function fetchSources() {
    try {
      setLoading(true);
      const response = await fetch('/api/sources');
      
      if (!response.ok) {
        throw new Error('فشل في جلب المصادر');
      }
      
      const data = await response.json();
      setSources(data);
      
    } catch (error: any) {
      console.error('Error fetching sources:', error);
      setError(error.message || 'حدث خطأ أثناء جلب المصادر');
    } finally {
      setLoading(false);
    }
  }
  
  // دالة تغيير حالة المصدر (نشط/غير نشط)
  async function toggleSourceStatus(id: number, currentStatus: number) {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      
      // تحديث واجهة المستخدم أولاً للاستجابة السريعة
      setSources(prev => 
        prev.map(source => 
          source.id === id 
            ? { ...source, is_active: newStatus } 
            : source
        )
      );
      
      // تحديث قاعدة البيانات
      const response = await fetch(`/api/sources/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: newStatus }),
      });
      
      if (!response.ok) {
        // إعادة الحالة السابقة إذا فشل التحديث
        setSources(prev => 
          prev.map(source => 
            source.id === id 
              ? { ...source, is_active: currentStatus } 
              : source
          )
        );
        throw new Error('فشل في تحديث حالة المصدر');
      }
      
    } catch (error: any) {
      console.error('Error updating source status:', error);
      setSubmitError(error.message || 'حدث خطأ أثناء تحديث حالة المصدر');
      setTimeout(() => setSubmitError(null), 5000);
    }
  }
  
  // دالة معالجة النموذج لإضافة مصدر جديد
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      
      // التحقق من البيانات
      if (!newSource.name || !newSource.url || !newSource.feed_url) {
        setSubmitError('جميع الحقول مطلوبة');
        return;
      }
      
      // إرسال البيانات
      const response = await fetch('/api/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSource),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إضافة المصدر');
      }
      
      // إعادة تعيين النموذج
      setNewSource({
        name: '',
        url: '',
        feed_url: '',
        is_active: 1
      });
      
      // عرض رسالة نجاح
      setSubmitSuccess('تمت إضافة المصدر بنجاح');
      setTimeout(() => setSubmitSuccess(null), 5000);
      
      // إعادة تحميل المصادر
      fetchSources();
      
    } catch (error: any) {
      console.error('Error adding source:', error);
      setSubmitError(error.message || 'حدث خطأ أثناء إضافة المصدر');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // دالة تحديث حقول النموذج
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewSource(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };
  
  // عرض حالة التحميل
  if (loading && sources.length === 0) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">إدارة المصادر</h1>
            <Link 
              href="/admin"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              العودة للوحة التحكم
            </Link>
          </div>
          
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">إدارة المصادر</h1>
            <Link 
              href="/admin"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              العودة للوحة التحكم
            </Link>
          </div>
          
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          
          <button
            onClick={() => fetchSources()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">إدارة المصادر</h1>
          <Link 
            href="/admin"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
          >
            العودة للوحة التحكم
          </Link>
        </div>
        
        {/* نموذج إضافة مصدر جديد */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">إضافة مصدر جديد</h2>
          
          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submitError}
            </div>
          )}
          
          {submitSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {submitSuccess}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المصدر
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newSource.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  رابط الموقع
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={newSource.url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="feed_url" className="block text-sm font-medium text-gray-700 mb-1">
                رابط RSS Feed
              </label>
              <input
                type="url"
                id="feed_url"
                name="feed_url"
                value={newSource.feed_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                مثال: https://example.com/feed/ أو https://example.com/rss.xml
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={newSource.is_active === 1}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="mr-2 block text-sm text-gray-700">
                نشط (سيتم جلب الأخبار من هذا المصدر)
              </label>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإضافة...
                  </span>
                ) : (
                  'إضافة المصدر'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* جدول المصادر */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المصدر
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رابط الموقع
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رابط RSS
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sources.map(source => (
                  <tr key={source.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{source.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-900 hover:underline">
                        {source.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={source.feed_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-900 hover:underline">
                        {source.feed_url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          source.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {source.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleSourceStatus(source.id, source.is_active)}
                        className={`mr-2 px-3 py-1 text-xs rounded-md ${
                          source.is_active 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {source.is_active ? 'تعطيل' : 'تفعيل'}
                      </button>
                      <button
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                      >
                        تحرير
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* رسالة إذا لم تكن هناك مصادر */}
          {sources.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">لا توجد مصادر بعد. أضف المصدر الأول باستخدام النموذج أعلاه.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
