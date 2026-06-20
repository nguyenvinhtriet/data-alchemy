/**
 * DEPRECATED — kept temporarily to preserve git history; safe to delete.
 *
 * As of Phase 2 of the architecture migration this file is no longer used.
 * The Express + better-sqlite3 backend has been removed in favor of static
 * deployment with Giscus (GitHub-Discussions-backed comments).
 *
 * The dev server is now plain `vite` — see package.json scripts.
 *
 * To remove this file from your repo:
 *   git rm server.ts
 *   git commit -m "Remove deprecated Express server"
 *
 * If you have data in blog.db you want to preserve, run:
 *   npm run snapshot:db
 * before deleting the database file.
 *
 * See docs/ARCHITECTURE-PLAN.md §Phase 2 for the full rationale.
 */
export {};
