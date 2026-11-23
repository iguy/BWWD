// Copies images from ../migration/<section>/images into public/media/<section>/
// so pages can serve them. public/media is gitignored; migration/ is the source.
import { cp, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const SRC = new URL('../../migration/', import.meta.url);
const DEST = new URL('../public/media/', import.meta.url);

await rm(DEST, { recursive: true, force: true });
if (existsSync(SRC)) {
  for (const section of await readdir(SRC)) {
    const images = new URL(`${section}/images/`, SRC);
    if (existsSync(images)) await cp(images, new URL(`${section}/`, DEST), { recursive: true });
  }
}
console.log('Media copied to public/media/');
