// fix-app-directory.js
const fs = require('fs');
const path = require('path');

// التحقق من وجود مجلد app في المستوى الرئيسي
if (!fs.existsSync(path.join(__dirname, 'app'))) {
  console.log('مجلد app غير موجود. سيتم إنشاؤه ونسخ المحتوى من src/app');
  
  // إنشاء مجلد app إذا لم يكن موجوداً
  fs.mkdirSync(path.join(__dirname, 'app'), { recursive: true });
  
  // نسخ محتويات src/app إلى app
  if (fs.existsSync(path.join(__dirname, 'src/app'))) {
    // وظيفة لنسخ مجلد بشكل متكرر
    function copyFolderRecursiveSync(source, target) {
      // إنشاء المجلد الهدف إذا لم يكن موجوداً
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
      }
      
      // قراءة محتويات المجلد المصدر
      const items = fs.readdirSync(source);
      
      // نسخ كل عنصر
      items.forEach(item => {
        const sourcePath = path.join(source, item);
        const targetPath = path.join(target, item);
        
        // التحقق إذا كان العنصر مجلد
        if (fs.lstatSync(sourcePath).isDirectory()) {
          // نسخ المجلد بشكل متكرر
          copyFolderRecursiveSync(sourcePath, targetPath);
        } else {
          // نسخ الملف
          fs.copyFileSync(sourcePath, targetPath);
        }
      });
    }
    
    // بدء عملية النسخ
    copyFolderRecursiveSync(path.join(__dirname, 'src/app'), path.join(__dirname, 'app'));
    console.log('تم نسخ محتويات src/app إلى مجلد app في المستوى الرئيسي');
  } else {
    console.error('مجلد src/app غير موجود!');
    process.exit(1);
  }
} else {
  console.log('مجلد app موجود بالفعل');
}

console.log('مجلد app جاهز للاستخدام');