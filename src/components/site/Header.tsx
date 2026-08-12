import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/estimate", label: "Request an Estimate" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-10">
        <Logo className="h-11 md:h-14" />

        <nav className="hidden items-center gap-10 md:flex">
          {links.slice(0, 2).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/estimate"
            className="rounded-md border border-primary/50 bg-primary/10 px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.22em] text-foreground transition-all duration-300 hover:bg-primary/25 hover:shadow-[var(--shadow-glow)]"
          >
            Request an Estimate
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-border p-2 text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-4 text-[0.75rem] uppercase tracking-[0.24em] text-muted-foreground last:border-0 data-[status=active]:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
