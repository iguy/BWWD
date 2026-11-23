// Turns WordPress/Divi HTML into clean markup for the new site.
import { parse, type HTMLElement } from 'node-html-parser';
import { mediaUrl, type Section } from './sections';

export function cleanHtml(html: string, section: Section): string {
  const root = parse(html, { comment: false });

  // Divi accordion/toggle -> <details>
  for (const item of root.querySelectorAll('.et_pb_toggle')) {
    const title = item.querySelector('.et_pb_toggle_title')?.text.trim() || 'More';
    const body = item.querySelector('.et_pb_toggle_content')?.innerHTML ?? '';
    item.replaceWith(parse(`<details class="toggle"><summary>${title}</summary><div>${body}</div></details>`));
  }

  // Unwrap Divi layout wrappers, keep their contents
  const unwrap = (sel: string) => {
    for (const el of root.querySelectorAll(sel)) el.replaceWith(...(el.childNodes as HTMLElement[]));
  };
  for (let i = 0; i < 4; i++) unwrap('[class*="et_pb_"]');

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
