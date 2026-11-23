// Turns WordPress/Divi HTML into clean markup for the new site.
import { parse, type HTMLElement } from 'node-html-parser';
import { mediaUrl, type Section } from './sections';

export function cleanHtml(html: string, section: Section): string {
  const root = parse(html, { comment: false });

  // Divi accordion/toggle -> <details>
  for (const item of root.querySelectorAll('.et_pb_toggle')) {
    const title = item.querySelector('.et_pb_toggle_title')?.text.trim() || 'More';
    const body = item.querySelector('.et_pb_toggle_content')?.innerHTML ?? '';
    if (!parse(body).text.trim()) {
      item.remove(); // empty Divi toggle (e.g. a stray "Close" item)
      continue;
    }
    item.replaceWith(parse(`<details class="toggle"><summary>${title}</summary><div>${body}</div></details>`));
  }

  // Divi number counters whose number was filled in by JavaScript: drop the empty number
  for (const el of root.querySelectorAll('.et_pb_number_counter .percent')) if (!el.text.trim()) el.remove();

  // Old WordPress menus placed inside posts
  for (const el of root.querySelectorAll('nav.wp-block-navigation')) el.remove();

  // WordPress/Divi inline styling (colours, spacing) — the new site's styles take over
  for (const el of root.querySelectorAll('[style]')) {
    if (el.tagName === 'IFRAME' || el.closest('.instagram-media')) continue;
    el.removeAttribute('style');
  }

  // Unwrap Divi layout wrappers, keep their contents
  // Old WordPress search forms
  for (const el of root.querySelectorAll('form')) el.remove();

  // Unwrap Divi layout wrappers (div/span only), keep their contents; headings etc. stay
  for (let i = 0; i < 6; i++) {
    for (const el of root.querySelectorAll('div[class*="et_pb_"], span[class*="et_pb_"]'))
      el.replaceWith(...(el.childNodes as HTMLElement[]));
  }
  for (const el of root.querySelectorAll('[class*="et_pb_"]')) el.removeAttribute('class');

  // Images: local paths, lazy loading, no WordPress sizing attributes
  for (const img of root.querySelectorAll('img')) {
    const src = img.getAttribute('src');
    if (src) img.setAttribute('src', mediaUrl(src, section));
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.removeAttribute('style');
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
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
