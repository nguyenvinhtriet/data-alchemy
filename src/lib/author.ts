/**
 * Author profile for the AuthorBio card and footer references.
 *
 * Single-author blog for now — switch to a per-post lookup keyed by
 * `post.author` if you start having guest writers.
 */
export const AUTHOR = {
  name: 'Triet',
  /** Short, friendly. ~140 chars. Shown under the author card on each post. */
  shortBio: {
    vi: 'Một lập trình viên yêu thích web, dữ liệu, và chia sẻ những thứ mình học được. Mở source code, viết blog, build công cụ vớ vẩn.',
    en: 'A developer who loves the web, data, and sharing what I learn. Open source, blogs, and the occasional silly side project.',
  },
  /** Avatar URL. Empty string falls back to a generated initial-tile. */
  avatar: '',
  /** Public social links — empty strings hide that link. */
  links: {
    github: 'https://github.com/TrietNV',
    twitter: '',
    website: '',
    /** Set to a mailto: URL if you want to expose an email contact. */
    email: '',
  },
} as const;

export type AuthorLang = 'vi' | 'en';
