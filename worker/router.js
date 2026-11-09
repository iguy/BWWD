/**
 * bwwd-router — runs in front of betterworldwithdesign.com.
 *
 * Migrated paths are served from the new Astro site (Cloudflare Pages).
 * Everything else passes straight through to WordPress, untouched.
 * To migrate another section: add its paths below and redeploy.
 * To undo everything instantly: remove the Worker's route in Cloudflare.
 */
const NEW_SITE = 'https://bwwd.pages.dev';

// Photo stories that keep their original WordPress URL at the root.
const LEGACY_STORIES = new Set([
  'animals-we-live-with', 'asheville-pride', 'asheville-rugby', 'azelia-design-portfolio',
  'beer-city-7s-rugby-tournament', 'chicago-architecture', 'new-york-2023',
  'sandy-mush-community-center', 'smoke-photography', 'spring-fling-2023', 'two-up-photography',
]);

// Old URLs retired in the migration → where they now point (301, keeps rankings).
const REDIRECTS = {
  '/category/photography-visual-arts/': '/photography/',
  '/follow-me-on-gurushot/': '/photography/',
  '/2022-photography-goals/': '/photography/',
  '/gear-review/': '/photography/',
};

function isNewSite(path) {
  if (path === '/photography/' || path.startsWith('/photography/')) return true;
  if (path.startsWith('/_astro/')) return true;
  if (path === '/sitemap-index.xml' || path === '/sitemap-0.xml') return true;
  const slug = path.replace(/^\/|\/$/g, '');
  return LEGACY_STORIES.has(slug);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;

    // WordPress category archives also have /page/2/ etc.
    if (path.startsWith('/category/photography-visual-arts/')) path = '/category/photography-visual-arts/';
    if (REDIRECTS[path]) return Response.redirect(`${url.origin}${REDIRECTS[path]}`, 301);

    // Add the trailing slash the new site expects (e.g. /photography → /photography/).
    const withSlash = path.endsWith('/') || path.includes('.') ? path : path + '/';
    if (withSlash !== path && isNewSite(withSlash)) {
      return Response.redirect(`${url.origin}${withSlash}${url.search}`, 301);
    }

    if (isNewSite(path)) {
      return fetch(new Request(NEW_SITE + path + url.search, request));
    }

    return fetch(request); // everything else → WordPress
  },
};
