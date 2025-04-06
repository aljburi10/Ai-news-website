// واجهات قاعدة البيانات D1 
export interface Env {
  DB: D1Database;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T=unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  dump(): Promise<ArrayBuffer>;
  exec<T=unknown>(query: string): Promise<D1Result<T>>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T=unknown>(colName?: string): Promise<T | null>;
  run<T=unknown>(): Promise<D1Result<T>>;
  all<T=unknown>(): Promise<D1Result<T>>;
  raw<T=unknown>(): Promise<T[]>;
}

export interface D1Result<T=unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: object;
}

// واجهات الوظائف المجدولة
export interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

// نماذج البيانات
export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image_url: string;
  source_id: number;
  category_id: number;
  is_featured: number;
  published_at: string;
  created_at: string;
}

export interface Source {
  id: number;
  name: string;
  url: string;
  feed_url: string;
  is_active: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: number;
  created_at: string;
}