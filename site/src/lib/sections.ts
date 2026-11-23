import { getCollection, type CollectionEntry } from 'astro:content';

export interface Section {
  folder: string; // migration/<folder>
  name: string;
  wpCat: string; // WordPress category slug; hub lives at /category/<wpCat>/ like WordPress
  blurb: string;
  nav?: boolean; // show in the top menu (default true)
  look?: 'gallery' | 'sleeve'; // gallery: art catalogue; sleeve: record sleeve + liner notes
}

// Sections built on the new site. Add one here when its pages are ready.
export const SECTIONS: Section[] = [
  {
    folder: 'art-design',
    name: 'Art & Design',
    wpCat: 'art-design-insights',
    blurb: 'Artists, photographers and movements I keep coming back to.',
    look: 'gallery',
  },
  {
    folder: 'technology',
    name: 'Technology',
    wpCat: 'technology-trends-tips',
    blurb: 'AI tools, WordPress, search and the Sandy Mush Tech Hub.',
  },
  {
    folder: 'music',
    name: 'Music',
    wpCat: 'music-discovery-reviews',
    blurb: 'Reviews, playlists and records I keep going back to — plus my own tracks.',
    look: 'sleeve',
  },
  {
    folder: 'programming',
    name: 'Programming',
    wpCat: 'programming-development',
    blurb: 'Code experiments, animation and Living Plates tutorials.',
    nav: false,
  },
  {
    folder: 'news',
    name: 'News',
    wpCat: 'news',
    blurb: 'Milestones and updates from Better World With Design.',
    nav: false,
  },
  {
    folder: 'media',
    name: 'Media & Entertainment',
    wpCat: 'media-entertainment',
    blurb: 'Releases, remixes and other things worth hearing.',
    nav: false,
  },
  {
    folder: 'aeo-decoded',
    name: 'AEO Decoded',
    wpCat: 'aeo-decoded',
    blurb: 'Answer Engine Optimization, explained episode by episode.',
    nav: false,
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

// Card/hero image for an article. Art & Design uses the artist's own work when the post has some.
export async function cardImage(a: Article): Promise<{ src: string; alt: string }> {
  const cover = { src: mediaUrl(a.data.cover, a.section), alt: a.data.coverAlt || a.data.title };
  if (a.section.look !== 'gallery') return cover;
  const { cleanHtml, takeArt } = await import('./clean');
  const { art } = takeArt(cleanHtml(a.body ?? '', a.section, { title: a.data.title, plates: true, cover: cover.src }));
  return art ? { src: art.src, alt: art.alt || art.caption || a.data.title } : cover;
}
