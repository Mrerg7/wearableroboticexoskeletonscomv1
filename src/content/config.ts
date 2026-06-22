import { defineCollection, z } from 'astro:content';

const caveatsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    icon: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = {
  caveats: caveatsCollection,
};
