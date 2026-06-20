/**
 * Generate `dist/sitemap.xml` — one entry per post + the home page.
 * Run after `vite build`.
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { SITE_CONFIG, siteUrl } from './lib/site-config.mjs';
import { loadAllPosts } from './lib/load-posts.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, '..', 'dist');

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c],
  );
}

function urlEntry({ loc, lastmod, changefreq = 'weekly', priority = '0.7' }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

function generate() {
  if (!existsSync(DIST)) {
    mkdirSync(DIST, { recursive: true });
  }

  const posts = loadAllPosts();
  const today = new Date().toISOString().slice(0, 10);

  const entries = [
    urlEntry({ loc: siteUrl('/'), lastmod: today, changefreq: 'daily', priority: '1.0' }),
    ...posts.map((p) =>
      urlEntry({
        // Single canonical URL per post; the SPA serves both languages from one slug.
        loc: siteUrl(`/posts/${p.slug}`),
        lastmod: p.date || today,
        changefreq: 'monthly',
        priority: '0.8',
      }),
    ),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  const outPath = join(DIST, 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`[sitemap] wrote ${outPath} (${posts.length} posts + 1 home)`);
}

generate();
