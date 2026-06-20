import { motion } from 'motion/react';
import type { Lang, translations } from '../i18n';
import { Comments } from './Comments';

type T = (typeof translations)[Lang];

interface DiscussionViewProps {
  t: T;
  lang: Lang;
}

/** Standalone "Discussion" page. Just the heading + a global Giscus thread. */
export function DiscussionView({ t, lang }: DiscussionViewProps) {
  return (
    <motion.div
      key="discussion"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <header className="mb-10 md:mb-16">
        <h1 className="text-3xl md:text-7xl font-bold leading-tight mb-4 md:mb-6">
          {t.discussion}
        </h1>
        <p className="text-lg md:text-xl text-black/60 max-w-2xl font-sans leading-relaxed">
          {t.discussionDesc}
        </p>
      </header>

      <Comments term="global" lang={lang} />
    </motion.div>
  );
}
