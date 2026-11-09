import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Photography site at photography.betterworldwithdesign.com (Cloudflare Pages).
export default defineConfig({
  site: 'https://photography.betterworldwithdesign.com',
  output: 'static',
  trailingSlash: 'always',
  // Inline all CSS so a page can never load with a stale or missing stylesheet mid-deploy.
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
