import { z } from "zod";

const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    category: z.string(),
    isPremium: z.boolean().optional(),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    category: z.string().optional(),
    isPremium: z.boolean().optional(),
  }),
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
