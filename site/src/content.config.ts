import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every post pulled from WordPress: ../migration/<section>/<slug>.md
const articles = defineCollection({
  loader: glob({ pattern: '*/*.md', base: '../migration' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    oldUrl: z.string(),
    oldPath: z.string(),
    pubDate: z.string(),
    updated: z.string().optional(),
    description: z.string().default(''),
    cover: z.string().default(''),
    coverAlt: z.string().default(''),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    wpId: z.number(),
    status: z.string().default('pulled'),
  }),
});

export const collections = { articles };
