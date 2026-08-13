import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Team Sign In | LJ Housekeeping" },
      {
        name: "description",
        content: "Private sign-in for the LJ Housekeeping lead management dashboard.",
      },
      { property: "og:title", content: "Team Sign In | LJ Housekeeping" },
      {
        property: "og:description",
        content: "Private sign-in for the LJ Housekeeping lead dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const fieldClass =
  "w-full rounded-md border border-input bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-primary/70 focus:shadow-[var(--shadow-glow)]";

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    void navigate({ to: "/admin" });
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 mx-auto h-72 max-w-2xl rounded-full bg-primary/15 blur-[140px]" />
      <div className="relative mx-auto max-w-md px-5 pt-40 pb-32">
        <div className="glow-panel rounded-xl p-8 md:p-10">
          <Lock className="size-6 text-primary" strokeWidth={1.2} />
          <h1 className="mt-6 text-2xl font-semibold">
            <span className="text-silver-gradient">TEAM SIGN IN</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Private access to the LJ Housekeeping lead dashboard.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <input
              required
              name="email"
              type="email"
              placeholder="Email"
              className={fieldClass}
            />
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              className={fieldClass}
            />
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-primary px-8 py-3.5 text-[0.72rem] font-semibold tracking-[0.24em] text-primary-foreground uppercase transition-all duration-300 hover:shadow-[var(--shadow-glow)] disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Signing In" : "Sign In"}
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 block text-center text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            Return to site
          </Link>
        </div>
      </div>
    </div>
  );
}
