/**
 * <Comments /> — Giscus-backed comments widget.
 *
 * Replaces the previous custom comment system (Express + better-sqlite3).
 * Storage is GitHub Discussions on the configured repo.
 *
 * Use `term="global"` for the global discussion page; for per-post comments,
 * pass the post slug.
 */
import Giscus from '@giscus/react';
import { GISCUS_CONFIG, isConfigured, type GiscusRepo } from '../lib/giscus-config';

interface CommentsProps {
  /** Stable identifier for this discussion thread (post slug or 'global'). */
  term: string;
  /** UI language for the giscus widget. */
  lang?: 'vi' | 'en';
}

export function Comments({ term, lang = 'vi' }: CommentsProps) {
  if (!isConfigured(GISCUS_CONFIG)) {
    return (
      <div className="rounded-2xl bg-black/5 p-6 font-sans text-sm text-black/50 italic">
        Comments are not yet configured. See <code>src/lib/giscus-config.ts</code> and
        follow the setup instructions to enable Giscus.
      </div>
    );
  }

  return (
    <Giscus
      id={`giscus-${term}`}
      repo={GISCUS_CONFIG.repo as GiscusRepo}
      repoId={GISCUS_CONFIG.repoId}
      category={GISCUS_CONFIG.category}
      categoryId={GISCUS_CONFIG.categoryId}
      mapping="specific"
      term={term}
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="light"
      lang={lang === 'vi' ? 'vi' : 'en'}
      loading="lazy"
    />
  );
}
