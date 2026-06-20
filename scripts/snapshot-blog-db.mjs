/**
 * One-shot snapshot script: dump everything in blog.db to a JSON file.
 *
 * Run BEFORE removing Express + better-sqlite3 if you have any real
 * comments/likes you want to preserve. After this runs, the JSON file
 * is the only record — Phase 2 of the architecture migration drops the
 * Express server and the SQLite database is no longer used.
 *
 * Usage:
 *   node scripts/snapshot-blog-db.mjs
 *
 * Output: blog-db-snapshot-<timestamp>.json in the repo root.
 */
import Database from 'better-sqlite3';
import { writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '..', 'blog.db');

if (!existsSync(dbPath)) {
  console.log(`No blog.db found at ${dbPath} — nothing to snapshot. Safe to skip.`);
  process.exit(0);
}

const db = new Database(dbPath, { readonly: true });

const likes = db.prepare('SELECT slug, count FROM likes ORDER BY slug').all();
const comments = db
  .prepare('SELECT id, slug, author, content, created_at FROM comments ORDER BY created_at')
  .all();

db.close();

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outPath = path.resolve(__dirname, '..', `blog-db-snapshot-${stamp}.json`);

writeFileSync(
  outPath,
  JSON.stringify(
    {
      snapshotAt: new Date().toISOString(),
      counts: { likes: likes.length, comments: comments.length },
      likes,
      comments,
    },
    null,
    2,
  ),
  'utf8',
);

console.log(`Snapshot written: ${outPath}`);
console.log(`  ${likes.length} like rows, ${comments.length} comment rows.`);
console.log('It is now safe to drop blog.db and the Express server.');
