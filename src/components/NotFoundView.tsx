import { motion } from 'motion/react';
import { ArrowLeft, Clock } from 'lucide-react';
import type { Lang, translations } from '../i18n';
import type { Post } from '../types';

type T = (typeof translations)[Lang];

interface NotFoundViewProps {
  /** Up to 4 recent posts to suggest. */
  recentPosts: Post[];
  lang: Lang;
  t: T;
  onGoHome: () => void;
  onSelectPost: (post: Post) => void;
}

/**
 * Custom 404 view. Renders when no route matches.
 *
 * Better than a blanket redirect — gives readers a sense of "you're on a
 * real page that happens to be empty" and offers next steps (home button +
 * recent posts list) instead of a silent jump.
 */
export function NotFoundView({
  recentPosts,
  lang,
  t,
  onGoHome,
  onSelectPost,
}: NotFoundViewProps) {
  return (
    <motion.div
      key="not-found"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <header className="mb-10 md:mb-14">
        {/* Off-balance "404" — large, slightly muted, asymmetric. */}
        <div className="text-[100px] md:text-[160px] leading-none font-bold text-black/[0.08] tracking-tighter select-none">
          404
        </div>
        <h1 className="text-3xl md:text-6xl font-bold leading-tight mt-2 md:-mt-8">
          {t.notFoundTitle}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-black/60 max-w-2xl font-sans leading-relaxed">
          {t.notFoundDesc}
        </p>
        <button
          onClick={onGoHome}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-sans font-bold rounded-full transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backHome}
        </button>
      </header>

      {recentPosts.length > 0 && (
        <section
          aria-labelledby="recent-heading"
          className="pt-10 md:pt-12 border-t border-black/5"
        >
          <h2
            id="recent-heading"
            className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3"
          >
            <Clock className="w-5 h-5 text-orange-500" />
            {t.latest}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentPosts.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <button
                  onClick={() => onSelectPost(p)}
                  className="group w-full text-left p-4 rounded-2xl hover:bg-black/[0.03] transition-colors"
                >
                  <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600 mb-1">
                    {lang === 'vi' ? p.category : p.category_en}
                  </div>
                  <h3 className="font-bold leading-snug line-clamp-2 group-hover:text-orange-700 transition-colors">
                    {lang === 'vi' ? p.title : p.title_en}
                  </h3>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </motion.div>
  );
}
