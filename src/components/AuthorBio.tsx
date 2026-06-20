import { Github, Twitter, Globe, Mail } from 'lucide-react';
import type { Lang, translations } from '../i18n';
import { AUTHOR } from '../lib/author';

type T = (typeof translations)[Lang];

interface AuthorBioProps {
  lang: Lang;
  t: T;
}

/** Generated initial-tile fallback for missing avatars. */
function InitialTile({ name }: { name: string }) {
  const initial = (name[0] || '?').toUpperCase();
  return (
    <div
      className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold text-2xl shrink-0"
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

/**
 * Compact author card shown at the end of every post.
 * Hooks readers into who wrote it without dragging in a full /about page.
 */
export function AuthorBio({ lang, t }: AuthorBioProps) {
  const bio = AUTHOR.shortBio[lang];

  return (
    <section
      className="mt-16 md:mt-20 pt-10 md:pt-12 border-t border-black/5"
      aria-labelledby="author-bio-heading"
    >
      <h3 id="author-bio-heading" className="sr-only">
        {t.aboutAuthor}
      </h3>
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 p-6 md:p-8 rounded-3xl bg-black/[0.03]">
        {AUTHOR.avatar ? (
          <img
            src={AUTHOR.avatar}
            alt={AUTHOR.name}
            className="w-16 h-16 rounded-2xl object-cover shrink-0"
          />
        ) : (
          <InitialTile name={AUTHOR.name} />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-orange-600 mb-1">
            {t.aboutAuthor}
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h4 className="text-xl font-bold">{AUTHOR.name}</h4>
          </div>
          <p className="mt-2 text-sm md:text-base text-black/60 leading-relaxed">{bio}</p>
          <div className="mt-4 flex items-center gap-3 text-black/40">
            {AUTHOR.links.github && (
              <a
                href={AUTHOR.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="hover:text-black transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {AUTHOR.links.twitter && (
              <a
                href={AUTHOR.links.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="hover:text-black transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {AUTHOR.links.website && (
              <a
                href={AUTHOR.links.website}
                target="_blank"
                rel="noreferrer"
                aria-label="Website"
                className="hover:text-black transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {AUTHOR.links.email && (
              <a
                href={AUTHOR.links.email}
                aria-label="Email"
                className="hover:text-black transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
