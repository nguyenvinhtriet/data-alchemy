import { motion } from 'motion/react';
import type { Lang, translations } from '../i18n';

type T = (typeof translations)[Lang];

interface ContactViewProps {
  t: T;
}

/**
 * Contact form. Currently decorative — fields render but the submit button
 * is unwired. Hook up to a form-handling provider (e.g. Formspree, Resend)
 * when ready.
 */
export function ContactView({ t }: ContactViewProps) {
  return (
    <motion.div
      key="contact"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <header className="mb-10 md:mb-16">
        <h1 className="text-3xl md:text-7xl font-bold leading-tight mb-4 md:mb-6">
          {t.contactTitle}
        </h1>
        <p className="text-lg md:text-xl text-black/60 max-w-2xl font-sans leading-relaxed">
          {t.contactDesc}
        </p>
      </header>

      <form className="bg-white border border-black/5 rounded-[32px] p-8 md:p-12 shadow-warm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-4">
              {t.nameLabel}
            </label>
            <input
              type="text"
              className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder={t.namePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-4">
              {t.emailLabel}
            </label>
            <input
              type="email"
              className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder={t.emailPlaceholder}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-4">
            {t.subjectLabel}
          </label>
          <input
            type="text"
            className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-4">
            {t.messageLabel}
          </label>
          <textarea className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all min-h-[200px]" />
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white font-sans font-bold py-4 px-12 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          {t.send}
        </button>
      </form>
    </motion.div>
  );
}
