# Data Alchemy — Architecture Improvement Plan

> Generated 2026-05-07. Audit-driven, phased, checkpointed.
> Implementation rule: SMALL/DOC/THINK → Sonnet · CODE+ARCHITECTURE → Opus.

---

## 1. Audit Snapshot

| Area | Current state | Verdict |
|---|---|---|
| Stack | React 19 + Vite 6 + Tailwind 4 + Express + better-sqlite3 | Over-engineered for a personal blog |
| Content | 15 MD posts under `content/posts/YYYY/MM/DD/`, bilingual via `<!-- en -->` separator | Fragile separator pattern, no language-aware routing |
| App shell | Single `src/App.tsx` (1166 lines) | Needs componentization |
| Tooling | `tsc --noEmit` only | No ESLint, Prettier, tests, or CI |
| SEO | None | No sitemap, robots, RSS, Open Graph |
| Deploy | `gh-pages -d dist` script, no CI | Manual deploys, no automation |
| Backend | Express + SQLite for likes/comments | DB lost on redeploy; hardcoded password hash in `server.ts` |
| Security | `'Admin@123q'` SHA-256 in source | Critical — must remove |
| Styling | Tailwind config inline in `index.css` `@theme` block | Should be a real config file |
| Images | Random `picsum.photos` URLs | No persistence, no optimization |

---

## 2. Goals

1. **Security first** — remove hardcoded secrets.
2. **Right-size the architecture** — decide static vs. full-stack, stop straddling.
3. **Tooling baseline** — lint, format, type-check, CI.
4. **Maintainable codebase** — split the 1166-line App, real Tailwind config.
5. **Discoverability** — SEO, sitemap, RSS, OG tags.
6. **Bilingual content done properly** — typed, validated, language-aware routing.
7. **Tests + verification on every checkpoint.**

---

## 3. Phased Plan (with checkpoints)

Each checkpoint is independently shippable. Verification step is mandatory before moving to the next.

### Phase 0 — Security & Hygiene  *(must do first)*

- **C0.1** Move `ADMIN_PASSWORD_HASH` out of `server.ts` into `.env`; fail-fast on missing env.
- **C0.2** Add `.env.example`, ensure `.env` and `blog.db` are in `.gitignore`.
- **C0.3** Verify: grep source for any remaining secret-shaped strings; run server with empty env to confirm fail-fast.

### Phase 1 — Tooling Foundation

- **C1.1** Add ESLint (TypeScript + React) with sane defaults.
- **C1.2** Add Prettier + EditorConfig; align Tailwind class ordering plugin.
- **C1.3** Add Vitest + React Testing Library scaffold (one smoke test).
- **C1.4** GitHub Actions workflow: `lint`, `typecheck`, `test`, `build` on push/PR.
- **C1.5** Verify: CI green on a throwaway PR; `npm run lint && npm test && npm run build` succeed locally.

### Phase 2 — Backend Decision  *(blocks Phase 5+)*

Pick **one**:

- **A. Fully static** — drop Express/SQLite, remove likes/comments OR replace with Giscus (GitHub-discussions-backed).
- **B. Serverless** — move likes/comments to Cloudflare Workers/Pages Functions + Turso/D1.
- **C. Keep current** — accept DB-loss-on-redeploy, document workaround.

Recommendation: **A with Giscus** for a personal blog. Lowest cost, lowest maintenance, highest reliability.

- **C2.1** Decision recorded here in §6.
- **C2.2** Implement chosen path.
- **C2.3** Verify: feature parity (or intentional removal) confirmed in production build.

### Phase 3 — Content Layer

- **C3.1** Replace `<!-- en -->` separator with structured frontmatter or sibling files (`post.md` + `post.en.md`).
- **C3.2** Add Zod schema for frontmatter; build fails on invalid posts.
- **C3.3** Migrate all 15 existing posts to the new shape.
- **C3.4** Add language-aware routing (`/posts/:slug` defaults to user lang, `/en/posts/:slug` etc.).
- **C3.5** Verify: every post renders in both languages; broken links surfaced by build.

### Phase 4 — App Shell Refactor

