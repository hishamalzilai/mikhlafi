import { z } from 'zod';

export const articleSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().default("أ. عبدالملك المخلافي"),
  excerpt: z.string().optional(),
  published_date: z.string().optional(),
});

export const newsSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().optional(),
  published_date: z.string().optional(),
  image_url: z.string().optional(),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  author_name: z.string().min(2, "Author name is required"),
  author_title: z.string().optional(),
  content: z.string().min(5, "Content is required"),
  author_image: z.string().nullable().optional(),
  order_index: z.coerce.number().default(0),
});

export const mediaLibrarySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2),
  type: z.enum(['image', 'video', 'document']),
  url: z.string().url(),
  category: z.string().optional(),
  description: z.string().optional(),
});

export const archiveSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2),
  type: z.string(),
  content: z.string().optional(),
  date: z.string().optional(),
  category: z.string().optional(),
});

export const studySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2),
  content: z.string().min(10),
  author: z.string().optional(),
  published_date: z.string().optional(),
});

export const timelineItemSchema = z.object({
  year: z.string(),
  title: z.string(),
  desc: z.string(),
  icon: z.string(),
});

export const homepageSchema = z.object({
  hero_title: z.string().min(2),
  hero_quote: z.string().min(2),
  hero_subtitle: z.string().min(2),
  vision_quote: z.string().min(2),
  timeline_items: z.array(timelineItemSchema).optional(),
});
