/**
 * Generate `dist/rss.xml` (Vietnamese) and `dist/rss.en.xml` (English).
 * Run after `vite build`.
 *
 * RSS 2.0 with the standard `atom:link rel="self"` for self-reference.
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { SITE_CONFIG, siteUrl } from './lib/site-config.mjs';
import { loadAllPosts } from './lib/load-posts.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const MAX_ITEMS = 30;

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c],
  );
}

function rfc822(d) {
  // RSS 2.0 wants RFC-822 dates. Date is YYYY-MM-DD; assume midnight UTC.
  const date = new Date(d);
  return date.toUTCString();
}

function buildFeed({ lang, title, description, posts, feedUrl }) {
  const items = posts
    .slice(0, MAX_ITEMS)
    .map((p) => {
      const link = siteUrl(`/posts/${p.slug}`);
      const t = lang === 'en' ? p.title_en : p.title;
      const d = lang === 'en' ? p.excerpt_en : p.excerpt;
      const cats = (lang === 'en' ? p.tags_en : p.tags) || [];
      return [
        '    <item>',
        `      <title>${escapeXml(t)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${rfc822(p.date)}</pubDate>`,
        `      <description>${escapeXml(d)}</description>`,
        ...cats.map((c) => `      <category>${escapeXml(c)}</category>`),
        SITE_CONFIG.author ? `      <author>${escapeXml(SITE_CONFIG.author)}</author>` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(siteUrl('/'))}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${lang === 'en' ? 'en' : 'vi'}</language>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

function generate() {
  if (!existsSync(DIST)) {
    mkdirSync(DIST, { recursive: true });
  }

  const posts = loadAllPosts();

  const viXml = buildFeed({
    lang: 'vi',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    posts,
    feedUrl: siteUrl('/rss.xml'),
  });

  const enXml = buildFeed({
    lang: 'en',
    title: SITE_CONFIG.titleEn,
    description: SITE_CONFIG.descriptionEn,
    posts,
    feedUrl: siteUrl('/rss.en.xml'),
  });

  writeFileSync(join(DIST, 'rss.xml'), viXml, 'utf8');
  writeFileSync(join(DIST, 'rss.en.xml'), enXml, 'utf8');
  console.log(`[rss] wrote dist/rss.xml + dist/rss.en.xml (${Math.min(posts.length, MAX_ITEMS)} items each)`);
}

generate();
