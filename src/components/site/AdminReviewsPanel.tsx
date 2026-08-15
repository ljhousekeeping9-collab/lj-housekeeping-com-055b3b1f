import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { toast } from "sonner";

import {
  deleteReview,
  listAllReviews,
  setReviewApproval,
} from "@/lib/reviews.functions";
import type { AdminReview } from "@/lib/review-schema";

export function AdminReviewsPanel({ enabled }: { enabled: boolean }) {
  const queryClient = useQueryClient();
  const fetchReviews = useServerFn(listAllReviews);
  const approve = useServerFn(setReviewApproval);
  const remove = useServerFn(deleteReview);

  const reviewsQuery = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => fetchReviews({}) as Promise<AdminReview[]>,
    enabled,
  });

  const approveMutation = useMutation({
    mutationFn: (vars: { id: string; approved: boolean }) => approve({ data: vars }),
    onSuccess: () => {
      toast.success("Review updated");
      void queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => toast.error("Could not update the review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (vars: { id: string }) => remove({ data: vars }),
    onSuccess: () => {
      toast.success("Review deleted");
      void queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => toast.error("Could not delete the review"),
  });

  const reviews = reviewsQuery.data ?? [];
  const pending = reviews.filter((r) => !r.approved).length;

  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-xl font-semibold md:text-2xl">
          <span className="text-silver-gradient">CLIENT REVIEWS</span>
        </h2>
        <p className="text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
          {pending} pending
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="glow-panel rounded-lg p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={idx < r.rating ? "size-3.5 text-primary" : "size-3.5 text-steel"}
                    fill={idx < r.rating ? "currentColor" : "none"}
                    strokeWidth={idx < r.rating ? 0 : 1.5}
                  />
                ))}
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[0.6rem] tracking-[0.18em] uppercase ${
                  r.approved
                    ? "border-primary/50 text-primary"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {r.approved ? "Published" : "Pending"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-silver">“{r.quote}”</p>
            <p className="mt-3 text-xs tracking-[0.18em] text-steel uppercase">
              — {r.author_name}
              {r.location ? ` · ${r.location}` : ""} ·{" "}
              {new Date(r.created_at).toLocaleDateString()}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  approveMutation.mutate({ id: r.id, approved: !r.approved })
                }
                disabled={approveMutation.isPending}
                className="rounded-md border border-input px-4 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors hover:border-primary/60"
              >
                {r.approved ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: r.id })}
                disabled={deleteMutation.isPending}
                className="rounded-md border border-input px-4 py-2 text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:border-destructive/60 hover:text-destructive"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
