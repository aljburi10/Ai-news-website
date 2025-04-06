-- إضافة مصادر إخبارية جديدة

-- مصادر عالمية إضافية للأخبار تتعلق بالذكاء الاصطناعي والتكنولوجيا
INSERT OR IGNORE INTO sources (name, url, feed_url) VALUES
  ('العربية', 'https://www.alarabiya.net/technology/ai', 'https://www.alarabiya.net/tools/rss/technology.xml'),
  ('بي بي سي العربية', 'https://www.bbc.com/arabic/topics/cq8nqywy37yt', 'http://feeds.bbci.co.uk/arabic/scienceandtech/rss.xml'),
  ('البوابة التقنية', 'https://aitnews.com', 'https://aitnews.com/feed/'),
  ('فوكس نيوز', 'https://www.foxnews.com/tech', 'https://moxie.foxnews.com/feedburner/tech.xml'),
  ('نيويورك تايمز', 'https://www.nytimes.com/section/technology', 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml'),
  ('سكاي نيوز عربية', 'https://www.skynewsarabia.com/technology', 'https://www.skynewsarabia.com/web/rss/85.xml'),
  ('سي إن إن بالعربية', 'https://arabic.cnn.com/scitech', 'https://arabic.cnn.com/scitech/rss'),
  ('الشرق الأوسط', 'https://aawsat.com/home/international/section/technology', 'https://aawsat.com/feed/technology'),
  ('رويترز عربي', 'https://www.reuters.com/world/middle-east/', 'https://www.reuters.com/arc/outboundfeeds/v1/rss/world/middle-east/feed.xml'),
  ('الجزيرة نت', 'https://www.aljazeera.net/scienceandtechnology', 'https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b135-bfdff8b8f9ff');