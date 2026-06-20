import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Lang, translations } from '../i18n';
import type { Post } from '../types';

type T = (typeof translations)[Lang];

interface PrevNextNavProps {
  /** All posts, expected to be sorted by date DESC (matches `getAllPosts()` output). */
  posts: Post[];
  current: Post;
  lang: Lang;
  t: T;
  onSelect: (post: Post) => void;
}

/**
 * "Newer" / "Older" navigation at the foot of a post.
 *
 * Posts list is date-DESC, so the post BEFORE current in the array is newer
 * and the post AFTER is older. Edges render an empty slot to preserve layout.
 */
export function PrevNextNav({ posts, current, lang, t, onSelect }: PrevNextNavProps) {
  const idx = posts.findIndex((p) => p.slug === current.slug);
  if (idx === -1) return null;

  const newer = idx > 0 ? posts[idx - 1] : null;
  const older = idx < posts.length - 1 ? posts[idx + 1] : null;

  if (!newer && !older) return null;

  const title = (p: Post) => (lang === 'vi' ? p.title : p.title_en);

  return (
    <nav
      aria-label="Post navigation"
      className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {newer ? (
        <button
          onClick={() => onSelect(newer)}
          className="group text-left p-5 md:p-6 rounded-2xl border border-black/5 hover:border-orange-200 hover:bg-orange-50/40 transition-all"
        >
          <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600 mb-2">
            <ArrowLeft className="w-3 h-3" />
            {t.newerPost}
          </div>
          <div className="font-bold leading-snug line-clamp-2 group-hover:text-orange-700 transition-colors">
            {title(newer)}
          </div>
        </button>
      ) : (
        <div aria-hidden="true" />
      )}

      {older ? (
        <button
          onClick={() => onSelect(older)}
          className="group text-left md:text-right p-5 md:p-6 rounded-2xl border border-black/5 hover:border-orange-200 hover:bg-orange-50/40 transition-all"
        >
          <div className="flex items-center md:justify-end gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600 mb-2">
            {t.olderPost}
            <ArrowRight className="w-3 h-3" />
          </div>
          <div className="font-bold leading-snug line-clamp-2 group-hover:text-orange-700 transition-colors">
            {title(older)}
          </div>
        </button>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}
