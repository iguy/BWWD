// Turns WordPress/Divi HTML into clean markup for the new site.
import { parse, type HTMLElement } from 'node-html-parser';
import { mediaUrl, type Section } from './sections';
import covers from '../data/spotify-covers.json';

interface Options {
  title?: string; // page title: a heading repeating it inside the body is dropped
  plates?: boolean; // gallery sections: every artwork image becomes a numbered plate
  cover?: string; // local cover path, shown in the header — removed from the body
  lede?: boolean; // mark the opening paragraph
  tracks?: boolean; // music: cover images that match a Spotify release become playable tiles
}

export interface Art { src: string; alt: string; caption: string; others: string[] }

// Art & Design: the artist's own work leads, not the generated thumbnail.
// Returns the first plate (the artwork) and removes it from the body.
export function takeArt(html: string): { html: string; art?: Art } {
  const root = parse(html, { comment: false });
  const fig = root.querySelector('figure.plate');
  const img = fig?.querySelector('img');
  if (!fig || !img?.getAttribute('src')) return { html };
  const art = {
    src: img.getAttribute('src')!,
    alt: img.getAttribute('alt') || '',
    caption: fig.querySelector('figcaption')?.text.trim() || '',
    // the post's other artwork: used if this image is blocked by the site it's linked from
    others: root.querySelectorAll('figure.plate img').map((i) => i.getAttribute('src') || '').filter((x) => x && x !== img.getAttribute('src')),
  };
  const works = fig.closest('.works');
  fig.remove();
  if (works && !works.querySelector('figure')) works.remove();
  return { html: root.toString(), art };
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
  for (const el of root.querySelectorAll('nav.wp-block-navigation, .wp-block-page-list, form')) el.remove();

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

  // The cover already sits in the page header
  const base = (src = '') =>
    (src.split('/').pop() ?? '').toLowerCase().replace(/\.\w+$/, '').replace(/(-\d+x\d+|-scaled|-e\d+|-\d)+$/, '');
  if (opts.cover) for (const img of root.querySelectorAll('img')) {
    if (base(img.getAttribute('src')) !== base(opts.cover) || img.closest('.wp-block-cover')) continue;
    const fig = img.closest('figure');
    (fig && fig.querySelectorAll('img').length === 1 ? fig : img).remove();
  }

  if (opts.plates) {
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

    // Art first: plates that trail after all the writing (e.g. after a transcript)
    // move to a "Works" gallery at the top of the piece.
    const all = root.querySelectorAll('*');
    const isText = (el: HTMLElement) =>
      ['P', 'H2', 'H3', 'H4', 'LI', 'BLOCKQUOTE'].includes(el.tagName) && el.text.trim().length > 40 && !el.closest('figure');
    let lastText = -1;
    all.forEach((el, i) => { if (isText(el)) lastText = i; });
    const trailing = root.querySelectorAll('figure.plate').filter((f) => all.indexOf(f) > lastText);
    if (trailing.length) {
      const works = trailing.map((f) => { f.remove(); return f.toString(); }).join('');
      root.insertAdjacentHTML('afterbegin', `<section class="works works--${Math.min(trailing.length, 3)}">${works}</section>`);
    }
  }

  // Designed sections: the first real paragraph opens the piece
  if (opts.plates || opts.lede) {
    const lede = root.querySelectorAll('p').find((p) => p.text.trim().length > 80 && !p.closest('figure, .wp-block-column, .wp-block-cover'));
    lede?.classList.add('lede');
  }

  // Music: covers matched to Spotify releases become tiles that play in place
  if (opts.tracks) {
    const map = covers as Record<string, { title: string; album?: string }>;
    const tileFor = (img: HTMLElement) => map[(img.getAttribute('src') ?? '').split('/').pop() ?? ''];
    for (const gallery of root.querySelectorAll('figure.wp-block-gallery, .wp-block-columns')) {
      const imgs = gallery.querySelectorAll('img');
      if (imgs.length < 2 || !imgs.every((i) => tileFor(i))) continue;
      const seen = new Set<string>();
      const tiles = imgs.map((img) => {
        const t = tileFor(img);
        const key = t.album ?? t.title;
        if (seen.has(key)) return '';
        seen.add(key);
        const pic = `<img src="${img.getAttribute('src')}" alt="${t.title} cover" decoding="async">`;
        return t.album
          ? `<li class="track"><button type="button" class="track__btn" data-album="${t.album}" aria-label="Play ${t.title}">${pic}<span class="track__play" aria-hidden="true"></span></button><span class="track__title">${t.title}</span></li>`
          : `<li class="track track--off">${pic}<span class="track__title">${t.title}<em>Not on Spotify yet</em></span></li>`;
      }).join('');
      gallery.replaceWith(parse(`<ul class="tracks">${tiles}</ul>`));
    }
  }

  // Cover blocks use the image as a background
  for (const cover of root.querySelectorAll('.wp-block-cover')) cover.removeAttribute('style');

  // Headings left empty (spacers in the old layout)
  for (const h of root.querySelectorAll('h1,h2,h3,h4,h5,h6')) if (!h.text.trim() && !h.querySelector('img')) h.remove();

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
