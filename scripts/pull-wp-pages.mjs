// Pulls WordPress pages (not posts) by slug out of betterworldwithdesign.com into migration/pages/.
// Read-only against WordPress.
//
// Usage: node scripts/pull-wp-pages.mjs about,contact,the-answer-engine
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const API = 'https://betterworldwithdesign.com/wp-json/wp/v2';
const slugs = process.argv.slice(2).join(',').split(',').map((x) => x.trim()).filter(Boolean);
if (!slugs.length) {
  console.error('Usage: node scripts/pull-wp-pages.mjs <slug>[,<slug>...]');
  process.exit(1);
}

const OUT = path.join('migration', 'pages');
const UA = { 'User-Agent': 'bwwd-migration' };

async function getJSON(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return { data: await res.json(), pages: Number(res.headers.get('x-wp-totalpages') || 1) };
}

const decode = (s = '') =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…');
const strip = (s = '') => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const yaml = (s) => JSON.stringify(s ?? '');

// Pages by slug
let posts = [];
for (const slug of slugs) {
  const r = await getJSON(`${API}/pages?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`);
  if (!r.data.length) { console.error(`No page ${slug}`); continue; }
  posts.push(r.data[0]);
}

await mkdir(OUT, { recursive: true });
const IMG = /https?:\/\/(?:www\.)?betterworldwithdesign\.com\/wp-content\/uploads\/[^"'\s)<>]+?\.(?:jpe?g|png|gif|webp|svg)/gi;
const index = [];

for (const p of posts) {
  const slug = p.slug;
  const imgDir = path.join(OUT, 'images', slug);
  let html = p.content.rendered
    .replace(/\s(srcset|sizes)="[^"]*"/g, '') // keep one src per image
    .replace(/\sdata-(lazy-)?src(set)?="[^"]*"/g, '');

  const featured = p._embedded?.['wp:featuredmedia']?.[0];
  const featuredUrl = featured?.source_url;
  // Images hosted on other sites, used in <img> tags
  const external = [...html.matchAll(/<img[^>]+src="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]);
  const urls = [...new Set([...(html.match(IMG) || []), ...external, ...(featuredUrl ? [featuredUrl] : [])])];

  const local = {};
  for (const url of urls) {
    const own = /betterworldwithdesign\.com\/wp-content/.test(url);
    const clean = decode(url);
    // Prefer the full-size original over a WordPress thumbnail (-300x200)
    const full = own ? clean.replace(/-\d+x\d+(\.\w+)$/, '$1') : clean;
    let name = path.basename(new URL(full).pathname).toLowerCase();
    if (!/\.(jpe?g|png|gif|webp|svg)$/.test(name)) name += '.jpg';
    const dest = path.join(imgDir, name);
    if (!existsSync(dest)) {
      await mkdir(imgDir, { recursive: true });
      let res = await fetch(full, { headers: UA });
      if (!res.ok && full !== clean) res = await fetch(clean, { headers: UA });
      if (!res.ok) {
        console.error(`  image FAILED ${res.status} ${url}`);
        continue;
      }
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
    local[url] = `./images/${slug}/${name}`;
  }
  for (const [url, rel] of Object.entries(local)) html = html.split(url).join(rel);

  const terms = (p._embedded?.['wp:term'] || []).flat();
  const categories = terms.filter((t) => t.taxonomy === 'category').map((t) => decode(t.name));
  const tags = terms.filter((t) => t.taxonomy === 'post_tag').map((t) => decode(t.name));
  const oldPath = new URL(p.link).pathname;

  const md = `---
title: ${yaml(decode(p.title.rendered))}
slug: ${yaml(slug)}
oldUrl: ${yaml(p.link)}
oldPath: ${yaml(oldPath)}
pubDate: ${yaml(p.date.slice(0, 10))}
updated: ${yaml(p.modified.slice(0, 10))}
description: ${yaml(strip(p.excerpt?.rendered || '').slice(0, 300))}
cover: ${yaml(featuredUrl ? local[featuredUrl] || featuredUrl : '')}
coverAlt: ${yaml(featured?.alt_text || '')}
categories: ${JSON.stringify(categories)}
tags: ${JSON.stringify(tags)}
wpId: ${p.id}
status: "pulled"
---

${html.trim()}
`;
  await writeFile(path.join(OUT, `${slug}.md`), md);
  index.push({ slug, title: decode(p.title.rendered), date: p.date.slice(0, 10), oldPath, images: Object.keys(local).length });
  console.log(`${slug}  (${Object.keys(local).length} images)`);
}

index.sort((a, b) => b.date.localeCompare(a.date));
let prev = [];
try { prev = JSON.parse(await (await import('node:fs/promises')).readFile(path.join(OUT, 'index.json'), 'utf8')); } catch {}
const merged = [...prev.filter((x) => !index.some((y) => y.slug === x.slug)), ...index];
await writeFile(path.join(OUT, 'index.json'), JSON.stringify(merged, null, 2) + '\n');
console.log(`Done: ${posts.length} pages -> ${OUT}`);
