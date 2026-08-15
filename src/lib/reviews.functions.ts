import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { reviewSchema, type PublicReview } from "./review-schema";

export const listApprovedReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { publicSupabase } = await import("./reviews.server");
  const { data, error } = await publicSupabase()
    .from("reviews")
    .select("id, created_at, author_name, location, rating, quote")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) {
    console.error("Failed to load reviews", error);
    return [] as PublicReview[];
  }
  return (data ?? []) as PublicReview[];
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => reviewSchema.parse(input))
  .handler(async ({ data }) => {
    const { publicSupabase } = await import("./reviews.server");
    const { error } = await publicSupabase()
      .from("reviews")
      .insert({
        author_name: data.authorName,
        location: data.location ? data.location : null,
        rating: data.rating,
        quote: data.quote,
        approved: false,
      });
    if (error) {
      console.error("Failed to save review", error);
      throw new Error("We couldn't submit your review. Please try again.");
    }
    return { ok: true as const };
  });

export const listAllReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdminContext } = await import("./reviews.server");
    await assertAdminContext(context as never);
    const { data, error } = await context.supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const setReviewApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), approved: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { assertAdminContext } = await import("./reviews.server");
    await assertAdminContext(context as never);
    const { error } = await context.supabase
      .from("reviews")
      .update({ approved: data.approved })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { assertAdminContext } = await import("./reviews.server");
    await assertAdminContext(context as never);
    const { error } = await context.supabase.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
