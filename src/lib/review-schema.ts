import { z } from "zod";

export const reviewSchema = z.object({
  authorName: z.string().trim().min(2, "Please enter your name").max(60),
  location: z.string().trim().max(80).optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  quote: z
    .string()
    .trim()
    .min(10, "Please share a little more about your experience")
    .max(600),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export type PublicReview = {
  id: string;
  created_at: string;
  author_name: string;
  location: string | null;
  rating: number;
  quote: string;
};

export type AdminReview = PublicReview & { approved: boolean };
