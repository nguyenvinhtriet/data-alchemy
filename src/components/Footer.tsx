import { BookOpen } from 'lucide-react';
import type { Lang, translations } from '../i18n';

type T = (typeof translations)[Lang];

interface FooterProps {
  t: T;
  onNavigateHome: () => void;
  onNavigateContact: () => void;
}

/**
 * Site footer. Two columns: brand + description, then quick-links + social.
 * Social links are placeholders (`href="#"`) — drop in real URLs when ready.
 */
export function Footer({ t, onNavigateHome, onNavigateContact }: FooterProps) {
  return (
    <footer className="bg-black text-white py-20 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold mb-6">
            <BookOpen className="w-6 h-6 text-orange-500" />
            <span>{t.blogTitle}</span>
          </div>
          <p className="text-white/60 font-sans leading-relaxed max-w-sm">{t.footerDesc}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 font-sans">
          <div>
            <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-orange-500">
              {t.links}
            </h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <button onClick={onNavigateHome} className="hover:text-white transition-colors">
                  {t.home}
                </button>
              </li>
              <li>
                <button onClick={onNavigateHome} className="hover:text-white transition-colors">
                  {t.posts}
                </button>
              </li>
              <li>
                <button onClick={onNavigateContact} className="hover:text-white transition-colors">
                  {t.contact}
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-orange-500">
              {t.follow}
            </h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 text-center text-xs font-sans text-white/40 uppercase tracking-wider">
        © 2026 {t.blogTitle}. Built with passion.
      </div>
    </footer>
  );
}
