// Downloads images still hotlinked from the old WordPress site
// (betterworldwithdesign.com/wp-content/uploads/...) into
// public/photography/<slug>/ and rewrites the markdown to local paths.
// Run: node scripts/pull-wp-images.mjs
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const CONTENT = 'src/content/photography';
const PUBLIC = 'public/photography';
const WP = /https:\/\/(?:www\.)?betterworldwithdesign\.com\/wp-content\/uploads\/[^"')\s]+/g;

const files = (await readdir(CONTENT)).filter((f) => f.endsWith('.md'));
let total = 0;

for (const file of files) {
  const mdPath = path.join(CONTENT, file);
  let md = await readFile(mdPath, 'utf8');
  const urls = [...new Set(md.match(WP) || [])];
  if (!urls.length) continue;

  const slug = file.replace(/\.md$/, '');
  const dir = path.join(PUBLIC, slug);
  await mkdir(dir, { recursive: true });

  let n = 0;
  for (const url of urls) {
    n += 1;
    const ext = (path.extname(new URL(url).pathname) || '.jpg').toLowerCase().replace('.jpeg', '.jpg');
    const base = path.basename(new URL(url).pathname, path.extname(new URL(url).pathname));
    const name = `${base}${ext}`;
    const dest = path.join(dir, name);
    if (!existsSync(dest)) {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`FAILED ${res.status} ${url}`);
        continue;
      }
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
    md = md.split(url).join(`/photography/${slug}/${name}`);
    console.log(`${url} -> ${dest}`);
    total += 1;
  }
  await writeFile(mdPath, md);
}

console.log(`Done: ${total} images.`);
