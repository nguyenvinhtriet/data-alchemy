/**
 * Deterministic per-post thumbnails.
 *
 * Hash the post slug to pick one of N curated palettes — every post gets
 * the same gradient every time (great for branding + recognizability),
 * but different posts visually differ. No network dependency, no random
 * stock-image weirdness. The orange brand accent is always palette[0]
 * for the first hash bucket so prominent posts stay on-brand.
 */

/** Stable string hash (djb2-style). Same slug → same number forever. */
function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) + h + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Curated 2-color gradients. Each pair is `[strong, soft]`. Designed to
 * harmonize with the cream background and orange brand accent.
 *
 * Order matters: index 0 is the brand-orange palette, hit most often by
 * the hash distribution for short slugs.
 */
const PALETTES: ReadonlyArray<readonly [string, string]> = [
  ['#ff6b35', '#ffd9c4'], // brand orange
  ['#e76f51', '#fbd9ce'], // coral
  ['#f4a261', '#ffe5d0'], // peach
  ['#e9c46a', '#fff2cd'], // mustard
  ['#2a9d8f', '#d3eae6'], // sage
  ['#264653', '#cad7da'], // teal slate
] as const;

export function paletteForSlug(slug: string): readonly [string, string] {
  return PALETTES[hashSlug(slug) % PALETTES.length];
}

/** Short uppercase label for the thumbnail watermark, max 2 chars. */
export function thumbnailLabel(title: string, slug: string): string {
  const source = (title || slug).trim();
  if (!source) return '·';
  // Strip diacritics so 'Đ' / 'Ô' / etc. render in ASCII-clean form.
  const stripped = source.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return stripped[0].toUpperCase();
}
