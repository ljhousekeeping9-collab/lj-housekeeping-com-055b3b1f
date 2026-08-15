import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { submitReview } from "@/lib/reviews.functions";
import { reviewSchema } from "@/lib/review-schema";

export function ReviewForm() {
  const send = useServerFn(submitReview);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [location, setLocation] = useState("");
  const [quote, setQuote] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = reviewSchema.safeParse({ authorName, location, rating, quote });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your review.");
      return;
    }
    setSending(true);
    try {
      await send({ data: parsed.data });
      setDone(true);
      setAuthorName("");
      setLocation("");
      setQuote("");
      setRating(5);
    } catch {
      toast.error("We couldn't submit your review. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="glow-panel mx-auto mt-12 max-w-2xl rounded-lg p-8 text-center">
        <p className="eyebrow">Thank you</p>
        <p className="mt-4 text-sm leading-relaxed text-silver md:text-base">
          Thank you for sharing your experience with LJ Housekeeping. Your review has been
          received and will appear here once it&apos;s reviewed.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mt-12 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex rounded-md border border-silver/30 px-8 py-3.5 text-[0.68rem] font-semibold tracking-[0.24em] text-silver uppercase transition-all duration-300 hover:border-primary/60 hover:text-primary"
        >
          Leave a Review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glow-panel mx-auto mt-12 max-w-2xl rounded-lg p-8 text-left"
    >
      <p className="eyebrow">Share your experience</p>

      <div className="mt-6 flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`${idx + 1} star${idx === 0 ? "" : "s"}`}
            onClick={() => setRating(idx + 1)}
            className="transition-transform duration-200 hover:scale-110"
          >
            <Star
              className={idx < rating ? "size-6 text-primary" : "size-6 text-steel"}
              fill={idx < rating ? "currentColor" : "none"}
              strokeWidth={idx < rating ? 0 : 1.5}
            />
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="review-name"
            className="text-[0.65rem] tracking-[0.2em] text-steel uppercase"
          >
            Your name
          </label>
          <input
            id="review-name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={60}
            required
            className="mt-2 w-full rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60"
          />
        </div>
        <div>
          <label
            htmlFor="review-location"
            className="text-[0.65rem] tracking-[0.2em] text-steel uppercase"
          >
            City (optional)
          </label>
          <input
            id="review-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={80}
            className="mt-2 w-full rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="review-quote"
          className="text-[0.65rem] tracking-[0.2em] text-steel uppercase"
        >
          Your review
        </label>
        <textarea
          id="review-quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={4}
          maxLength={600}
          required
          className="mt-2 w-full rounded-md border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 text-[0.68rem] font-semibold tracking-[0.24em] text-primary-foreground uppercase transition-all duration-300 hover:shadow-[var(--shadow-glow)] disabled:opacity-60"
        >
          {sending && <Loader2 className="size-4 animate-spin" />}
          Submit Review
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[0.68rem] tracking-[0.24em] text-steel uppercase transition-colors hover:text-silver"
        >
          Cancel
        </button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Reviews are published after a quick review by our team.
      </p>
    </form>
  );
}
