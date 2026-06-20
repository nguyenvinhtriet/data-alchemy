import { motion } from 'motion/react';
import { format } from 'date-fns';
import { vi as viLocale, enUS } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';
import type { Lang, translations } from '../i18n';
import type { Post } from '../types';
import { readingTimeMinutes } from '../lib/reading-time';
import { PostThumbnail } from './PostThumbnail';

type T = (typeof translations)[Lang];

interface PostCardProps {
  post: Post;
  /** Stagger animation delay index (0, 1, 2...). 0 if omitted. */
  index?: number;
  lang: Lang;
  t: T;
  onSelect: (post: Post) => void;
}

/**
 * One row in the post list: chip + date + reading time / title / excerpt /
 * tags / "read more" with a deterministic gradient thumbnail on md+
 * (Phase 6 replaced the old picsum.photos remote images).
 */
export function PostCard({ post, index = 0, lang, t, onSelect }: PostCardProps) {
  const dateLocale = lang === 'vi' ? viLocale : enUS;
  const title = lang === 'vi' ? post.title : post.title_en;
  const excerpt = lang === 'vi' ? post.excerpt : post.excerpt_en;
  const category = lang === 'vi' ? post.category : post.category_en;
  const tags = lang === 'vi' ? post.tags : post.tags_en;
  const content = lang === 'vi' ? post.content : post.content_en;
  const readMins = readingTimeMinutes(content);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => onSelect(post)}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex-1 space-y-3 md:space-y-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-xs font-sans uppercase tracking-wider font-bold">
            <span className="px-2 py-0.5 bg-black text-white rounded text-[9px] md:text-[10px]">
              {category}
            </span>
            <span className="text-orange-600">
              {format(new Date(post.date), 'dd MMMM, yyyy', { locale: dateLocale })}
            </span>
            <span className="text-black/20" aria-hidden="true">·</span>
            <span className="text-black/40 tabular-nums normal-case font-medium">
              {readMins} {t.minRead}
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-bold group-hover:text-orange-600 transition-colors leading-snug">
            {title}
          </h2>
          <p className="text-sm md:text-lg text-black/60 leading-relaxed line-clamp-2 md:line-clamp-3">
            {excerpt}
          </p>
          <div className="pt-2 md:pt-4 space-y-3 md:space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-widest text-black/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-sans font-bold group-hover:gap-4 transition-all">
              {t.readMore} <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
        <PostThumbnail
          slug={post.slug}
          title={title}
          alt={title}
          className="hidden md:block w-48 h-48 rounded-2xl shrink-0 group-hover:scale-[1.02] transition-transform duration-500"
        />
      </div>
    </motion.article>
  );
}
