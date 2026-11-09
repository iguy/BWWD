import { getCollection, type CollectionEntry } from 'astro:content';

export type Story = CollectionEntry<'photography'>;
export const SITE = 'https://betterworldwithdesign.com';

/** Legacy stories keep their WordPress URL at the root; new ones live under /photography/. */
export const storyPath = (s: Story) => (s.data.legacy ? `/${s.id}/` : `/photography/${s.id}/`);

/** Turns a site-relative image path into a full URL (for social/structured data). */
export const absolute = (u: string) => (u.startsWith('http') ? u : SITE + u);

export async function sortedStories() {
  return (await getCollection('photography')).sort((a, b) => b.data.pubDate.localeCompare(a.data.pubDate));
}

/** Paths for one URL scheme, with newer/older links across the whole collection. */
export async function storyPaths(legacy: boolean) {
  const all = await sortedStories();
  return all
    .map((story, i) => ({ story, newer: all[i - 1], older: all[i + 1] }))
    .filter(({ story }) => story.data.legacy === legacy)
    .map((props) => ({ params: { slug: props.story.id }, props }));
}
