'use client';
import { useEffect, useRef } from 'react';

// تعريف الواجهة للنافذة لإضافة خاصية adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  slot: string
  format: 'horizontal' | 'vertical' | 'rectangle'
  className?: string
}

export default function AdBanner({ slot, format, className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    try {
      // التحقق مما إذا كان adsbygoogle موجودًا
      if (window.adsbygoogle && adRef.current) {
        // تهيئة الإعلان
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error initializing ad:', error);
    }
  }, []);
  
  // تحديد حجم الإعلان بناءً على التنسيق
  function getAdSize(format: 'horizontal' | 'vertical' | 'rectangle') {
    switch (format) {
      case 'horizontal':
        return { width: '100%', height: '90px' };
      case 'vertical':
        return { width: '160px', height: '600px' };
      case 'rectangle':
        return { width: '300px', height: '250px' };
      default:
        return { width: '100%', height: '90px' };
    }
  }
  
  const adSize = getAdSize(format);
  
  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={adSize}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // استبدله بمعرف الناشر الخاص بك
        data-ad-slot={slot}
        data-ad-format={format === 'horizontal' ? 'auto' : 'rectangle'}
        data-full-width-responsive={format === 'horizontal' ? 'true' : 'false'}
      ></ins>
    </div>
  );
}