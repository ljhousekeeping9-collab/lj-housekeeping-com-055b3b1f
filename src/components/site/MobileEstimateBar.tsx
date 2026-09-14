import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function MobileEstimateBar() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/estimate")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="relative px-4 pb-4 pt-8">
        <Link
          to="/estimate"
          className="btn-glow flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_0_35px_rgba(37,99,235,0.45)] active:scale-[0.98]"
        >
          Request an Estimate
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
