/**
 * Giscus configuration.
 *
 * Setup steps:
 *   1. Enable Discussions on your GitHub repo (Settings → General → Features).
 *   2. Install the Giscus app: https://github.com/apps/giscus
 *   3. Visit https://giscus.app, fill in your repo + category, and copy the
 *      generated `data-repo-id`, `data-category`, `data-category-id` values
 *      into the constants below.
 *
 * If `repo` or `repoId` is empty, the <Comments /> component renders a small
 * "not yet configured" placeholder instead of throwing. This keeps the app
 * runnable until you finish the giscus setup.
 */

export interface GiscusConfig {
  /** Format: 'username/repo'. e.g. 'TrietNV/data-alchemy' */
  repo: string;
  /** From https://giscus.app — looks like 'R_kgDOXXXXXX' */
  repoId: string;
  /** Discussion category name. 'General' is the GitHub default. */
  category: string;
  /** From https://giscus.app — looks like 'DIC_kwDOXXXXXX' */
  categoryId: string;
}

export const GISCUS_CONFIG: GiscusConfig = {
  repo: '',
  repoId: '',
  category: 'General',
  categoryId: '',
};

export type GiscusRepo = `${string}/${string}`;

/** Returns true when all four fields are non-empty and `repo` looks like 'owner/name'. */
export function isConfigured(c: GiscusConfig): boolean {
  return Boolean(c.repo && c.repo.includes('/') && c.repoId && c.categoryId);
}