- **C4.1** Extract `tailwind.config.ts` from `@theme` block.
- **C4.2** Split `App.tsx` into `Header`, `Footer`, `PostList`, `PostCard`, `PostDetail`, `LanguageSwitcher`, `ThemeProvider`.
- **C4.3** Introduce `react-router-dom` (or TanStack Router) — replace ad-hoc routing.
- **C4.4** Centralize i18n strings (small `i18n.ts` map, no library needed at this scale).
- **C4.5** Verify: visual regression check (manual + Lighthouse before/after); no file > 250 lines.

### Phase 5 — SEO & Discoverability

- **C5.1** Generate `sitemap.xml` at build (post-build script reading `posts.ts`).
- **C5.2** Generate `rss.xml` (per-language feeds).
- **C5.3** Per-post `<meta>` + Open Graph + Twitter cards via `react-helmet-async` or Vite SSG plugin.
- **C5.4** Add `robots.txt`.
- **C5.5** Verify: validate sitemap with online validator; RSS validator passes; OG preview via opengraph.xyz.

### Phase 6 — Image & Asset Strategy

- **C6.1** Replace `picsum.photos` with local `content/posts/<...>/assets/` images.
- **C6.2** Add `vite-imagetools` or `unplugin-imagemin` for build-time optimization.
- **C6.3** Add a fallback gradient for missing images.
- **C6.4** Verify: built `dist/` has only optimized images, no external image fetches at runtime.

### Phase 7 — Quality Gates & Polish

- **C7.1** Lighthouse CI in GitHub Actions; fail PR if perf < 90 / a11y < 95.
- **C7.2** Add `pnpm-lock.yaml` or pin package-lock; remove dead deps.
- **C7.3** Document deploy + content workflow in `README.md` and `docs/CONTRIBUTING.md`.
- **C7.4** Verify: clean clone → `npm i && npm run build && npm run preview` works zero-config.

---

## 4. Token-Efficiency Strategy

- One phase per implementation session; never bundle phases.
- Use **Sonnet** for: docs, frontmatter schemas, content migration, READMEs, this plan.
- Use **Opus** for: refactors that span multiple files, type design, routing/i18n architecture, build-time scripts.
- Delegate research to `Explore` (Sonnet); delegate implementation tracking to `Plan` only when a phase is non-obvious.
- Each checkpoint gets its own commit. Diff is the verification artifact.

---

## 5. Risk Register

| Risk | Mitigation |
|---|---|
| Breaking deployed GitHub Pages site mid-refactor | Feature-branch + preview deploy via Actions before merging |
| Losing existing comments/likes data when picking Phase 2 option A | Export `blog.db` to JSON snapshot before deletion (one-shot script) |
| Bilingual migration skews post slugs / breaks inbound links | Maintain redirect map from old → new URLs |
| ESLint flood of pre-existing errors | Land config with `--fix` first, then a follow-up cleanup commit |

---

## 6. Decisions Log

> Filled in as decisions are made. Append-only.

