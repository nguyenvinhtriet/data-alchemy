import { motion } from 'motion/react';
import { format } from 'date-fns';
import { vi as viLocale, enUS } from 'date-fns/locale';
import { ArrowLeft, BookOpen, MessageSquare, Calendar, User, Clock } from 'lucide-react';
import type { Lang, translations } from '../i18n';
import type { Post } from '../types';
import { readingTimeMinutes } from '../lib/reading-time';
import { Comments } from './Comments';
import { AuthorBio } from './AuthorBio';
import { PrevNextNav } from './PrevNextNav';
import { MarkdownBody } from './MarkdownBody';
import { ShareButton } from './ShareButton';

type T = (typeof translations)[Lang];

interface PostDetailProps {
  post: Post;
  /** All posts (used to compute related-posts list and prev/next nav). */
  posts: Post[];
  lang: Lang;
  t: T;
  onBack: () => void;
  onSelectPost: (post: Post) => void;
}

/** Shared selector: posts with the same category OR overlapping tags. Caps at 4. */
function selectRelated(all: Post[], current: Post): Post[] {
  return all
    .filter(
      (p) =>
        p.slug !== current.slug &&
        (p.category === current.category ||
          p.tags.some((tag) => current.tags.includes(tag))),
    )
    .slice(0, 4);
}

/**
 * Single-post view. Layout: back → header (chips/title/meta + share) →
 * markdown body (with heading anchors) → author bio → related posts →
 * prev/next nav → comments.
 */
export function PostDetail({ post, posts, lang, t, onBack, onSelectPost }: PostDetailProps) {
  const dateLocale = lang === 'vi' ? viLocale : enUS;
  const title = lang === 'vi' ? post.title : post.title_en;
  const category = lang === 'vi' ? post.category : post.category_en;
  const tags = lang === 'vi' ? post.tags : post.tags_en;
  const content = lang === 'vi' ? post.content : post.content_en;
  const readMins = readingTimeMinutes(content);

  const related = selectRelated(posts, post);

  const handleSelectRelated = (p: Post) => {
    onSelectPost(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      key="post"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl"
    >
      <button
        onClick={onBack}
        className="mb-12 flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-wider hover:text-orange-600 transition-all hover:gap-4"
      >
        <ArrowLeft className="w-4 h-4" /> {t.prev}
      </button>

      <header className="mb-12 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-sans font-bold uppercase tracking-wider">
            {category}
          </span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-sans font-bold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h1 className="text-3xl md:text-6xl font-bold leading-tight">{title}</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-sans text-black/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {format(new Date(post.date), 'dd MMMM, yyyy', { locale: dateLocale })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="tabular-nums">
                {readMins} {t.minRead}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
          </div>
          <ShareButton t={t} />
        </div>
      </header>

      <div className="prose prose-base md:prose-lg prose-orange max-w-none prose-headings:font-sans prose-p:leading-relaxed prose-pre:bg-black/5 prose-pre:text-black prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg">
        <div className="markdown-body">
          <MarkdownBody>{content}</MarkdownBody>
        </div>
      </div>

      {/* Author bio (humanizes the post before piling on more links). */}
      <AuthorBio lang={lang} t={t} />

      {/* Related */}
      <div className="mt-12 md:mt-20 pt-10 border-t border-black/5">
        <h3 className="text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-orange-500" />
          {t.relatedPosts}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {related.map((p) => (
            <div
              key={p.slug}
              onClick={() => handleSelectRelated(p)}
              className="group cursor-pointer p-4 rounded-2xl hover:bg-black/5 transition-all border border-transparent hover:border-black/5"
            >
              <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600 mb-2">
                {lang === 'vi' ? p.category : p.category_en}
              </div>
              <h4 className="font-bold group-hover:text-orange-600 transition-colors line-clamp-2">
                {lang === 'vi' ? p.title : p.title_en}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Newer / Older chronological navigation. */}
      <PrevNextNav
        posts={posts}
        current={post}
        lang={lang}
        t={t}
        onSelect={handleSelectRelated}
      />

      {/* Post-level discussion */}
      <div className="mt-16 md:mt-20 pt-12 md:pt-20 border-t border-black/5">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
          {t.comments}
        </h3>
        <Comments term={post.slug} lang={lang} />
      </div>
    </motion.div>
  );
}
