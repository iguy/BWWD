// bwwd-site Worker: serves the new static site.
// Old WordPress image addresses are answered from the copies this site already has (wp-map.json);
// anything not found there falls back to the WordPress temporary address while it still exists.
const WP_HOST = 'https://915541.us33.myftpupload.com';
const WP_FILES = /^\/(wp-content|wp-includes)\//;
const WP_ADMIN = /^\/(wp-admin|wp-json)(\/|$)|^\/(wp-login\.php|xmlrpc\.php|wp-cron\.php)$/;
let wpMap;

async function oldImage(request, env, url) {
  if (!wpMap) wpMap = await (await env.ASSETS.fetch(new Request(new URL('/wp-map.json', url)))).json();
  const name = decodeURIComponent(url.pathname.split('/').pop() || '').toLowerCase();
  const key = name.replace(/\.[a-z0-9]+$/, '').replace(/-\d+x\d+$/, '');
  const local = wpMap[key] || wpMap[key.replace(/-scaled$/, '')];
  if (local) {
    const res = await env.ASSETS.fetch(new Request(new URL(local, url), request));
    if (res.ok) return res;
  }
  const res = await fetch(WP_HOST + url.pathname + url.search, { cf: { cacheEverything: true, cacheTtl: 86400 } });
  const headers = new Headers(res.headers);
  headers.set('cache-control', 'public, max-age=86400');
  return new Response(res.body, { status: res.status, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // One address for everything: www goes to the main domain
    if (url.hostname === 'www.betterworldwithdesign.com') { url.hostname = 'betterworldwithdesign.com'; return Response.redirect(url.toString(), 301); }
    if (WP_FILES.test(url.pathname)) return oldImage(request, env, url);
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
