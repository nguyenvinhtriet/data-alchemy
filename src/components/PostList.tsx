import { motion } from 'motion/react';
import { Search, BookOpen, MessageSquare } from 'lucide-react';
import type { Lang, translations } from '../i18n';
import type { Post } from '../types';
import { PostCard } from './PostCard';
import { PostSkeleton, CategorySkeleton } from './skeletons';
import { PostThumbnail } from './PostThumbnail';
import { Comments } from './Comments';

type T = (typeof translations)[Lang];

interface PostListProps {
  /** All posts — used by the featured-categories grid. */
  posts: Post[];
  /** Posts shown on the current page (after search + category filter). */
  paginatedPosts: Post[];
  /** Posts shown across all pages (drives the "no posts" empty state). */
  filteredPosts: Post[];

  loading: boolean;

  searchQuery: string;
  currentPage: number;
  totalPages: number;
  selectedCategory: string | null;
  /** Hot categories in the user's current language, in display order. */
  gridCategories: string[];

  lang: Lang;
  t: T;

  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onSelectPost: (post: Post) => void;
  onSelectCategory: (cat: string) => void;
}

/**
 * Home view. Composed of: hero header + search input, the paginated post list
 * (or skeletons while loading), an empty-state, pagination controls, the
 * featured-categories grid (only when no filter is active), and the home
 * discussion widget.
 */
export function PostList({
  posts,
  paginatedPosts,
  filteredPosts,
  loading,
  searchQuery,
  currentPage,
  totalPages,
  selectedCategory,
  gridCategories,
  lang,
  t,
  onSearchChange,
  onPageChange,
  onSelectPost,
  onSelectCategory,
}: PostListProps) {
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      {/* Hero */}
      <header className="mb-10 md:mb-16">
        <h1 className="text-3xl md:text-7xl font-bold leading-tight mb-4 md:mb-6">
          {t.heroTitle} <br />
          <span className="italic text-orange-600">{t.heroHighlight}</span>
          {t.heroSuffix}
        </h1>
        <p className="text-base md:text-xl text-black/60 max-w-2xl font-sans leading-relaxed">
          {t.heroDesc}
        </p>

        <div className="mt-8 md:mt-10 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black/5 border-none rounded-full py-2.5 md:py-3 pl-10 pr-4 font-sans text-sm focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
          />
        </div>
      </header>

      {/* Posts list */}
      <div className="grid gap-10 md:gap-16">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
          : paginatedPosts.map((post, index) => (
              <PostCard
                key={post.slug}
                post={post}
                index={index}
                lang={lang}
                t={t}
                onSelect={onSelectPost}
              />
            ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 font-sans text-black/40">{t.noPosts}</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="px-6 py-2 bg-black/5 rounded-full font-sans text-sm font-bold disabled:opacity-30 hover:bg-orange-100 transition-all"
          >
            {t.prev}
          </button>
          <span className="font-sans text-sm text-black/40">
            {t.page} {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="px-6 py-2 bg-black/5 rounded-full font-sans text-sm font-bold disabled:opacity-30 hover:bg-orange-100 transition-all"
          >
            {t.next}
          </button>
        </div>
      )}

      {/* Featured-categories grid (hidden while filtering) */}
      {!selectedCategory && searchQuery === '' && (
        <div className="mt-20 md:mt-32 pt-12 md:pt-20 border-t border-black/5">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
            {t.category}
          </h3>
          {/* `md:auto-rows-fr` makes each grid row equal-height so the "See all"
              CTAs at each card's bottom line up across the row regardless of
              how many other-posts each category has. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:auto-rows-fr">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={i} />)
              : gridCategories.map((cat) => {
                  const categoryPosts = posts.filter(
                    (p) => (lang === 'vi' ? p.category : p.category_en) === cat,
                  );
                  if (categoryPosts.length === 0) return null;

                  const featuredPost = categoryPosts[0];
                  const otherPosts = categoryPosts.slice(1, 6);

                  return (
                    <div
                      key={cat}
                      className="bg-white rounded-2xl md:rounded-[32px] border border-black/5 overflow-hidden flex flex-col shadow-warm hover:shadow-warm-md transition-all"
                    >
                      <div
                        className="relative h-32 md:h-40 cursor-pointer group"
                        onClick={() => onSelectPost(featuredPost)}
                      >
                        <PostThumbnail
                          slug={featuredPost.slug}
                          title={lang === 'vi' ? featuredPost.title : featuredPost.title_en}
                          alt=""
                          className="absolute inset-0 group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                          <span className="px-3 py-1 md:px-4 md:py-1.5 bg-red-600 text-white rounded-full text-[9px] md:text-[11px] font-bold uppercase tracking-wider shadow-lg">
                            {cat}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 md:p-6 flex-1 flex flex-col">
                        <h3
                          onClick={() => onSelectPost(featuredPost)}
                          className="text-lg font-bold mb-4 cursor-pointer hover:text-orange-600 transition-colors line-clamp-2 leading-tight"
                        >
                          {lang === 'vi' ? featuredPost.title : featuredPost.title_en}
                        </h3>

                        <div className="space-y-2 mb-6 flex-1">
                          {otherPosts.map((post) => (
                            <div
                              key={post.slug}
                              onClick={() => onSelectPost(post)}
                              className="group cursor-pointer py-2 border-t border-black/5 first:border-t-0"
                            >
                              <h4 className="text-xs text-black/70 group-hover:text-orange-600 transition-colors line-clamp-1 leading-snug">
                                {lang === 'vi' ? post.title : post.title_en}
                              </h4>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => onSelectCategory(cat)}
                          className="w-full py-2.5 bg-black/5 hover:bg-black/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          {t.seeAll}
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      )}

      {/* Home discussion */}
      <div className="mt-20 pt-20 border-t border-black/5">
        <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-orange-500" />
          {t.discussion}
        </h3>
        <p className="text-black/60 mb-8 font-sans">{t.discussionDesc}</p>
        <Comments term="global" lang={lang} />
      </div>
    </motion.div>
  );
}
