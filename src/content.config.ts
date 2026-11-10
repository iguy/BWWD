import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const photography = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/photography' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    cover: z.string(),
    coverSet: z.array(z.string()).optional(), // several images shown together as the thumbnail
    coverLayout: z.enum(['row', 'grid']).optional(), // row: tall screens side by side; grid: 2x2
    theme: z.enum(['light', 'dark']).optional(),
    tags: z.array(z.string()).default([]),
    photoCount: z.number(),
    legacy: z.boolean().default(false),
    coverPosition: z.string().optional(), // CSS object-position for the thumbnail crop, e.g. 'top'
    listLast: z.number().optional(), // ongoing series listed after the dated stories (1, 2, 3...)
  }),
});

export const collections = { photography };
