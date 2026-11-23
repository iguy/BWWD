// Copies images from ../migration/<section>/images into public/media/<section>/
// so pages can serve them. public/media is gitignored; migration/ is the source.
import { cp, readdir, rm, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SRC = new URL('../../migration/', import.meta.url);
const DEST = new URL('../public/media/', import.meta.url);

// Names with percent-encoding (emoji or symbols in WordPress file names): browsers request the
// decoded name, so store them decoded. Depth-first so renaming a folder doesn't break its children.
async function decodeNames(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) await decodeNames(full);
    if (!ent.name.includes('%')) continue;
    let dec = ent.name;
    try { dec = decodeURIComponent(ent.name); } catch {}
    if (dec !== ent.name && !existsSync(path.join(dir, dec))) await rename(full, path.join(dir, dec));
  }
}

await rm(DEST, { recursive: true, force: true });
if (existsSync(SRC)) {
  for (const section of await readdir(SRC)) {
    const images = new URL(`${section}/images/`, SRC);
    if (!existsSync(images)) continue;
    const out = new URL(`${section}/`, DEST);
    await cp(images, out, { recursive: true });
    // Folders named with percent-encoding (emoji slugs): browsers request the decoded name, so store it that way
    await decodeNames(fileURLToPath(out));
  }
}
// Old WordPress image addresses (/wp-content/uploads/YYYY/MM/name-300x200.jpg) -> the copy this site has.
// Key: file name without folder, size suffix or extension, lower case.
const map = {};
async function index(dir, rel) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name), r = rel + '/' + ent.name;
    if (ent.isDirectory()) { await index(full, r); continue; }
    if (!/\.(jpe?g|png|gif|webp|svg|mp4)$/i.test(ent.name)) continue;
    const key = ent.name.toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/-\d+x\d+$/, '');
    if (!map[key]) map[key] = '/media' + r;
  }
}
if (existsSync(DEST)) await index(fileURLToPath(DEST), '');
const { writeFile } = await import('node:fs/promises');
await writeFile(new URL('../public/wp-map.json', import.meta.url), JSON.stringify(map));
console.log(`Media copied to public/media/ (${Object.keys(map).length} old image addresses mapped)`);
