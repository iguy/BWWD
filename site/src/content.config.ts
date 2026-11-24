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
    revised: z.string().optional(),
    book: z.string().optional(), // the book's own title, for its shelf spine
    author: z.string().optional(), // the book's author, shown small on its shelf spine // a real rewrite (YYYY-MM), shown in the byline as "Updated Month Year"
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
