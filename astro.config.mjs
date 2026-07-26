import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://bwwd.com', // Replace with your real domain
  integrations: [keystatic()]
});