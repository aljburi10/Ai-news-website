-- قاعدة بيانات موقع أخبار الذكاء الاصطناعي
-- نسخة 1.0

-- جدول التصنيفات
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- جدول المصادر
CREATE TABLE sources (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- جدول الأخبار
CREATE TABLE news (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  summary TEXT,
  image_url TEXT,
  source_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  is_featured INTEGER DEFAULT 0,
  published_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (source_id) REFERENCES sources(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- إضافة بعض البيانات الأولية

-- إضافة التصنيفات
INSERT INTO categories (name, slug) VALUES
  ('أخبار الذكاء الاصطناعي', 'ai-news'),
  ('أبحاث الذكاء الاصطناعي', 'ai-research'),
  ('تطبيقات الذكاء الاصطناعي', 'ai-applications'),
  ('تعلم الآلة', 'machine-learning');

-- إضافة المصادر العربية
INSERT INTO sources (name, url, feed_url) VALUES
  ('عرب نت', 'https://arabnet.me', 'https://arabnet.me/feed/'),
  ('عالم التقنية', 'https://www.tech-wd.com', 'https://www.tech-wd.com/wd/feed/'),
  ('أراجيك تك', 'https://www.arageek.com/tech', 'https://www.arageek.com/tech/feed'),
  ('العربية تك', 'https://www.alarabiya.net/technology', 'https://www.alarabiya.net/technology/feed'),
  ('البوابة التقنية', 'https://aitnews.com', 'https://aitnews.com/feed/');

-- إضافة مصادر عالمية بترجمة آلية
INSERT INTO sources (name, url, feed_url) VALUES
  ('ترجمة TechCrunch', 'https://techcrunch.com', 'https://techcrunch.com/feed/'),
  ('ترجمة Wired', 'https://www.wired.com', 'https://www.wired.com/feed/rss'),
  ('ترجمة VentureBeat', 'https://venturebeat.com', 'https://venturebeat.com/feed/'),
  ('ترجمة OpenAI بلوغ', 'https://openai.com/blog', 'https://openai.com/blog/rss.xml'),
  ('ترجمة Google AI بلوغ', 'https://blog.google/technology/ai/', 'https://blog.google/technology/ai/rss/');
