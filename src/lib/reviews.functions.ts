import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    }),
  );
}

export const listApprovedReviews = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await publicClient();
  const { data, error } = await supabase
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
    const supabase = await publicClient();
    const { error } = await supabase.from("reviews").insert({
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

async function assertAdmin(context: {
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> };
  userId: string;
}) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data !== true) throw new Error("Forbidden");
}

export const listAllReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
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
    await assertAdmin(context as never);
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
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
