import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static site served at betterworldwithdesign.com, section by section.
// A Cloudflare Worker sends migrated paths here; everything else still goes to WordPress.
export default defineConfig({
  site: 'https://betterworldwithdesign.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => page !== 'https://betterworldwithdesign.com/' })],
});
