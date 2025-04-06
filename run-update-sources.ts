import { updateSources, listSources } from './update-sources';
import { getWranglerConfig } from '../utils/wrangler-config';

// هذا الملف يستخدم للتشغيل من سطر الأوامر

async function main() {
  try {
    // إنشاء البيئة مع الوصول إلى قاعدة البيانات
    const { env } = await getWranglerConfig();
    
    // تشغيل وظيفة تحديث المصادر
    await updateSources(env);
    
    // عرض جميع المصادر بعد التحديث
    await listSources(env);
    
    console.log('اكتمل تحديث المصادر بنجاح!');
  } catch (error) {
    console.error('فشل تحديث المصادر:', error);
    process.exit(1);
  }
}

main();