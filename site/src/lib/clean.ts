// Turns WordPress/Divi HTML into clean markup for the new site.
import { parse, type HTMLElement } from 'node-html-parser';
import { mediaUrl, type Section } from './sections';

interface Options {
  title?: string; // page title: a heading repeating it inside the body is dropped
  plates?: boolean; // gallery sections: every artwork image becomes a numbered plate
  cover?: string; // local cover path, shown in the header (gallery sections)
}

export function cleanHtml(html: string, section: Section, opts: Options = {}): string {
  const root = parse(html, { comment: false });

  // Divi accordion/toggle -> plain content (transcripts read as the article itself)
  for (const item of root.querySelectorAll('.et_pb_toggle')) {
    const body = item.querySelector('.et_pb_toggle_content')?.innerHTML ?? '';
    if (!parse(body).text.trim() && !parse(body).querySelector('img,iframe')) item.remove();
    else item.replaceWith(parse(body));
  }

  // Divi number counters whose number was filled in by JavaScript: drop the empty number
  for (const el of root.querySelectorAll('.et_pb_number_counter .percent')) if (!el.text.trim()) el.remove();

  // Old WordPress menus and search forms placed inside posts
  for (const el of root.querySelectorAll('nav.wp-block-navigation, form')) el.remove();

  // WordPress/Divi inline styling (colours, spacing) — the new site's styles take over
  for (const el of root.querySelectorAll('[style]')) {
    if (el.tagName === 'IFRAME' || el.closest('.instagram-media')) continue;
    el.removeAttribute('style');
  }

  // Unwrap Divi layout wrappers (div/span only), keep their contents; headings etc. stay
  for (let i = 0; i < 6; i++) {
    for (const el of root.querySelectorAll('div[class*="et_pb_"], span[class*="et_pb_"]'))
      el.replaceWith(...(el.childNodes as HTMLElement[]));
  }
  for (const el of root.querySelectorAll('[class*="et_pb_"]')) el.removeAttribute('class');

  // A heading that just repeats the page title
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (opts.title) {
    for (const h of root.querySelectorAll('h1, h2')) if (norm(h.text) === norm(opts.title)) h.remove();
  }

  // Images: local paths, lazy loading, no WordPress sizing attributes
  for (const img of root.querySelectorAll('img')) {
    const src = img.getAttribute('src');
    if (src) img.setAttribute('src', mediaUrl(src, section));
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  }

  if (opts.plates) {
    // The cover already sits in the page header
    if (opts.cover) for (const img of root.querySelectorAll(`img[src="${opts.cover}"]`)) {
      const fig = img.closest('figure');
      (fig && fig.querySelectorAll('img').length === 1 ? fig : img).remove();
    }
    for (const img of root.querySelectorAll('img')) {
      if (img.closest('.wp-block-cover')) continue;
      let fig = img.closest('figure');
      if (!fig) {
        // Bare image (often wrapped in a <p> or <a>): give it its own figure
        const holder = (img.parentNode as HTMLElement)?.tagName === 'A' ? (img.parentNode as HTMLElement) : img;
        const outer = holder.parentNode as HTMLElement;
        const wrap = parse(`<figure class="plate">${holder.toString()}</figure>`).firstChild as HTMLElement;
        if (outer?.tagName === 'P' && !outer.text.trim() && outer.querySelectorAll('img').length === 1) outer.replaceWith(wrap);
        else holder.replaceWith(wrap);
        fig = wrap;
      }
      fig.classList.add('plate');
      if (!fig.querySelector('figcaption')) {
        const alt = img.getAttribute('alt')?.trim();
        const label = alt && !/^image|^\d|\.(jpe?g|png)$/i.test(alt) ? alt : '';
        fig.appendChild(parse(`<figcaption>${label}</figcaption>`));
      }
    }
  }

  // Gallery: the first real paragraph opens with a drop cap
  if (opts.plates) {
    const lede = root.querySelectorAll('p').find((p) => p.text.trim().length > 80 && !p.closest('figure, .wp-block-column, .wp-block-cover'));
    lede?.classList.add('lede');
  }

  // Cover blocks use the image as a background
  for (const cover of root.querySelectorAll('.wp-block-cover')) cover.removeAttribute('style');

  // Paragraphs that only held an empty &nbsp;
  for (const p of root.querySelectorAll('p')) if (!p.text.trim() && !p.querySelector('img,iframe')) p.remove();

  // Links back to the old site stay root-relative so they work on either host
  for (const a of root.querySelectorAll('a')) {
    const href = a.getAttribute('href');
    if (href?.startsWith('https://betterworldwithdesign.com/') && !href.includes('/wp-content/'))
      a.setAttribute('href', href.replace('https://betterworldwithdesign.com', ''));
  }

  return root.toString();
}
