import { paletteForSlug, thumbnailLabel } from '../lib/post-image';

interface PostThumbnailProps {
  /** Stable identifier — drives the deterministic palette pick. */
  slug: string;
  /** Title (or any text) — the first character becomes the watermark. */
  title: string;
  /** Tailwind classes for the outer box (controls size + radius). */
  className?: string;
  /** Accessible label — set to '' for purely decorative thumbnails. */
  alt?: string;
}

/**
 * Pure-CSS branded thumbnail. Replaces the previous `picsum.photos` images.
 *
 * Renders a diagonal gradient picked from a small palette via slug hash,
 * with the post's first letter as a giant translucent watermark and a thin
 * inner-ring for edge definition. No network round-trip — instant paint.
 *
 * Pass `className` to size it (e.g. `w-48 h-48 rounded-2xl`); the outer
 * box gets `overflow-hidden` so the watermark gets clipped to the radius.
 */
export function PostThumbnail({ slug, title, className = '', alt = '' }: PostThumbnailProps) {
  const [strong, soft] = paletteForSlug(slug);
  const letter = thumbnailLabel(title, slug);

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${strong} 0%, ${soft} 100%)`,
      }}
    >
      {/* Soft top-left radial highlight for depth. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 25% 20%, rgba(255, 255, 255, 0.28) 0%, transparent 55%)`,
        }}
      />
      {/* Giant watermark letter. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-bold text-white/35 select-none"
        style={{ fontSize: '52%', lineHeight: 1 }}
      >
        {letter}
      </span>
      {/* Inner edge ring for definition over light backgrounds. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[inherit] pointer-events-none"
      />
    </div>
  );
}
