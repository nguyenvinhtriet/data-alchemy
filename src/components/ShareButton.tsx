import { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import type { Lang, translations } from '../i18n';

type T = (typeof translations)[Lang];

interface ShareButtonProps {
  t: T;
  /**
   * URL to copy. Defaults to `window.location.href` (current canonical post URL).
   * Pass an explicit URL if you want to share a specific deep-link.
   */
  url?: string;
}

/**
 * Copy-link share button — Vercel/Linear blog signature.
 *
 * Click → writes the URL to the clipboard, swaps the icon + label to
 * a check-mark + "Copied" for 1.6s, then reverts. Fails gracefully if
 * the Clipboard API isn't available (older browsers, insecure contexts).
 */
export function ShareButton({ t, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const target = url ?? (typeof window !== 'undefined' ? window.location.href : '');
    if (!target) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(target);
      } else {
        // Legacy fallback for non-secure contexts.
        const ta = document.createElement('textarea');
        ta.value = target;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignore — clipboard write was blocked; user can still copy from address bar.
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider bg-black/5 hover:bg-orange-50 hover:text-orange-700 transition-colors"
      aria-label={t.copyLink}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          {t.linkCopied}
        </>
      ) : (
        <>
          <Link2 className="w-3.5 h-3.5" />
          {t.copyLink}
        </>
      )}
    </button>
  );
}
