import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Photography site at photography.betterworldwithdesign.com (Cloudflare Pages).
export default defineConfig({
  site: 'https://photography.betterworldwithdesign.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
