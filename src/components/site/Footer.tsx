import { Link } from "@tanstack/react-router";
import { Instagram, Phone } from "lucide-react";
import { Logo } from "./Logo";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.53V2h-3.45v13.7a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-6.95a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}


export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <Logo className="h-16" />
            <p className="mt-4 text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
              Your Home, Our Priority.
            </p>
          </div>

          <nav className="flex flex-col gap-3 md:items-end">
            <Link
              to="/"
              className="text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary"
            >
              About Us
            </Link>
            <Link
              to="/estimate"
              className="text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary"
            >
              Request an Estimate
            </Link>
            <a
              href="tel:+1-000-000-0000"
              className="mt-1 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary"
            >
              <Phone className="size-3.5" strokeWidth={1.6} />
              Call Us
            </a>
            <div className="mt-3 flex items-center gap-4">
              <a
                href="https://www.instagram.com/lj.housekeeping?igsh=NTc4MTIwNjQ2YQ==&igsi=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow LJ Housekeeping on Instagram"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Instagram className="size-5" strokeWidth={1.6} />
              </a>
              <a
                href="https://www.tiktok.com/@lj.housekeeping?_r=1&_t=ZT-98q387dF8t3"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow LJ Housekeeping on TikTok"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <TikTokIcon className="size-5" />
              </a>
            </div>
          </nav>

        </div>

        <div className="hairline mt-12" />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 LJ Housekeeping. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
