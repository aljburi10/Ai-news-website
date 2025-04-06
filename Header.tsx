'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // مراقبة التمرير لإضافة تأثيرات بصرية للرأس
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // تبديل حالة قائمة الجوال
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* شعار الموقع */}
          <Link href="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-indigo-600">أخبار الذكاء الاصطناعي</span>
          </Link>
          
          {/* القائمة الرئيسية (للشاشات الكبيرة) */}
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
            <Link href="/" className="text-gray-800 hover:text-indigo-600 font-medium">
              الرئيسية
            </Link>
            <Link href="/#categories" className="text-gray-800 hover:text-indigo-600 font-medium">
              التصنيفات
            </Link>
            <Link href="/about" className="text-gray-800 hover:text-indigo-600 font-medium">
              من نحن
            </Link>
            <Link href="/contact" className="text-gray-800 hover:text-indigo-600 font-medium">
              اتصل بنا
            </Link>
          </nav>
          
          {/* زر البحث والقائمة (للشاشات الكبيرة) */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition"
              aria-label="بحث"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* زر القائمة المتنقلة (للهواتف) */}
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* القائمة المتنقلة (للهواتف) */}
        <div 
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-60 mt-4' : 'max-h-0 mt-0'
          }`}
        >
          <nav className="flex flex-col space-y-4 pb-4">
            <Link 
              href="/" 
              className="text-gray-800 hover:text-indigo-600 font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link 
              href="/#categories" 
              className="text-gray-800 hover:text-indigo-600 font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              التصنيفات
            </Link>
            <Link 
              href="/about" 
              className="text-gray-800 hover:text-indigo-600 font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              من نحن
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-800 hover:text-indigo-600 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              اتصل بنا
            </Link>
            
            {/* زر البحث (للهواتف) */}
            <div className="pt-2">
              <button 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>بحث</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}