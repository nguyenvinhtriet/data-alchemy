# Contributing to data-alchemy

Friendly guide for adding posts, fixing bugs, and tweaking the design. Most things on this blog are intentionally small and obvious — read this once and you're set.

## Repo orientation

```
data-alchemy/
├── content/posts/YYYY/MM/DD/<slug>.md   ← every post lives here
├── src/
│   ├── App.tsx                          ← router shell + state, ~250 LOC
│   ├── i18n.ts                          ← all UI strings (vi + en)
│   ├── main.tsx                         ← React entry + BrowserRouter
│   ├── index.css                        ← Tailwind v4 @theme + base styles
│   ├── components/                      ← all UI components, each < 250 LOC
│   ├── lib/                             ← framework-agnostic utilities
│   │   ├── posts.ts                     ← Vite-side post loader (import.meta.glob)
│   │   ├── giscus-config.ts             ← Giscus comments setup
│   │   ├── author.ts                    ← single-author profile
│   │   ├── reading-time.ts              ← word-count based estimate
│   │   ├── post-image.ts                ← per-slug gradient palette picker
│   │   ├── slugify.ts                   ← diacritic-safe slug generator
│   │   └── utils.ts                     ← cn() (clsx + tailwind-merge)
│   └── test/
├── scripts/
│   ├── new-post.mjs                     ← `npm run new:post` scaffolder
│   ├── generate-sitemap.mjs             ← build-time sitemap.xml
│   ├── generate-rss.mjs                 ← build-time rss.xml + rss.en.xml
│   ├── copy-404.mjs                     ← SPA fallback for GH Pages
│   ├── snapshot-blog-db.mjs             ← legacy SQLite snapshot tool
│   └── lib/
│       ├── site-config.mjs              ← single source for URL/title/etc
│       └── load-posts.mjs               ← Node-side post loader (used by SEO scripts)
├── docs/                                ← all human docs (this file, LOCAL-DEV, ARCHITECTURE-PLAN)
├── .github/workflows/ci.yml             ← lint → typecheck → test → build → Lighthouse
└── public/                              ← static assets that ship as-is (robots.txt, future og-default.png)
```

## Writing a post

### The easy way

```powershell
npm run new:post
```

You'll be prompted for title (VI + EN), slug (auto-generated, editable), date, excerpt, category, tags, author. The script creates the file at the right path with a complete frontmatter + bilingual body template, and opens it in `$EDITOR` if set.

### The manual way

Create `content/posts/YYYY/MM/DD/<slug>.md`:

```yaml
---
title: "Tiêu đề tiếng Việt"
title_en: "English Title"
date: "2026-05-07"
excerpt: "Mô tả 1-2 câu cho card và RSS."
excerpt_en: "1-2 sentence summary for the card and RSS feed."
author: "Triet"
tags: ["Web Dev", "React"]
tags_en: ["Web Dev", "React"]
category: "Công nghệ"
category_en: "Technology"
---

# Tiêu đề tiếng Việt

Nội dung tiếng Việt của bạn ở đây. Hỗ trợ đầy đủ markdown:

## Mục lớn

- Bullets
- **Bold**, *italic*, `code`
- [Links](https://example.com)

```ts
console.log("Code blocks work too");
```

> Blockquotes for important callouts.

<!-- en -->

# English Title

The Vietnamese content goes above the `<!-- en -->` separator, English below. Same markdown features available.
```

### Frontmatter cheat sheet

| Field | Required | Notes |
|---|---|---|
| `title` | ✅ | Vietnamese title |
| `title_en` | optional (falls back to `title`) | English title |
| `date` | ✅ | `YYYY-MM-DD`. Drives sort order + sitemap lastmod |
| `excerpt` | ✅ | 1-2 sentences. Shown on cards + in RSS |
| `excerpt_en` | optional | Falls back to `excerpt` |
| `author` | optional | Shown next to date in post header |
| `tags` | optional | Array. Drives the popular-tags sidebar |
| `tags_en` | optional | English tags. Falls back to `tags` |
| `category` | ✅ | Drives the categories dropdown + grid |
| `category_en` | optional | Falls back to `category` |

### After saving

`npm run dev` is already watching — the post appears in the list immediately. Vite HMR picks up MD changes without a refresh.

Heading anchors are automatic: any `## h2` or `### h3` in the body gets an `id` and a hover-revealed `#` deep-link.

## Local development

See [LOCAL-DEV.md](LOCAL-DEV.md) for full setup. Quick reference:

