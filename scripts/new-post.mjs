/**
 * Scaffold a new blog post.
 *
 * Usage:
 *   npm run new:post                         # interactive prompts
 *   npm run new:post -- --title "..." \
 *                       --title-en "..." \
 *                       --slug my-slug \
 *                       --category "Công nghệ"
 *
 * Writes to: content/posts/YYYY/MM/DD/<slug>.md
 *
 * The file is opened in your default editor if you have one configured via
 * the EDITOR env var (e.g. `set EDITOR=code` on Windows, `export EDITOR=code`
 * on macOS/Linux).
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { spawn } from 'child_process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const POSTS_ROOT = join(REPO_ROOT, 'content', 'posts');

/** Parse `--key value` and `--key=value` from process.argv. Returns a flat record. */
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith('--')) continue;
    const eqIdx = tok.indexOf('=');
    if (eqIdx !== -1) {
      out[tok.slice(2, eqIdx)] = tok.slice(eqIdx + 1);
    } else {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        out[tok.slice(2)] = next;
        i++;
      } else {
        out[tok.slice(2)] = true;
      }
    }
  }
  return out;
}

/** Slugify any string to URL-safe ASCII kebab-case. Strips Vietnamese diacritics. */
function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { yyyy, mm, dd, iso: `${yyyy}-${mm}-${dd}` };
}

function prompt(question, defaultValue) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const suffix = defaultValue ? ` [${defaultValue}]` : '';
    rl.question(`${question}${suffix}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

function buildTemplate({ title, titleEn, dateIso, excerpt, excerptEn, category, categoryEn, tags, tagsEn, author }) {
  const yamlList = (arr) => '[' + arr.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(', ') + ']';
  return `---
title: "${title.replace(/"/g, '\\"')}"
title_en: "${titleEn.replace(/"/g, '\\"')}"
date: "${dateIso}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
excerpt_en: "${excerptEn.replace(/"/g, '\\"')}"
author: "${author}"
tags: ${yamlList(tags)}
tags_en: ${yamlList(tagsEn)}
category: "${category}"
category_en: "${categoryEn}"
---

# ${title}

Viết phần mở đầu của bạn ở đây. Vài đoạn ngắn dẫn dắt vào chủ đề.

## Mục 1

Nội dung...

## Mục 2

Nội dung...

<!-- en -->

# ${titleEn}

Open the post here. A few short paragraphs framing the topic.

## Section 1

Content...

## Section 2

Content...
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const today = todayISO();

  const interactive = !args.title && !args.slug;

  const title = args.title || (await prompt('Tiêu đề (VI)'));
  if (!title) {
    console.error('Title (VI) is required.');
    process.exit(1);
  }

  const titleEn = args['title-en'] || (interactive ? await prompt('Title (EN)', title) : title);
  const slug = args.slug || (interactive ? await prompt('Slug', slugify(titleEn)) : slugify(titleEn));
  if (!slug) {
    console.error('Slug is required.');
    process.exit(1);
  }

  const dateIso = args.date || (interactive ? await prompt('Date', today.iso) : today.iso);
  const [yyyy, mm, dd] = dateIso.split('-');
  if (!yyyy || !mm || !dd) {
    console.error(`Date must be YYYY-MM-DD, got "${dateIso}".`);
    process.exit(1);
  }

  const excerpt = args.excerpt || (interactive ? await prompt('Mô tả ngắn (VI)') : '');
  const excerptEn = args['excerpt-en'] || (interactive ? await prompt('Excerpt (EN)', excerpt) : excerpt);
  const category = args.category || (interactive ? await prompt('Danh mục (VI)', 'Công nghệ') : 'Công nghệ');
  const categoryEn = args['category-en'] || (interactive ? await prompt('Category (EN)', 'Technology') : 'Technology');
  const tagsStr = args.tags || (interactive ? await prompt('Tags (VI, comma-separated)') : '');
  const tagsEnStr = args['tags-en'] || (interactive ? await prompt('Tags (EN, comma-separated)', tagsStr) : tagsStr);
  const author = args.author || (interactive ? await prompt('Author', 'Triet') : 'Triet');

  const tags = tagsStr.split(',').map((s) => s.trim()).filter(Boolean);
  const tagsEn = tagsEnStr.split(',').map((s) => s.trim()).filter(Boolean);

  const dir = join(POSTS_ROOT, yyyy, mm, dd);
  const file = join(dir, `${slug}.md`);

  if (existsSync(file)) {
    console.error(`A post already exists at ${relative(REPO_ROOT, file)}. Pick a different slug.`);
    process.exit(1);
  }

  mkdirSync(dir, { recursive: true });
  writeFileSync(
    file,
    buildTemplate({ title, titleEn, dateIso, excerpt, excerptEn, category, categoryEn, tags, tagsEn, author }),
    'utf8',
  );

  console.log(`\n✓ Created ${relative(REPO_ROOT, file)}`);
  console.log(`  URL after build: /data-alchemy/posts/${slug}`);
  console.log(`\nNext: open it in your editor and write the post body.`);
  console.log(`  Then \`npm run dev\` to preview — HMR picks up MD changes live.\n`);

  // Try to open in $EDITOR if set.
  const editor = process.env.EDITOR || process.env.VISUAL;
  if (editor) {
    const cp = spawn(editor, [file], { stdio: 'inherit', shell: true });
    cp.on('error', () => {}); // best-effort — never fail the script if editor missing
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
