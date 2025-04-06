import { NextRequest, NextResponse } from 'next/server';
import { Env } from '../../../types';

export async function GET(request: Request, { env }: { env: Env }) {
  try {
    // استخراج معلمات البحث
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category');
    
    // حساب الإزاحة
    const offset = (page - 1) * limit;
    
    // بناء استعلام SQL الأساسي
    let query = `
      SELECT 
        n.id, n.title, n.slug, n.summary, n.image_url, 
        s.name as source_name, c.name as category_name, n.published_at
      FROM news n
      JOIN sources s ON n.source_id = s.id
      JOIN categories c ON n.category_id = c.id
    `;
    
    // إضافة شرط التصنيف إذا كان موجودًا
    const params: any[] = [];
    if (category) {
      query += ` WHERE c.slug = ?`;
      params.push(category);
    }
    
    // إضافة ترتيب وحدود
    query += `
      ORDER BY n.published_at DESC
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);
    
    // تنفيذ الاستعلام
    const stmt = env.DB.prepare(query);
    stmt.bind(...params);
    const result = await stmt.all();
    
    // حساب إجمالي عدد العناصر للصفحات
    let countQuery = `
      SELECT COUNT(*) as total FROM news n
      JOIN categories c ON n.category_id = c.id
    `;
    
    if (category) {
      countQuery += ` WHERE c.slug = ?`;
    }
    
    const countStmt = env.DB.prepare(countQuery);
    if (category) {
      countStmt.bind(category);
    }
    const countResult = await countStmt.first();
    const total = countResult ? (countResult as any).total : 0;
    
    // حساب معلومات الصفحات
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    
    // إعداد الرد
    return NextResponse.json({
      data: result.results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الأخبار' },
      { status: 500 }
    );
  }
}
