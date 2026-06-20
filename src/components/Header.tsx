import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronDown, Github, Twitter } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Lang, translations } from '../i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export type CurrentView = 'home' | 'contact' | 'discussion';

type T = (typeof translations)[Lang];

interface HeaderProps {
  /** Current top-level route state. */
  currentView: CurrentView;
  /** Whether a post is currently being viewed (drives active-link styling). */
  hasSelectedPost: boolean;
  /** Currently filtered category, or null for "all". */
  selectedCategory: string | null;
  /** Current UI language. */
  lang: Lang;
  /** Translation map for the current language. */
  t: T;
  /** Categories derived from posts (for the dropdown). */
  allCategories: string[];

  onNavigateHome: () => void;
  onNavigateContact: () => void;
  onSelectCategory: (cat: string) => void;
  onToggleLang: () => void;
}

/**
 * Sticky top navigation. Hosts: site title, posts/category/contact links,
 * the categories dropdown, the language switcher, and decorative social icons.
 *
 * The categories dropdown's open/close state lives here (it's purely UI state,
 * no parent needs to know).
 */
export function Header({
  currentView,
  hasSelectedPost,
  selectedCategory,
  lang,
  t,
  allCategories,
  onNavigateHome,
  onNavigateContact,
  onSelectCategory,
  onToggleLang,
}: HeaderProps) {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="text-lg md:text-xl font-bold tracking-tight hover:text-orange-600 transition-colors flex items-center gap-2 shrink-0"
        >
          <BookOpen className="w-5 h-5 text-orange-500" />
          <span>{t.blogTitle}</span>
        </button>

        <div className="flex items-center gap-3 md:gap-6 text-[10px] md:text-sm font-sans uppercase tracking-wider text-black/60">
          <button
            onClick={onNavigateHome}
            className={cn(
              'hover:text-black transition-colors whitespace-nowrap',
              currentView === 'home' &&
                !hasSelectedPost &&
                !selectedCategory &&
                'text-orange-600 font-bold',
            )}
          >
            {t.posts}
          </button>

          {/* Categories dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryMenuOpen(true)}
            onMouseLeave={() => setIsCategoryMenuOpen(false)}
          >
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className={cn(
                'hover:text-black transition-colors flex items-center gap-1 whitespace-nowrap py-2',
                selectedCategory && 'text-orange-600 font-bold',
              )}
            >
              {t.category}
              <ChevronDown
                className={cn(
                  'w-3 h-3 opacity-40 transition-transform duration-300',
                  isCategoryMenuOpen && 'rotate-180',
                )}
              />
            </button>

            <AnimatePresence>
              {isCategoryMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 pt-2 z-[60]"
                >
                  <div className="bg-white border border-black/10 shadow-2xl rounded-2xl p-2 min-w-[180px] backdrop-blur-xl">
                    {allCategories.length > 0 ? (
                      allCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            onSelectCategory(cat);
                            setIsCategoryMenuOpen(false);
                          }}
                          className={cn(
                            'w-full text-left px-4 py-2.5 rounded-xl text-xs hover:bg-black/5 transition-colors flex items-center justify-between group/item',
                            selectedCategory === cat && 'bg-orange-50 text-orange-600 font-bold',
                          )}
                        >
                          <span>{cat}</span>
                          {selectedCategory === cat && (
                            <div className="w-1 h-1 rounded-full bg-orange-500" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-[10px] text-black/40 italic">Loading...</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={onNavigateContact}
            className={cn(
              'hover:text-black transition-colors whitespace-nowrap',
              currentView === 'contact' && 'text-orange-600 font-bold',
            )}
          >
            {t.contact}
          </button>

          <div className="flex items-center gap-2 md:gap-4 ml-1 md:ml-4 border-l border-black/10 pl-2 md:pl-4">
            <LanguageSwitcher lang={lang} onToggle={onToggleLang} />
            <div className="flex items-center gap-2 md:gap-3">
              <Github className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:text-black transition-colors" />
              <Twitter className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:text-black transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
