import { getCollection, type CollectionEntry } from 'astro:content';

export type Story = CollectionEntry<'photography'>;
export const SITE = 'https://photography.betterworldwithdesign.com';

/** Every story lives at /<slug>/ on the photography subdomain. */
export const storyPath = (s: Story) => `/${s.id}/`;

/** Turns a site-relative image path into a full URL (for social/structured data). */
export const absolute = (u: string) => (u.startsWith('http') ? u : SITE + u);

export async function sortedStories() {
  // Ongoing series (listLast) sit after the dated stories, in the order given by listLast.
  return (await getCollection('photography')).sort((a, b) => {
    const la = a.data.listLast ?? 0, lb = b.data.listLast ?? 0;
    if (la !== lb) return la - lb;
    return b.data.pubDate.localeCompare(a.data.pubDate);
  });
}

/** One page per story, with newer/older links. */
export async function storyPaths() {
  const all = await sortedStories();
  return all.map((story, i) => ({ params: { slug: story.id }, props: { story, newer: all[i - 1], older: all[i + 1] } }));
}
