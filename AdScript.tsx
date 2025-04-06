'use client';
import { useEffect } from 'react';

export default function AdScript() {
  useEffect(() => {
    try {
      // إضافة نص برمجي خارجي من Google AdSense
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.adClient = 'ca-pub-XXXXXXXXXXXXXXXX'; // استبدله بمعرف الناشر الخاص بك
      
      document.head.appendChild(script);
      
      return () => {
        // تنظيف عند إلغاء تحميل المكون
        document.head.removeChild(script);
      };
    } catch (error) {
      console.error('Error loading AdSense script:', error);
    }
  }, []);
  
  // هذا المكون لا يظهر أي شيء في واجهة المستخدم
  return null;
}