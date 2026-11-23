// RSS feed at /feed/ (the WordPress feed address), newest 30 posts
import rss from '@astrojs/rss';
import { getArticles, excerpt } from '../../lib/sections';

export async function GET(context) {
  const articles = await getArticles();
  return rss({
    title: 'Better World With Design',
    description: 'Books, music, photography, art and technology — by Gary Crossey.',
    site: context.site,
    items: articles.slice(0, 30).map((a) => ({
      title: a.data.title,
      pubDate: new Date(a.data.pubDate + 'T12:00:00Z'),
      description: excerpt(a, 300),
      link: `/${a.data.slug}/`,
      categories: [a.section.name],
    })),
  });
}
