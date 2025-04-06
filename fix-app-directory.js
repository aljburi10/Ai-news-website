// fix-app-directory.js
const fs = require('fs');
const path = require('path');

// التحقق من وجود مجلد app في المستوى الرئيسي
if (!fs.existsSync(path.join(__dirname, 'app'))) {
  // إنشاء مجلد app إذا لم يكن موجوداً
  fs.mkdirSync(path.join(__dirname, 'app'), { recursive: true });
  
  // نسخ محتويات src/app إلى app
  if (fs.existsSync(path.join(__dirname, 'src/app'))) {
    // قراءة جميع الملفات والمجلدات في src/app
    const srcAppContents = fs.readdirSync(path.join(__dirname, 'src/app'));
    
    // نسخ كل عنصر إلى المجلد الرئيسي app
    srcAppContents.forEach(item => {
      const srcPath = path.join(__dirname, 'src/app', item);
      const destPath = path.join(__dirname, 'app', item);
      
      if (fs.lstatSync(srcPath).isDirectory()) {
        // نسخ المجلد بشكل متكرر
        fs.mkdirSync(destPath, { recursive: true });
        const items = fs.readdirSync(srcPath);
        items.forEach(subItem => {
          const subSrcPath = path.join(srcPath, subItem);
          const subDestPath = path.join(destPath, subItem);
          
          if (fs.lstatSync(subSrcPath).isDirectory()) {
            // إذا كان مجلد فرعي، قم بإنشائه
            fs.mkdirSync(subDestPath, { recursive: true });
            // ثم انسخ ملفاته بشكل متكرر (يمكن تحسين هذا لاحقاً للمجلدات العميقة)
            const subItems = fs.readdirSync(subSrcPath);
            subItems.forEach(subSubItem => {
              const finalSrcPath = path.join(subSrcPath, subSubItem);
              const finalDestPath = path.join(subDestPath, subSubItem);
              if (!fs.lstatSync(finalSrcPath).isDirectory()) {
                fs.copyFileSync(finalSrcPath, finalDestPath);
              }
            });
          } else {
            // نسخ الملف
            fs.copyFileSync(subSrcPath, subDestPath);
          }
        });
      } else {
        // نسخ الملف
        fs.copyFileSync(srcPath, destPath);
      }
    });
    
    console.log('تم نسخ محتويات src/app إلى مجلد app في المستوى الرئيسي');
  } else {
    console.error('مجلد src/app غير موجود!');
    process.exit(1);
  }
}

console.log('مجلد app جاهز للاستخدام');
