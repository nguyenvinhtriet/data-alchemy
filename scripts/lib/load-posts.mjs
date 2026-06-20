/**
 * Node-side post loader. Mirrors `src/lib/posts.ts` but uses `fs` instead of
 * `import.meta.glob`, so it works in build-time scripts (sitemap/RSS) where
 * Vite's loader isn't available.
 *
 * Usage:
 *   import { loadAllPosts } from './lib/load-posts.mjs';
 *   const posts = loadAllPosts();
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const CONTENT_ROOT = join(__dirname, '..', '..', 'content', 'posts');

/** Recursively walk a directory and yield absolute paths to .md files. */
function* walkMarkdown(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      yield* walkMarkdown(full);
    } else if (stats.isFile() && entry.endsWith('.md')) {
      yield full;
    }
  }
}

/**
 * Parse one markdown file into a post object compatible with `src/types.ts`.
 * Body is split on `<!-- en -->` into Vietnamese / English halves.
 */
function parsePost(absPath) {
  const raw = readFileSync(absPath, 'utf8');
  const { data, content: body } = matter(raw);
  const slug = basename(absPath, '.md');

  const [viContent, enContent] = body.split('<!-- en -->');

  return {
    slug,
    title: data.title || slug,
    title_en: data.title_en || data.title || slug,
    date: data.date,
    excerpt: data.excerpt || '',
    excerpt_en: data.excerpt_en || data.excerpt || '',
    tags: data.tags || [],
    tags_en: data.tags_en || data.tags || [],
    category: data.category || 'Chưa phân loại',
    category_en: data.category_en || data.category || 'Uncategorized',
    author: data.author || '',
    content: (viContent || '').trim(),
    content_en: (enContent || viContent || '').trim(),
    sourcePath: absPath,
  };
}

/** Load every post and return them sorted by date descending. */
export function loadAllPosts() {
  const posts = [];
  for (const file of walkMarkdown(CONTENT_ROOT)) {
    posts.push(parsePost(file));
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
