const API_BASE = import.meta.env.WP_API_BASE_URL + '/wp-json/wp/v2';

export const CATEGORY_IDS = {
  COURSE: 3,
  NEWS: 4,
  ARTICLE: 5,
} as const;

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
  };
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
}

export interface GetPostsParams {
  per_page?: number;
  page?: number;
  _embed?: boolean;
  orderby?: string;
  order?: 'asc' | 'desc';
}

export async function getPosts(params: GetPostsParams = {}): Promise<WPPost[]> {
  const query = new URLSearchParams({
    per_page: String(params.per_page ?? 10),
    page: String(params.page ?? 1),
    orderby: params.orderby ?? 'date',
    order: params.order ?? 'desc',
    ...(params._embed !== false ? { _embed: '1' } : {}),
  });
  try {
    const res = await fetch(`${API_BASE}/posts?${query}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(`${API_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
    if (!res.ok) return null;
    const posts: WPPost[] = await res.json();
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  try {
    const res = await fetch(`${API_BASE}/pages?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const pages: WPPage[] = await res.json();
    return pages[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPostsByCategory(
  categoryId: number,
  params: GetPostsParams = {}
): Promise<WPPost[]> {
  const query = new URLSearchParams({
    categories: String(categoryId),
    per_page: String(params.per_page ?? 10),
    page: String(params.page ?? 1),
    orderby: params.orderby ?? 'date',
    order: params.order ?? 'desc',
    ...(params._embed !== false ? { _embed: '1' } : {}),
  });
  try {
    const res = await fetch(`${API_BASE}/posts?${query}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
