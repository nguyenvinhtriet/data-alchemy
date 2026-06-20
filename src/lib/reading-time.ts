/**
 * Estimate reading time for a markdown string.
 *
 * Strips code-fences and HTML comments before counting words. Defaults to
 * 220 words/minute — a middle ground between the conventional 200 wpm for
 * prose and 250+ wpm for skim-friendly tech writing. Tweak via the option
 * if you have user data telling you otherwise.
 *
 * Returns at minimum 1 minute — a 60-word post is still "1 min read".
 */
export function readingTimeMinutes(markdown: string, wordsPerMinute = 220): number {
  if (!markdown) return 1;
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/<!--[\s\S]*?-->/g, ' ') // HTML comments (e.g. the en-separator)
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ') // markdown links + images
    .replace(/[#*_>`~]/g, ' '); // markdown punctuation

  const words = cleaned.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
