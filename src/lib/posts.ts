import matter from 'gray-matter';
import { Post, PostMetadata } from '../types';

// In a real Vite environment, we can use import.meta.glob to get all markdown files
// This works at build time and dev time.
const postFiles = import.meta.glob('/content/posts/**/*.md', { as: 'raw', eager: true });

export async function getAllPosts(): Promise<Post[]> {
  const posts: Post[] = Object.entries(postFiles).map(([path, content]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const { data, content: body } = matter(content as string);
    const metadata = data as PostMetadata;

    const [viContent, enContent] = body.split('<!-- en -->');

    return {
      slug,
      ...metadata,
      title_en: metadata.title_en || metadata.title,
      excerpt_en: metadata.excerpt_en || metadata.excerpt,
      tags_en: metadata.tags_en || metadata.tags,
      category: metadata.category || 'Chưa phân loại',
      category_en: metadata.category_en || metadata.category || 'Uncategorized',
      content: viContent.trim(),
      content_en: (enContent || viContent).trim(),
    };
  });

  // Sort posts by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
}
