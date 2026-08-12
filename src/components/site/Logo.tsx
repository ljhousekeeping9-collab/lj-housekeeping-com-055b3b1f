import { Link } from "@tanstack/react-router";
import logo from "@/assets/lj-logo.asset.json";

export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <Link to="/" className="inline-flex items-center" aria-label="LJ Housekeeping home">
      <img
        src={logo.url}
        alt="LJ Housekeeping — your home, our priority"
        className={`${className} w-auto object-contain`}
      />
    </Link>
  );
}
