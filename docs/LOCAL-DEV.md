# Running data-alchemy locally

Step-by-step for Windows / PowerShell. Mac/Linux is identical except where noted.

## Prerequisites

- **Node.js 20+** — check with `node -v`. Get it from https://nodejs.org or via `winget install OpenJS.NodeJS.LTS`.
- **Git** — `git --version`. Already installed if you cloned this repo.

That's it. No Python, no Docker, no global npm packages.

## 1. One-time setup

```powershell
cd C:\Users\User\github\data-alchemy

# Pull dependencies. Re-run anytime package.json changes.
npm install
```

`npm install` will install ~600 packages (~250 MB in `node_modules/`). Takes 30–90 seconds depending on cache.

## 2. Clean up the deprecated Express server

Phase 2 of the architecture migration replaced the Express + SQLite backend with Giscus (static-only). The old `server.ts` is now a deprecation stub — delete it from git:

```powershell
# Optional: snapshot any data in blog.db first (only if you wrote real comments).
npm run snapshot:db

# Then drop the deprecated files.
git rm server.ts
del blog.db                 # PowerShell;  Mac/Linux:  rm blog.db
git commit -m "Remove deprecated Express server"
```

If you never used the comment system, you can skip the `snapshot:db` step — there's nothing to preserve.

## 3. Configure environment

Copy the example file:

```powershell
copy .env.example .env       # PowerShell;  Mac/Linux:  cp .env.example .env
```

Open `.env` and fill in `GEMINI_API_KEY` if you use Gemini features. Otherwise leave it. (Phase 0 used to require `ADMIN_PASSWORD_HASH` — it's gone now that the Express server is gone.)

## 4. Verify everything builds

```powershell
npm run lint        # ESLint — warnings ok, errors are real bugs
npm run typecheck   # TypeScript — should be silent
npm test            # Vitest — one smoke test should pass
npm run build       # vite build → sitemap → rss → 404 fallback
```

All four should exit `0`. The `build` step writes to `dist/`:

```
dist/
├── index.html
├── 404.html              ← SPA fallback (Phase 4 C4.H)
├── assets/...            ← bundled JS/CSS
├── sitemap.xml           ← Phase 5
├── rss.xml               ← Phase 5
├── rss.en.xml            ← Phase 5
└── robots.txt            ← Phase 5 (copied from public/)
```

## 5. Run the dev server

```powershell
npm run dev
```

Open <http://localhost:3000/data-alchemy/> (the `/data-alchemy` prefix is the production base path — Vite uses it in dev too so links match).

You'll see:

- Posts list at `/`
- Click a post → URL changes to `/posts/<slug>`
- "Discussion" link → `/discussion`, "Contact" → `/contact`
- Comments will render as a "not yet configured" placeholder until you do step 6.

Hot-reload is on. Edit any `src/**/*.tsx` and the page updates instantly.

## 6. Enable Giscus comments (optional)

Comments are powered by GitHub Discussions through Giscus. Until you wire it up, all comment areas show a small "not yet configured" placeholder — the rest of the app works fine.

1. Go to your repo on GitHub → **Settings → General → Features** → tick **Discussions**.
2. Install the **Giscus** GitHub app: <https://github.com/apps/giscus>. Grant it access to this repo.
3. Visit <https://giscus.app> and fill in:
   - Repository: `TrietNV/data-alchemy` (or whatever your fork is named)
   - Category: pick one, e.g. `General`
   - Mapping: leave as `Specific term`
4. Scroll down — you'll see a generated `<script>` tag with `data-repo-id`, `data-category`, `data-category-id` attributes.
5. Open `src/lib/giscus-config.ts` and paste those values:

   ```ts
   export const GISCUS_CONFIG: GiscusConfig = {
     repo: 'TrietNV/data-alchemy',
     repoId: 'R_kgDOXXXXXX',
     category: 'General',
     categoryId: 'DIC_kwDOXXXXXX',
   };
   ```

6. Refresh the dev server — comments should now load.

## 7. Adding a new post

Easiest path — run the scaffolding script:

```powershell
npm run new:post
```

It prompts you for title (VI + EN), slug (auto-generated from title if blank), date (default: today), excerpt, category, tags, author. Then it creates the MD file under the correct `content/posts/YYYY/MM/DD/<slug>.md` path with proper frontmatter and a bilingual template body.

If you have `$env:EDITOR = "code"` (VS Code) set, it opens the file automatically.

Non-interactive (for scripting):

```powershell
npm run new:post -- `
  --title "Tiêu đề" `
  --title-en "Title" `
  --slug my-post `
  --category "Công nghệ" `
  --tags "Web Dev,React"
```

Manual fallback — just create the file yourself with this frontmatter:

```yaml
---
title: "Tiêu đề tiếng Việt"
title_en: "English Title"
date: "2026-05-07"
excerpt: "Mô tả ngắn..."
excerpt_en: "Short description..."
author: "Triet"
tags: ["Web Dev"]
tags_en: ["Web Dev"]
category: "Công nghệ"
category_en: "Technology"
---

# Nội dung tiếng Việt

...

<!-- en -->

# English content

...
```

The Vietnamese content goes above the `<!-- en -->` separator, English below. Save the file — Vite picks it up immediately via HMR.

(Phase 3 of the architecture plan will replace this separator pattern with sibling files + Zod-validated frontmatter, but the current shape works.)

## 8. Deploy to GitHub Pages

```powershell
npm run deploy
```

This runs `npm run build` then pushes `dist/` to the `gh-pages` branch via the `gh-pages` package. Within ~1 minute, your site updates at `https://trietnv.github.io/data-alchemy/`.

After your first deploy, in your repo's **Settings → Pages**, set source to **Deploy from a branch → `gh-pages` / root**.

## Common scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build + sitemap + RSS + 404 fallback |
| `npm run preview` | Serve `dist/` locally to test the production build |
| `npm run deploy` | Build + push to GitHub Pages |
| `npm run lint` | ESLint over the codebase |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run format` | Prettier write (skips `content/`) |
| `npm run format:check` | Prettier check (no write) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest one-shot |
| `npm run test:watch` | Vitest watch mode |
| `npm run snapshot:db` | Dump legacy `blog.db` to JSON (one-shot) |
| `npm run new:post` | Scaffold a new bilingual MD post (interactive prompts or `-- --title ...` flags) |

## Troubleshooting

**"Cannot find module 'react-router-dom'" / similar** — you skipped step 1. Run `npm install`.

**Comments show "not yet configured"** — finish step 6.

**Site at GitHub Pages 404s on post URLs** — the `404.html` SPA fallback should fix this. Make sure `npm run build` completed successfully (check `dist/404.html` exists) before deploying.

**Dev server shows "Cannot GET /"** — you opened `http://localhost:3000` instead of `http://localhost:3000/data-alchemy/`. The base path is set in `vite.config.ts` to match production.

**ESLint floods on App.tsx-related files** — warnings are expected on legacy code. CI fails only on errors. If you see actual errors, paste them and I'll fix.

**Architecture / refactor questions** — see `docs/ARCHITECTURE-PLAN.md` for the full migration plan with phase-by-phase status.
