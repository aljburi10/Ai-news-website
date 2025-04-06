import { Env, ScheduledEvent, ExecutionContext, Source } from '../types';
import Parser from 'rss-parser';

// الوظيفة المجدولة التي تعمل كل ساعة لتحديث الأخبار
export async function scheduled(
  event: ScheduledEvent,
  env: Env,
  ctx: ExecutionContext
): Promise<void> {
  console.log(`Starting scheduled news update at ${new Date().toISOString()}`);

  try {
    // الحصول على قائمة المصادر النشطة
    const sourcesStmt = env.DB.prepare(`
      SELECT * FROM sources 
      WHERE is_active = 1
    `);
    
    const sourcesResult = await sourcesStmt.all();
    const sources = sourcesResult.results as Source[];
    
    if (!sources || sources.length === 0) {
      console.log('No active sources found');
      return;
    }
    
    console.log(`Found ${sources.length} active sources to process`);
    
    // إنشاء فاعل محلل RSS
    const parser = new Parser({
      timeout: 10000, // زمن الانتظار: 10 ثواني
      customFields: {
        item: [
          'media:content',
          'media:thumbnail',
          'enclosure',
          'content:encoded',
          'description'
        ]
      }
    });
    
    // معالجة كل مصدر
    const promises = sources.map(source => processSource(source, parser, env));
    await Promise.allSettled(promises);
    
    console.log('Completed scheduled news update');
    
  } catch (error) {
    console.error('Error in scheduled function:', error);
  }
}

// معالجة مصدر واحد
async function processSource(source: Source, parser: Parser, env: Env): Promise<void> {
  try {
    console.log(`Processing source: ${source.name} (${source.feed_url})`);
    
    // تحليل تغذية RSS
    const feed = await parser.parseURL(source.feed_url);
    
    if (!feed.items || feed.items.length === 0) {
      console.log(`No items found for source: ${source.name}`);
      return;
    }
    
    console.log(`Found ${feed.items.length} items for source: ${source.name}`);
    
    // معالجة العناصر على دفعات لتجنب زيادة الضغط على قاعدة البيانات
    const batchSize = 5;
    for (let i = 0; i < feed.items.length; i += batchSize) {
      const batch = feed.items.slice(i, i + batchSize);
      await processBatch(batch, source, env);
    }
    
  } catch (error) {
    console.error(`Error processing source ${source.name}:`, error);
  }
}

