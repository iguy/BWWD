import { getCollection, type CollectionEntry } from 'astro:content';

export interface Section {
  folder: string; // migration/<folder>
  name: string;
  wpCat: string; // WordPress category slug; hub lives at /category/<wpCat>/ like WordPress
  blurb: string;
}

// Sections built on the new site. Add one here when its pages are ready.
export const SECTIONS: Section[] = [
  {
    folder: 'art-design',
    name: 'Art & Design',
    wpCat: 'art-design-insights',
    blurb: 'Artists, photographers and movements I keep coming back to.',
  },
];

export type Article = CollectionEntry<'articles'> & { section: Section };

const folderOf = (e: CollectionEntry<'articles'>) =>
  (e.filePath ?? '').split('/').slice(-2, -1)[0];

export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('articles');
  return all
    .map((e) => ({ ...e, section: SECTIONS.find((s) => s.folder === folderOf(e)) }))
    .filter((e): e is Article => !!e.section)
    .sort((a, b) => b.data.pubDate.localeCompare(a.data.pubDate));
}

// ./images/<slug>/x.jpg in pulled content -> /media/<section>/<slug>/x.jpg
export const mediaUrl = (src: string, section: Section) =>
  src.startsWith('./images/') ? `/media/${section.folder}/${src.slice('./images/'.length)}` : src;

export const absolute = (p: string) => (p ? new URL(p, 'https://betterworldwithdesign.com').href : undefined);

export const dateLabel = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
