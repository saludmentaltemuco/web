export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  author_id?: string | null;
  category?: string | null;
  tags?: string[] | null;
  published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type BlogPostUpdate = Partial<BlogPostInsert>;

export interface BlogPostWithAuthor extends BlogPost {
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  published?: boolean;
}

export const BLOG_CATEGORIES = [
  'Ansiedad y Estrés',
  'Depresión y Estado de Ánimo',
  'Autoestima y Crecimiento',
  'Terapia de Pareja y Vínculos',
  'Infanto-Juvenil y Crianza',
  'Mindfulness y Bienestar',
  'Psiquiatría y Neurociencia',
  'Técnicas y Recursos Terapéuticos',
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];