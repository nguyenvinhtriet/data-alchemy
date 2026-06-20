<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/50579306-cd16-4ee6-b208-7b139dff552c

## Run Locally

**Prerequisites:**  Node.js 20+

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and fill in `GEMINI_API_KEY` (only needed if you use Gemini features).
3. Run the app: `npm run dev`

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server on port 3000. |
| `npm run build` | Build production bundle to `dist/`. |
| `npm run preview` | Preview built bundle. |
| `npm run deploy` | Build + push `dist/` to GitHub Pages. |
| `npm run lint` | ESLint over the codebase. |
| `npm run lint:fix` | ESLint with `--fix`. |
| `npm run format` | Prettier write over the codebase (skips `content/` posts). |
| `npm run format:check` | Prettier check (no write). |
| `npm run typecheck` | TypeScript `--noEmit` check. |
| `npm run test` | Vitest one-shot. |
| `npm run test:watch` | Vitest watch mode. |
| `npm run snapshot:db` | One-shot dump of the legacy `blog.db` to JSON (only useful before deleting the DB). |

CI runs `lint → typecheck → test → build` on every push/PR — see [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Comments (Giscus)

Comments are powered by [Giscus](https://giscus.app), backed by GitHub Discussions on this repo. To enable them:

1. Enable Discussions on the repo (Settings → General → Features).
2. Install the [Giscus app](https://github.com/apps/giscus) on the repo.
3. Visit [giscus.app](https://giscus.app), enter the repo and discussion category, and copy the generated `data-repo-id`, `data-category`, and `data-category-id` values.
4. Paste them into [`src/lib/giscus-config.ts`](src/lib/giscus-config.ts).

Until step 4 is done, the comment areas show a small "not yet configured" placeholder instead of throwing.

## Docs

- [`docs/LOCAL-DEV.md`](docs/LOCAL-DEV.md) — full local setup walkthrough (prerequisites → first dev server → first deploy).
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — repo orientation, how to write a post, code style, CI, design tokens.
- [`docs/ARCHITECTURE-PLAN.md`](docs/ARCHITECTURE-PLAN.md) — phase-by-phase migration log for every architectural decision.
