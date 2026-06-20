/**
 * GitHub Pages SPA fallback.
 *
 * GH Pages serves `404.html` for any URL that doesn't map to a real file.
 * For a single-page app served at `/data-alchemy/`, that means deep links
 * like `/data-alchemy/posts/some-slug` would 404 — UNLESS we copy
 * `dist/index.html` to `dist/404.html` so GH Pages serves the same SPA bundle
 * for every unknown path. The router then takes over client-side.
 *
 * Run after `vite build`. Wired into `npm run build` via package.json.
 */
import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const src = join(__dirname, '..', 'dist', 'index.html');
const dst = join(__dirname, '..', 'dist', '404.html');

if (!existsSync(src)) {
  console.error('[404] dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

copyFileSync(src, dst);
console.log('[404] copied dist/index.html → dist/404.html (SPA fallback for GH Pages)');
