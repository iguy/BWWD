// bwwd-site Worker: serves the new static site; anything it doesn't have that WordPress owns
// (old images, the WordPress admin) is passed through to the WordPress server.
const WORDPRESS = /^\/(wp-content|wp-admin|wp-includes|wp-json)(\/|$)|^\/(wp-login\.php|xmlrpc\.php|wp-cron\.php)$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (WORDPRESS.test(url.pathname)) {
      // On betterworldwithdesign.com this reaches the WordPress origin behind Cloudflare.
      // On the preview address it fetches from the live domain instead.
      if (url.hostname.endsWith('betterworldwithdesign.com')) return fetch(request);
      return fetch(new Request('https://betterworldwithdesign.com' + url.pathname + url.search, request));
    }
    // RSS at the old WordPress feed address
    if (url.pathname === '/feed/' || url.pathname === '/feed') {
      const feed = await env.ASSETS.fetch(new Request(new URL('/feed/index.xml', url), request));
      return new Response(feed.body, { status: feed.status, headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=900' } });
    }
    // Static site; unknown addresses get the 404 page
    const res = await env.ASSETS.fetch(request);
    if (res.status !== 404) return res;
    const notFound = await env.ASSETS.fetch(new Request(new URL('/404.html', url), request));
    return new Response(notFound.body, { status: 404, headers: notFound.headers });
  },
};
