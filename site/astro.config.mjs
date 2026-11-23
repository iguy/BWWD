import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Main site, betterworldwithdesign.com. Pages keep their WordPress URLs.
// Content comes from ../migration/<section>/ (pulled from WordPress).
// Not live: WordPress keeps serving the domain until a section is switched over.
export default defineConfig({
  site: 'https://betterworldwithdesign.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
