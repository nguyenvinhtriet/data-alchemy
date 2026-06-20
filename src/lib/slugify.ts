/**
 * Slugify any string to URL-safe ASCII kebab-case.
 *
 * Strips Vietnamese (and other Latin-extended) diacritics, lowercases,
 * collapses non-alphanumerics to a single hyphen.
 *
 *   slugify('Tốc độ cực nhanh')  →  'toc-do-cuc-nhanh'
 *   slugify('What is SSG?')      →  'what-is-ssg'
 */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // combining diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