```powershell
npm install          # one time
npm run dev          # http://localhost:3000/data-alchemy/
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm test             # Vitest
npm run build        # vite build → sitemap → rss → 404 fallback
npm run new:post     # scaffold a new post
```

## Code style

Already configured — just run the tools:

- **ESLint** (`eslint.config.js`) — TS + react-hooks + react-refresh. Warnings allowed; errors fail CI.
- **Prettier** (`.prettierrc.json`) — single-quotes, semis, trailing-all, 100col, Tailwind class ordering plugin.
- **EditorConfig** — 2-space indent, LF, UTF-8.

Auto-fix everything:

```powershell
npm run lint:fix
npm run format
```

### Conventions worth knowing

- **No file > 250 LOC.** If a component is growing past that, split it.
- **Callback props, not state setters.** Components like `<Header onNavigateHome={...} />` don't take `setSelectedPost` — they take a thin event callback that the parent wraps.
- **Translations live in `src/i18n.ts`.** Adding a new string? Add a new key in both `vi` and `en` blocks. Don't inline literals in components.
- **Use semantic HTML.** `<header>`, `<main>`, `<aside>`, `<article>`, `<section>`, `<time>` — already widely used across the codebase.
- **Tabular numerics** for any column of numbers (dates, page numbers, like counts). Either use `<time>` (auto-tabular via base CSS) or add `tabular-nums` className.

## Design tokens

Tailwind v4 is configured inline via `@theme` in `src/index.css`. To add a new design token:

```css
@theme {
  --font-display: 'Cabinet Grotesk', serif;
  --color-accent-2: oklch(0.7 0.2 30);
}
```

Tailwind picks these up automatically. No `tailwind.config.ts` needed.

### Custom utilities

A few non-Tailwind utilities live in `index.css`:

- `.shadow-warm` / `.shadow-warm-md` — warm-tinted shadows matching the cream background
- `.skip-to-content` — keyboard-only skip link (visible when focused)
- `.tabular-nums` — `font-variant-numeric: tabular-nums` (for tables of figures)
- `.markdown-body` — typography styles for rendered post markdown

### Color palette

- **Background:** `#fdfcfb` (cream) with two subtle radial gradients (orange tint top-left, neutral bottom-right)
- **Text:** `#1a1a1a` (near-black)
- **Brand accent:** `orange-500` `#ff6b35` (single accent — don't add more)
- **Post-thumbnail gradients:** 6 curated palettes in `src/lib/post-image.ts` keyed by slug hash

## Comments (Giscus)

Comments are powered by [Giscus](https://giscus.app), backed by GitHub Discussions.

If `src/lib/giscus-config.ts` has empty strings, comment areas render a small "not yet configured" placeholder. To enable:

1. Settings → General → Features → enable Discussions on this repo
2. Install the [Giscus GitHub app](https://github.com/apps/giscus)
3. Visit <https://giscus.app>, configure for this repo
4. Paste the generated `repo`, `repoId`, `category`, `categoryId` values into [`src/lib/giscus-config.ts`](../src/lib/giscus-config.ts)

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`:

1. **verify** — `npm run lint && npm run typecheck && npm test && npm run build` (uploads `dist` as artifact)
2. **lighthouse** — runs Lighthouse against the built dist. Thresholds: perf ≥ 0.85 (warn), a11y ≥ 0.95 (error), best-practices ≥ 0.9 (warn), seo ≥ 0.9 (warn). Report stored at a temporary public URL — link appears in the action log.

If Lighthouse breaks, common fixes:

- **a11y < 0.95** — usually a contrast or missing `aria-label`. Check the report; the offending DOM node is named.
- **perf < 0.85** — usually a large unoptimized image. We don't use images right now, but if you add one, run it through [squoosh.app](https://squoosh.app) first.

## Deploy

```powershell
npm run deploy
```

Builds, then pushes `dist/` to the `gh-pages` branch via the `gh-pages` package. Live site updates within ~60 seconds at <https://trietnv.github.io/data-alchemy/>.

In Settings → Pages, source must be set to **Deploy from a branch → `gh-pages` / root**.

## Architecture

See [ARCHITECTURE-PLAN.md](ARCHITECTURE-PLAN.md) for the full migration log — every phase from "remove the hardcoded admin password" through "extract every component out of App.tsx" is recorded with what changed and why. Useful when you wonder *"why is this set up this way?"*.

## Reporting bugs

Open an issue with:

- What you did
- What you expected
- What happened
- Browser + OS

That's it. Have fun.
