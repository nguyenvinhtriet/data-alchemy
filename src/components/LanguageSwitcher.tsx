import { Languages } from 'lucide-react';
import type { Lang } from '../i18n';

interface LanguageSwitcherProps {
  lang: Lang;
  onToggle: () => void;
}

/** Tiny VI/EN toggle button. Lives in the header but extracted for reuse. */
export function LanguageSwitcher({ lang, onToggle }: LanguageSwitcherProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 md:gap-2 hover:text-orange-600 transition-colors font-bold"
      aria-label={lang === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
    >
      <Languages className="w-3 h-3 md:w-4 md:h-4" />
      <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
    </button>
  );
}
