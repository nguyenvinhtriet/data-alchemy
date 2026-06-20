import { format } from 'date-fns';
import { vi as viLocale, enUS } from 'date-fns/locale';
import { Clock, BookOpen, Tag } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Lang, translations } from '../i18n';
import type { Post } from '../types';
import { SidebarSectionSkeleton } from './skeletons';

type T = (typeof translations)[Lang];

interface SidebarProps {
  loading: boolean;
  latestPosts: Post[];
  allCategories: string[];
  allTags: string[];
  selectedCategory: string | null;
  /** Current search query — drives the "active" state of tag pills. */
  searchQuery: string;
  lang: Lang;
  t: T;

  onSelectPost: (post: Post) => void;
  onClearCategory: () => void;
  onSelectCategory: (cat: string) => void;
  /** Tag pills toggle the search query — parent decides whether to set or clear. */
  onTagClick: (tag: string) => void;
}

/**
 * Right-rail sidebar with four sections: latest posts, categories, popular
 * tags, and a (currently decorative) newsletter signup. Shows three skeleton
 * placeholders while `loading`.
 */
export function Sidebar({
  loading,
  latestPosts,
  allCategories,
  allTags,
  selectedCategory,
  searchQuery,
  lang,
  t,
  onSelectPost,
  onClearCategory,
  onSelectCategory,
  onTagClick,
}: SidebarProps) {
  const dateLocale = lang === 'vi' ? viLocale : enUS;

  if (loading) {
    return (
      <aside className="lg:col-span-4 space-y-12">
        <SidebarSectionSkeleton />
        <SidebarSectionSkeleton />
        <SidebarSectionSkeleton />
      </aside>
    );
  }

  return (
    <aside className="lg:col-span-4 space-y-12">
      {/* Latest posts */}
      <section className="bg-black/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
        <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          {t.latest}
        </h4>
        <div className="space-y-4">
          {latestPosts.map((post) => (
            <button
              key={post.slug}
              type="button"
              onClick={() => onSelectPost(post)}
              className="group cursor-pointer py-1 w-full text-left"
            >
              <div className="text-[10px] font-sans text-black/40 uppercase tracking-wider mb-0.5 tabular-nums">
                {format(new Date(post.date), 'dd/MM/yyyy', { locale: dateLocale })}
              </div>
              <h5 className="text-sm font-bold group-hover:text-orange-600 transition-colors line-clamp-1">
                {lang === 'vi' ? post.title : post.title_en}
              </h5>
            </button>
          ))}
        </div>
      </section>

      {/* Categories list */}
      <section className="bg-black/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
        <h4 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" />
          {t.category}
        </h4>
        <div className="space-y-2">
          <button
            onClick={onClearCategory}
            className={cn(
              'w-full text-left px-4 py-2 rounded-xl text-sm transition-all',
              !selectedCategory ? 'bg-orange-500 text-white font-bold' : 'hover:bg-black/5',
            )}
          >
            {t.categories}
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={cn(
                'w-full text-left px-4 py-2 rounded-xl text-sm transition-all',
                selectedCategory === cat
                  ? 'bg-orange-500 text-white font-bold'
                  : 'hover:bg-black/5',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Popular tags */}
      <section className="bg-black/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
        <h4 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange-500" />
          {t.popularTags}
        </h4>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isActive = searchQuery === tag;
            return (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sans transition-all',
                  isActive
                    ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-300'
                    : 'bg-white hover:bg-orange-50 hover:text-orange-700 text-black/60',
                )}
                aria-pressed={isActive}
              >
                {/* Active-state dot — Maggie Appleton-style indicator. */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-orange-500"
                  />
                )}
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      {/* Newsletter (decorative — wire to a real provider later) */}
      <section className="bg-orange-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white">
        <h4 className="text-lg md:text-xl font-bold mb-4">{t.newsletterTitle}</h4>
        <p className="text-white/80 font-sans text-sm mb-6 leading-relaxed">{t.newsletterDesc}</p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            className="w-full bg-white/20 border-none rounded-full py-3 px-4 text-sm placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/40 transition-all"
          />
          <button className="w-full bg-white text-orange-600 font-sans font-bold py-3 rounded-full hover:bg-orange-50 transition-all">
            {t.subscribe}
          </button>
        </div>
      </section>
    </aside>
  );
}