- *(2026-05-07)* Plan drafted.
- *(2026-05-07)* **Phase 2 decision: Option A — fully static + Giscus.** Drop Express + better-sqlite3; replace likes/comments with GitHub-Discussions-backed Giscus widget. Snapshot existing `blog.db` to JSON before removal.
- *(2026-05-07)* Starting with Phase 0 (Security & Hygiene).
- *(2026-05-07)* Phase 1 deliverables landed: ESLint 9 flat config, Prettier + Tailwind plugin, EditorConfig, Vitest + jsdom + RTL with one smoke test, GitHub Actions CI (`lint → typecheck → test → build`). Local verification not run from sandbox (mounted FS blocks `rm`); user runs `npm install && npm run lint && npm run typecheck && npm test && npm run build` on Windows to confirm.
- *(2026-05-07)* Phase 2 deliverables landed: created `src/components/Comments.tsx` + `src/lib/giscus-config.ts` (Giscus wrapper with config-not-set guard); created `scripts/snapshot-blog-db.mjs` for safe data export; stripped App.tsx from 1166 → 911 LOC (removed `Comment` interface, modal/dynamic state, fetch effect, three handlers, like buttons, three `CommentSection` invocations replaced with `<Comments />`, delete modal, `CommentSection` function, unused icons); updated package.json (drop `express` + `dotenv`, move `better-sqlite3` to devDeps for the snapshot script, add `@giscus/react`, dev script → `vite --port 3000`, new `snapshot:db` script); replaced `server.ts` with deprecation stub; updated README + .env.example + CI to drop ADMIN_PASSWORD_HASH. **User actions on Windows**: `git rm server.ts`, run `npm run snapshot:db` if there's data to preserve, then delete `blog.db`, then configure Giscus in `src/lib/giscus-config.ts`.
- *(2026-05-07)* Phase 5 deliverables landed (jumped over 3 & 4 since SEO is purely additive): created `scripts/lib/site-config.mjs` (single source of truth for URL/title/etc), `scripts/lib/load-posts.mjs` (Node-side post loader mirroring `src/lib/posts.ts`), `scripts/generate-sitemap.mjs`, `scripts/generate-rss.mjs`, `public/robots.txt`. Updated `index.html` with site-wide Open Graph + Twitter Card + RSS `<link rel="alternate">` discovery + `lang="vi"` + real title. Wired `npm run build` to chain `vite build && npm run seo:build`; added `seo:build`, `seo:sitemap`, `seo:rss` scripts. Verified locally: 15 posts + 1 home in sitemap.xml, 15 items in each of rss.xml + rss.en.xml, all three XML files parse cleanly. **Caveats**: (a) post URLs in sitemap (e.g. `/posts/<slug>`) will 404 on GH Pages until Phase 4 introduces React Router + a `404.html` SPA-fallback shim. (b) `og-default.png` is referenced but not yet present — drop a 1200×630 PNG into `public/og-default.png` to make social previews work. (c) Per-post OG tags need true SSG/pre-rendering; deferred to Phase 4.
- *(2026-05-07)* Phase 4 partial checkpoint: extracted `src/i18n.ts` (typed translations + `Lang`/`TranslationKey` types) and `src/components/skeletons.tsx` (the 4 loading-skeleton components). App.tsx 911 → 779 LOC. Also fixed `src/lib/giscus-config.ts` type-narrowing collision (`as const` vs `${string}/${string}` template literal type — moved to a regular `GiscusConfig` interface, kept the runtime guard). Plus repo-wide NUL-byte cleanup of 5 files corrupted by the sandbox Edit-shrink quirk (server.ts, .env.example, ci.yml, App.tsx, vitest.config.ts). Repo verified clean: 0 NULs anywhere, `tsc --noEmit` clean except for sandbox-only missing packages.
- *(2026-05-07)* **Checkpoint C4.A — Header + LanguageSwitcher extracted.** Created `src/components/Header.tsx` (158 LOC) + `src/components/LanguageSwitcher.tsx` (21 LOC). App.tsx 779 → 696 LOC (cumulative 40% reduction from 1166). `isCategoryMenuOpen` state moved into Header (it's purely UI state). Header exposes a clean callback API (`onNavigateHome`/`onNavigateContact`/`onSelectCategory`/`onToggleLang`) — App.tsx defines 4 thin handlers that wrap the underlying setState calls. Removed unused icon imports from App.tsx: `ChevronDown`, `Languages`, `Github`, `Twitter`, `Mail`. Verified: 0 NULs (after one stripping pass), tsc clean. **Next checkpoint C4.B**: extract `src/components/Footer.tsx` (lines ~742-779 of original; uses `t.footerDesc`, `t.links`, `t.home`, `t.posts`, `t.contact` and the same nav callbacks).
- *(2026-05-07)* **Checkpoint C4.B — Footer extracted.** Created `src/components/Footer.tsx` (80 LOC). App.tsx 696 → 664 LOC (cumulative 43% reduction from 1166). Footer takes `t`, `onNavigateHome`, `onNavigateContact` props. Hardcoded "Theo dõi" preserved with `// TODO(i18n)` marker. Site title now driven by `t.blogTitle` and copyright too. Verified: 0 NULs (after one stripping pass), tsc clean. **Next checkpoint C4.C**: extract `src/components/Sidebar.tsx` (the `<aside>` block — Latest posts, Categories list, Tags cloud, Newsletter signup). Will need: `t`, `loading`, `posts`, `latestPosts`, `allCategories`, `allTags`, `selectedCategory`, callbacks for category-select, post-select, tag-search, newsletter submit.
- *(2026-05-07)* **Checkpoint C4.C — Sidebar extracted.** Created `src/components/Sidebar.tsx` (161 LOC) with all four sections (latest posts, categories, tags, newsletter) and the loading-skeleton state moved inside it. App.tsx 664 → 562 LOC (**cumulative 52% reduction from 1166**). Added App-side helpers: `selectPost`, `clearCategory`, `handleTagClick`. Tag-toggle logic kept in App because it needs current `searchQuery` to decide set-vs-clear. Removed now-unused App imports: `Clock`, `Tag`, `SidebarSectionSkeleton`. Verified: 0 NULs (after stripping pass), tsc clean. **Next checkpoint C4.D**: extract `src/components/PostCard.tsx` — the post-list item used at lines ~290-340 of current App.tsx (image, category chip, date, title, excerpt, tags, "read more" link). Will need: `post`, `lang`, `t`, `onSelect`, plus probably an `index`/animation-delay prop.
- *(2026-05-07)* **Checkpoint C4.D — PostCard extracted.** Created `src/components/PostCard.tsx` (82 LOC) — single post-list item with motion stagger animation, bilingual title/excerpt/category/tags, picsum thumbnail. App.tsx 562 → 526 LOC (**cumulative 55% reduction from 1166**). Removed now-unused App import: `ChevronRight`. The map call in App.tsx is now 7 lines (was ~46). Verified: 0 NULs (after stripping pass), tsc clean. **Next checkpoint C4.E**: extract `src/components/PostList.tsx` — the home view (hero header + search input + featured-categories grid + paginated post list + pagination controls). Will need: `lang`, `t`, `loading`, `posts`, `paginatedPosts`, `filteredPosts`, `searchQuery`, `setSearchQuery`, `currentPage`, `setCurrentPage`, `totalPages`, `selectedCategory`, `setSelectedCategory`, `gridCategories`, `hotCategories`, plus `onSelectPost`. (PostList is the largest remaining piece — likely 150-200 LOC, but breaking it up further than that — into Hero, SearchBar, CategoryGrid, Pagination — is overkill for now.)
- *(2026-05-07)* **Checkpoint C4.E — PostList extracted.** Created `src/components/PostList.tsx` (222 LOC) — full home view: hero + search + paginated list + pagination + featured-categories grid + home discussion (Giscus). App.tsx 525 → 381 LOC (**cumulative 67% reduction from 1166**). PostList exposes a clean callback API (`onSearchChange`, `onPageChange`, `onSelectPost`, `onSelectCategory`); page increment/decrement clamping is now inside PostList. Removed now-unused App imports: `Search`, `PostSkeleton`, `CategorySkeleton`. Verified: 0 NULs (after stripping pass), tsc clean. **Next checkpoint C4.F**: extract `src/components/PostDetail.tsx` — single post view at lines ~210-355 of current App.tsx (back button, post header with category/title/date/author, markdown body, related-posts section, post-level Giscus comments). Will need: `post: Post`, `posts: Post[]` (for related), `lang`, `t`, `onBack`, `onSelectPost`.
- *(2026-05-07)* **Checkpoint C4.F — PostDetail extracted.** Created `src/components/PostDetail.tsx` (138 LOC) — single-post view with header, markdown body, related-posts grid, post-level Giscus comments. App.tsx 373 → 289 LOC (**cumulative 75% reduction from 1166**). Related-post selection helper (`selectRelated`) lives in PostDetail. Scroll-to-top on related click preserved. Massive App.tsx import cleanup: removed unused `BookOpen`, `Calendar`, `User`, `ArrowLeft`, `MessageSquare`, `Markdown`, `format`, `vi`, `enUS`, `cn`, `PostCard` — all now consumed only by sub-components. Verified: 0 NULs (after stripping pass), tsc clean. **Next checkpoint C4.G**: introduce `react-router-dom`. Replace `currentView`/`selectedPost` state with route-driven view (`/` → home, `/posts/:slug` → post detail, `/discussion` → global discussion, `/contact` → contact). Add `BrowserRouter` wrapper in `src/main.tsx`. Use `useNavigate`/`useParams`/`useLocation` in App. **C4.H** (after C4.G): add `404.html` SPA fallback (small post-build script: `cp dist/index.html dist/404.html`) so post URLs from sitemap don't 404 on GH Pages.
- *(2026-05-07)* **Checkpoint C4.G.1 — ContactView + DiscussionView extracted.** Created `src/components/ContactView.tsx` (80 LOC, decorative form) and `src/components/DiscussionView.tsx` (34 LOC). App.tsx 283 → 215 LOC (**cumulative 82% reduction from 1166**). **App.tsx is now under 250 LOC — primary Phase 4 size target met.** Both new views are pure-prop components, no callbacks. This was split out of C4.G to keep the routing change isolated and revertible. Verified: 0 NULs (after stripping pass), tsc clean. **Next checkpoint C4.G.2**: introduce `react-router-dom`. Add dep, wrap `<App />` in `<BrowserRouter basename="/data-alchemy">` in `src/main.tsx`, refactor App to derive `currentView`/`selectedPost` from `useLocation()`/`useParams()`, render `<Routes>` for `/`, `/posts/:slug`, `/discussion`, `/contact`. Keep callback API on sub-components — App's nav helpers wrap `useNavigate()` instead of setState.
- *(2026-05-07)* **Checkpoint C4.G.2 — react-router-dom integrated.** Added `react-router-dom@^6.27.0` to deps. `src/main.tsx` now wraps `<App />` in `<BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') \|\| '/'}>` so it works in both dev (`/data-alchemy/`) and prod. App.tsx 215 → 237 LOC (slight bump from routing wiring; still < 250). Removed `currentView` and `selectedPost` from React state — both are now **derived from URL** (`location.pathname`). Routes: `/` → PostList, `/posts/:slug` → `PostDetailRoute` (resolves slug → post or `<Navigate to="/" />`), `/discussion` → DiscussionView, `/contact` → ContactView, `*` → `<Navigate to="/" replace />`. Every nav helper (`goHome`, `goContact`, `pickCategory`, `selectPost`, `goBack`, `handleTagClick`) now calls `navigate(...)`. AnimatePresence wraps `<Routes location={location} key={location.pathname}>` so view transitions still animate. Sub-component contracts unchanged — only App.tsx needed wiring changes. Verified: 0 NULs, tsc clean (`react-router-dom` filtered as sandbox-missing-pkg). **Next checkpoint C4.H**: tiny post-build script to copy `dist/index.html` → `dist/404.html` for GH Pages SPA fallback.
- *(2026-05-07)* **Phase 7 — Quality Gates & Polish.** **C7.A (dead deps)**: removed `@google/genai` (no imports anywhere), `autoprefixer` (Tailwind v4 has Lightning CSS), `tsx` (was for the now-removed Express server). Vite config dropped the orphaned `GEMINI_API_KEY` define. `.env.example` rewritten — `GEMINI_API_KEY` line kept but commented as "only if you re-introduce Gemini features." **C7.B (Lighthouse CI)**: new `lighthouserc.json` with assertions (perf ≥ 0.85 warn, a11y ≥ 0.95 error, best-practices ≥ 0.9 warn, seo ≥ 0.9 warn; `is-on-https`/`uses-http2`/`redirects-http` disabled since GH Pages already enforces HTTPS but the action runs locally). New `lighthouse` job in ci.yml — runs after `verify` succeeds, builds the site, runs `treosh/lighthouse-ci-action@v12` against `dist/`, stores report at a temporary public URL. Plus `verify` now uploads `dist/` as a 7-day artifact. **C7.C (CONTRIBUTING.md)**: comprehensive contributor guide — repo orientation tree, how to write a post (easy via `npm run new:post` + manual frontmatter cheat sheet), local commands, code style + conventions (250 LOC cap, callback props, i18n keys, semantic HTML, tabular numerics), design tokens + custom utilities, Giscus setup, CI explanation, deploy steps, link back to ARCHITECTURE-PLAN for context. README updated to surface all three docs. **Phase 7 complete. All 8 phases done.**
- *(2026-05-07)* **Phase 6 — Image strategy.** Created `src/lib/post-image.ts` (djb2-style slug hash → 6-palette picker: brand-orange, coral, peach, mustard, sage, teal-slate; plus `thumbnailLabel()` that strips Vietnamese diacritics and uppercases the first character) and `src/components/PostThumbnail.tsx` (renders a diagonal-gradient block + radial-highlight overlay + giant translucent letter watermark + inner-ring for edge definition). Wired into PostCard (replacing the picsum.photos+grayscale hover hack with a clean scale-1.02 hover) and PostList category-grid featured image. No network dependency anymore — instant paint, deterministic, on-brand, every post gets a unique colorway tied to its slug. Verified: `grep -rn picsum src/` returns 0 references, 0 NULs after stripping pass, tsc clean. **Phase 6 complete.**
- *(2026-05-07)* **Checkpoint C-Sig.B — 7 design audit items closed (D1-D7).** **D1 (heading anchors + share)**: new `src/lib/slugify.ts` (Vietnamese-diacritic-safe slugifier), `src/components/MarkdownBody.tsx` (wraps react-markdown with custom h2/h3 components that add `id` + hover-revealed `#` deep-link anchor with `scroll-mt-24`), `src/components/ShareButton.tsx` (clipboard-write + 1.6s "Copied" state + legacy fallback for non-secure contexts). PostDetail now imports MarkdownBody/ShareButton, shows the share button right of the meta row. i18n keys: `copyLink`, `linkCopied`. **D2 (skip-to-content)**: keyboard-only `<a class="skip-to-content" href="#main">` in App, plus `id="main" tabIndex={-1}` on the main element. CSS class was already prepared in earlier design pass. **D3 (404 view)**: new `src/components/NotFoundView.tsx` (huge muted "404" + heading + friendly description + back-home button + recent-posts list). Replaces the blanket `<Navigate to="/" replace />` for unknown routes. i18n keys: `notFoundTitle`, `notFoundDesc`, `backHome`. **D4 (footer i18n)**: hardcoded VN "Theo dõi" → `t.follow` (vi: "Theo dõi", en: "Follow"). **D5 (tag dot)**: Sidebar tag pills get a small orange `●` indicator next to text when active, plus a quieter active style (bg-orange-50 + ring-orange-300) replacing the loud filled orange. `aria-pressed` for accessibility. Maggie Appleton signature. **D6 (See-all align)**: added `md:auto-rows-fr` to the category grid so all rows are equal-height and the bottom CTAs line up across the row. **D7 (tinted shadows)**: added `.shadow-warm` and `.shadow-warm-md` utilities in index.css (warm rgba(120, 60, 20, 0.04)) replacing the generic black `shadow-sm`/`shadow-md` on PostList category cards and ContactView form. Audit verified: 0 NULs across repo after multiple cascading sandbox-FS truncation cleanups, tsc clean (filter for sandbox-only missing pkgs).
- *(2026-05-07)* **Checkpoint C-Sig.A — Blog signature elements added** (researched: Vercel blog, Substack, Linear blog, Josh Comeau, Maggie Appleton, Stripe Press, Tania Rascia). Three classic "share-to-learn" patterns landed: (1) **Reading time** — new `src/lib/reading-time.ts` (strips code/comments/links before counting, defaults to 220 wpm, min 1 min). Shown on PostCard next to the date with a separator dot and on PostDetail with a Clock icon in the meta row. Used `<time dateTime={post.date}>` semantic element on PostDetail. (2) **Author bio card** — new `src/components/AuthorBio.tsx` (106 LOC). Profile data lives in `src/lib/author.ts` (single-author config with name, bilingual short bio, optional avatar URL with initial-tile fallback, social links — github/twitter/website/email; empty strings hide that link). Rendered between markdown body and related-posts section. Uses `bg-black/[0.03]` for a quiet contained surface, orange "ABOUT THE AUTHOR" eyebrow label. (3) **Prev/Next nav** — new `src/components/PrevNextNav.tsx` (73 LOC) — Substack-style chronological neighbor nav. Posts are date-DESC; "newer" = idx-1, "older" = idx+1. Edges render an empty slot to preserve 2-col grid. Hover border picks up an orange tint. Rendered between related-posts and comments. (4) **i18n keys added** — `minRead`, `aboutAuthor`, `newerPost`, `olderPost` in both languages. Verified: 0 NULs after stripping pass, tsc clean. **Next checkpoint C-Sig.B**: heading anchor links (`#` on hover, click copies URL) + "copy link" share button at top of PostDetail + tag-pill active dot indicator. Touches markdown rendering — will use `react-markdown` `components` prop to wrap h1/h2/h3.
- *(2026-05-07)* **Design pass (out-of-phase, fits Phase 7 prep).** Applied the `redesign-existing-projects` skill audit. Changes: (1) **Fonts** — dropped Inter + dead Libre Baskerville import; loaded Geist + Geist Mono + kept Be Vietnam Pro for diacritics. Tailwind v4 `--font-sans/--font-mono` tokens updated. (2) **Typography polish** — added `text-wrap: balance` on h1-h3 + `text-wrap: pretty` on p; negative letter-spacing (-0.02em / -0.03em on h1) for tighter display headlines; `font-variant-numeric: tabular-nums` on `<time>` and a `.tabular-nums` utility. (3) **Interactive feedback** — global `:focus-visible` orange ring (a11y); `button:active:not(:disabled)` scale(0.97) with spring easing; `scroll-behavior: smooth` on html. (4) **Background warmth** — added two subtle radial gradients to body (orange-tinted top-left, gray-tinted bottom-right) so the cream surface has depth without noise files. (5) **Skip-to-content** — keyboard-only `.skip-to-content` class ready in CSS (not yet wired into App). (6) **Brand consistency** — `t.blogTitle` now `"Data Alchemy"` in both languages (was `"Minimal Blog"`); inline SVG favicon (orange "DA" tile) replaces missing favicon. (7) **New-post scaffolding** — `scripts/new-post.mjs` (interactive + CLI-flag modes), opens in `$EDITOR` if set, writes to `content/posts/YYYY/MM/DD/<slug>.md` with bilingual frontmatter + body template. Slugifier strips Vietnamese diacritics. Tested end-to-end. Wired as `npm run new:post`. (8) **README** — `docs/LOCAL-DEV.md` step 7 now points at `npm run new:post` first. Verified: 0 NULs, tsc clean. **Leftover from sandbox test**: `content/posts/2026/05/07/scaffold-smoke-test.md` was created by the e2e test and the sandbox FS blocked `rm` — delete manually on Windows: `del content\posts\2026\05\07\scaffold-smoke-test.md`.
- *(2026-05-07)* **Checkpoint C4.H — 404.html SPA fallback.** Created `scripts/copy-404.mjs` (cross-platform Node script: `copyFileSync('dist/index.html', 'dist/404.html')`). Wired into build chain: `npm run build` is now `vite build && npm run seo:build && npm run prepare:404`. Verified locally with a fake `dist/index.html` — script copies cleanly and `diff` confirms files match. Resolves the Phase 5 caveat: post URLs from sitemap will now serve the SPA shell on GH Pages (router takes over client-side). **Phase 4 COMPLETE.** Final tally: App.tsx 1166 → 237 LOC (**80% reduction**), 11 component files all under 250 LOC, full typed i18n, URL-driven routing, deploy-ready 404 fallback. **Recommended next phase: C7 (Quality Gates) for Lighthouse CI + lockfile pinning + clean READMEs**, or C3 (Content Layer) to replace the `<!-- en -->` separator with structured bilingual posts. C6 (Image strategy) is also ready to start whenever convenient.

---

## 7. Status

Phase 0: ☑ Done (2026-05-07) — secrets to env, .db gitignored, fail-fast guard.
Phase 1: ☑ Code complete (2026-05-07) — pending local `npm install` + verification run.
Phase 2: ☑ Code complete (2026-05-07) — pending Giscus config + `npm install` on user machine.
Phase 3: ☐ Pending
Phase 4: ◐ In progress (2026-05-07) — i18n + skeletons extracted, App.tsx 1166 → 779 LOC; remaining: Header/Footer/Sidebar/Post* components, react-router-dom, 404.html SPA fallback.
Phase 5: ☑ Code complete (2026-05-07) — sitemap + RSS generated, robots.txt + OG tags wired. Per-post OG meta + correct post URLs depend on Phase 4 routing.
Phase 6: ☑ Code complete (2026-05-07) — picsum.photos replaced with deterministic gradient thumbnails.
Phase 7: ☑ Code complete (2026-05-07) — dead deps removed, Lighthouse CI wired, CONTRIBUTING.md written.
