/**
 * Site-wide configuration. Single source of truth for URLs, titles,
 * descriptions used by sitemap, RSS, and meta-tag generators.
 *
 * Edit these values to match your site, then run:
 *   npm run build
 *
 * The values flow into:
 *   - dist/sitemap.xml
 *   - dist/rss.xml + dist/rss.en.xml
 *   - public/robots.txt (read at build time, not regenerated)
 */
export const SITE_CONFIG = {
  /** Production URL of the site, INCLUDING the base path, no trailing slash. */
  url: 'https://trietnv.github.io/data-alchemy',
  /** Vite base path (must match `base` in vite.config.ts). Kept for documentation. */
  basePath: '/data-alchemy',
  /** Site title (used in RSS channel + OG tags). */
  title: 'Data Alchemy',
  titleEn: 'Data Alchemy',
  /** Short description, shown in RSS + OG. */
  description: 'Một blog cá nhân về web, dữ liệu và kỹ thuật.',
  descriptionEn: 'A personal blog on web, data, and engineering.',
  /** Author name. */
  author: 'Triet',
  /** Author email (RSS spec wants this format). Use null if you prefer not to expose it. */
  authorEmail: null,
  /** Default OG/Twitter image, served from the site root (after basePath). */
  defaultOgImage: '/og-default.png',
  /** Default language (used by sitemap hreflang and RSS). */
  defaultLang: 'vi',
};

/**
 * Build a fully-qualified URL by joining the site URL + extra path.
 * `SITE_CONFIG.url` is expected to already include the base path
 * (e.g. `https://user.github.io/repo`).
 */
export function siteUrl(extra = '') {
  const base = SITE_CONFIG.url.replace(/\/$/, '');
  if (!extra || extra === '/') return base + '/';
  return base + (extra.startsWith('/') ? extra : '/' + extra);
}
