// bwwd-site Worker: serves the new static site. WordPress now lives at its GoDaddy temporary
// address: old image links (/wp-content, /wp-includes) are fetched from there, and the admin
// and login addresses redirect there.
const WP_HOST = 'https://915541.us33.myftpupload.com';
const WP_FILES = /^\/(wp-content|wp-includes)\//;
const WP_ADMIN = /^\/(wp-admin|wp-json)(\/|$)|^\/(wp-login\.php|xmlrpc\.php|wp-cron\.php)$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (WP_FILES.test(url.pathname)) {
      const res = await fetch(WP_HOST + url.pathname + url.search, { cf: { cacheEverything: true, cacheTtl: 86400 } });
      const headers = new Headers(res.headers);
      headers.set('cache-control', 'public, max-age=86400');
      return new Response(res.body, { status: res.status, headers });
    }
    if (WP_ADMIN.test(url.pathname)) return Response.redirect(WP_HOST + url.pathname + url.search, 302);
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
