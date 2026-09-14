import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileEstimateBar() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  const isEstimatePage = pathname.startsWith("/estimate");

  useEffect(() => {
    if (isEstimatePage) {
      setShow(false);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let timer: number | undefined;
    const visible = new Set<Element>();

    const setup = () => {
      const ctas = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href="/estimate"]')
      ).filter((el) => !el.closest("[data-estimate-bar]"));
      if (ctas.length === 0) {
        setShow(true);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target);
            else visible.delete(entry.target);
          }
          setShow(visible.size === 0);
        },
        { rootMargin: "-8px 0px -8px 0px" }
      );
      ctas.forEach((el) => observer!.observe(el));
    };


    // Wait for route content to render before collecting CTAs
    timer = window.setTimeout(setup, 300);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      visible.clear();
    };
  }, [pathname, isEstimatePage]);

  if (isEstimatePage) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-all duration-300 ease-out ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
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