// معالجة دفعة من العناصر
async function processBatch(items: any[], source: Source, env: Env): Promise<void> {
  // بناء قائمة بالعمليات
  const promises = items.map(async (item) => {
    try {
      // استخراج البيانات من العنصر
      const title = item.title?.trim();
      const link = item.link?.trim();
      const pubDate = item.pubDate ? new Date(item.isoDate || item.pubDate) : new Date();
      
      // محاولة استخراج الصورة
      let imageUrl = null;
      if (item['media:content'] && item['media:content'].$.url) {
        imageUrl = item['media:content'].$.url;
      } else if (item['media:thumbnail'] && item['media:thumbnail'].$.url) {
        imageUrl = item['media:thumbnail'].$.url;
      } else if (item.enclosure && item.enclosure.url) {
        imageUrl = item.enclosure.url;
      }
      
      // محاولة استخراج المحتوى والملخص
      let content = item['content:encoded'] || item.content || item.description || '';
      let summary = item.summary || item.description || '';
      
      // تنظيف المحتوى من العلامات HTML
      content = content.replace(/<[^>]*>?/gm, ' ').trim();
      summary = summary.replace(/<[^>]*>?/gm, ' ').trim();
      
      // تقصير الملخص إذا كان طويلاً
      if (summary.length > 500) {
        summary = summary.substring(0, 497) + '...';
      }
      
      // التحقق من البيانات الأساسية
      if (!title || !link) {
        console.log(`Skipping item with missing title or link: ${JSON.stringify(item)}`);
        return;
      }
      
      // إنشاء slug للعنوان
      const slug = createSlug(title);
      
      // التحقق مما إذا كان الخبر موجودًا بالفعل
      const checkStmt = env.DB.prepare(`
        SELECT id FROM news 
        WHERE slug = ? OR (source_id = ? AND title = ?)
      `);
      
      checkStmt.bind(slug, source.id, title);
      const existingNews = await checkStmt.first();
      
      if (existingNews) {
        // console.log(`News already exists: ${title}`);
        return;
      }
      
      // اختيار تصنيف مناسب (يمكن تحسين هذه الخوارزمية)
      const categoriesStmt = env.DB.prepare('SELECT id, name FROM categories WHERE is_active = 1');
      const categoriesResult = await categoriesStmt.all();
      const categories = categoriesResult.results || [];
      
      let categoryId = 1; // تصنيف افتراضي
      
      if (categories.length > 0) {
        // اختيار تصنيف بناءً على الكلمات المفتاحية
        const categoryKeywords: Record<number, string[]> = {
          // افتراضياً: تصنيف "أخبار الذكاء الاصطناعي" إذا وجد
          1: ['ذكاء اصطناعي', 'AI', 'GPT', 'تعلم الآلة', 'روبوت', 'chatbot', 'توليد'],
          // تصنيفات أخرى محتملة
          2: ['أبحاث', 'دراسة', 'علمي', 'بحث'],
          3: ['تطبيقات', 'منتج', 'إطلاق', 'خدمة'],
          4: ['تعلم آلة', 'تعلم عميق', 'شبكات عصبية', 'خوارزميات'],
        };
        
        // البحث في العنوان والملخص
        const searchText = `${title} ${summary}`.toLowerCase();
        
        let bestMatchScore = 0;
        let bestMatchCategoryId = 1; // التصنيف الافتراضي
        
        // البحث عن أفضل تطابق
        for (const [id, keywords] of Object.entries(categoryKeywords)) {
          const categoryId = parseInt(id);
          let score = 0;
          
          for (const keyword of keywords) {
            const regex = new RegExp(keyword.toLowerCase(), 'gi');
            const matches = searchText.match(regex);
            if (matches) {
              score += matches.length;
            }
          }
          
          if (score > bestMatchScore) {
            bestMatchScore = score;
            bestMatchCategoryId = categoryId;
          }
        }
        
        categoryId = bestMatchCategoryId;
      }
      
      // إدراج الخبر الجديد
      const insertStmt = env.DB.prepare(`
        INSERT INTO news (
          title, slug, content, summary, image_url, 
          source_id, category_id, is_featured, published_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime(?), datetime('now'))
      `);
      
      insertStmt.bind(
        title,
        slug,
        content,
        summary,
        imageUrl,
        source.id,
        categoryId,
        pubDate.toISOString()
      );
      
      const result = await insertStmt.run();
      
      if (result.success) {
        console.log(`Added new news: ${title}`);
      } else {
        console.error(`Failed to add news: ${title}`, result.error);
      }
      
    } catch (error) {
      console.error('Error processing item:', error);
    }
  });
  
  // انتظار اكتمال جميع العمليات
  await Promise.allSettled(promises);
}

// إنشاء slug من النص
function createSlug(text: string): string {
  // تحويل الأحرف إلى أحرف صغيرة
  let slug = text.toLowerCase();
  
  // استبدال الأحرف غير اللاتينية والعربية بمسافات
  slug = slug.replace(/[^\w\s\u0600-\u06FF]/g, ' ');
  
  // استبدال المسافات المتعددة بمسافة واحدة
  slug = slug.replace(/\s+/g, ' ');
  
  // استبدال المسافات بشرطات
  slug = slug.replace(/\s/g, '-');
  
  // اقتصار الطول إلى 100 حرف
  slug = slug.substring(0, 100);
  
  // إزالة الشرطات من البداية والنهاية
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
}