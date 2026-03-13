export interface Post {
  slug: string;
  title: string;
  title_en: string;
  date: string;
  excerpt: string;
  excerpt_en: string;
  author: string;
  tags: string[];
  tags_en: string[];
  content: string;
  content_en: string;
}

export interface PostMetadata {
  title: string;
  title_en: string;
  date: string;
  excerpt: string;
  excerpt_en: string;
  author: string;
  tags: string[];
  tags_en: string[];
}
