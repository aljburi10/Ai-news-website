import { Env } from '../types';

// مصادر إخبارية جديدة للإضافة
const newSources = [
  {
    name: 'العربية',
    url: 'https://www.alarabiya.net/technology/ai',
    feed_url: 'https://www.alarabiya.net/tools/rss/technology.xml'
  },
  {
    name: 'بي بي سي العربية',
    url: 'https://www.bbc.com/arabic/topics/cq8nqywy37yt',
    feed_url: 'http://feeds.bbci.co.uk/arabic/scienceandtech/rss.xml'
  },
  {
    name: 'البوابة التقنية',
    url: 'https://aitnews.com',
    feed_url: 'https://aitnews.com/feed/'
  },
  {
    name: 'فوكس نيوز',
    url: 'https://www.foxnews.com/tech',
    feed_url: 'https://moxie.foxnews.com/feedburner/tech.xml'
  },
  {
    name: 'نيويورك تايمز',
    url: 'https://www.nytimes.com/section/technology',
    feed_url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml'
  },
  {
    name: 'سكاي نيوز عربية',
    url: 'https://www.skynewsarabia.com/technology',
    feed_url: 'https://www.skynewsarabia.com/web/rss/85.xml'
  },
  {
    name: 'سي إن إن بالعربية',
    url: 'https://arabic.cnn.com/scitech',
    feed_url: 'https://arabic.cnn.com/scitech/rss'
  },
  {
    name: 'الشرق الأوسط',
    url: 'https://aawsat.com/home/international/section/technology',
    feed_url: 'https://aawsat.com/feed/technology'
  },
  {
    name: 'رويترز عربي',
    url: 'https://www.reuters.com/world/middle-east/',
    feed_url: 'https://www.reuters.com/arc/outboundfeeds/v1/rss/world/middle-east/feed.xml'
  },
  {
    name: 'الجزيرة نت',
    url: 'https://www.aljazeera.net/scienceandtechnology',
    feed_url: 'https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b135-bfdff8b8f9ff'
  }
];

// وظيفة لإضافة المصادر إلى قاعدة البيانات
export async function updateSources(env: Env): Promise<void> {
  try {
    console.log('بدء تحديث مصادر الأخبار...');
    
    // إضافة كل مصدر
    const statements = newSources.map(source => {
      return env.DB.prepare(`
        INSERT OR IGNORE INTO sources (name, url, feed_url, is_active)
        VALUES (?, ?, ?, 1)
      `).bind(
        source.name,
        source.url,
        source.feed_url
      );
    });
    
    // تنفيذ العمليات كحزمة واحدة
    const results = await env.DB.batch(statements);
    
    // عرض نتائج العملية
    let addedCount = 0;
    results.forEach(result => {
      if (result.success && result.meta?.changes > 0) {
        addedCount++;
      }
    });
    
    console.log(`تم إضافة ${addedCount} مصدر جديد بنجاح.`);
    console.log(`تم تجاهل ${results.length - addedCount} مصدر موجود مسبقًا.`);
    
  } catch (error) {
    console.error('حدث خطأ أثناء تحديث المصادر:', error);
    throw error;
  }
}

// وظيفة لعرض جميع المصادر الموجودة في قاعدة البيانات
export async function listSources(env: Env): Promise<void> {
  try {
    const { results: sources } = await env.DB.prepare(
      "SELECT id, name, url, feed_url, is_active FROM sources ORDER BY id"
    ).all();
    
    console.log('==== مصادر الأخبار ====');
    sources.forEach(source => {
      console.log(`- ${source.id}: ${source.name} (${source.is_active ? 'نشط' : 'غير نشط'})`);
      console.log(`  URL: ${source.url}`);
      console.log(`  Feed: ${source.feed_url}`);
      console.log('-------------------');
    });
    console.log(`إجمالي المصادر: ${sources.length}`);
    
  } catch (error) {
    console.error('حدث خطأ أثناء عرض المصادر:', error);
    throw error;
  }
}