import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import servicesVideo from "@/assets/lj-services.mp4.asset.json";
import servicesPoster from "@/assets/lj-services-poster.jpg.asset.json";

export function ServicesVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;

    const tryPlay = async () => {
      try {
        await el.play();
        setNeedsTap(false);
      } catch {
        setNeedsTap(true);
      }
    };

    void tryPlay();
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("loadeddata", tryPlay);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) void tryPlay();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    return () => {
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("loadeddata", tryPlay);
      observer.disconnect();
    };
  }, []);

  const handleTap = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    void el.play().then(
      () => setNeedsTap(false),
      () => setNeedsTap(true),
    );
  };

  return (
    <div className="relative w-full max-w-[360px]">
      <div className="absolute -inset-4 rounded-[2rem] bg-primary/15 blur-[70px]" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <video
          ref={ref}
          src={servicesVideo.url}
          poster={servicesPoster.url}
          width={1080}
          height={1920}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onClick={handleTap}
          className="aspect-[9/16] w-full object-cover"
          aria-label="LJ Housekeeping cleaning showcase"
        />
        {needsTap && (
          <button
            type="button"
            onClick={handleTap}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px] transition-opacity hover:bg-background/30"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/50 bg-background/70 text-primary shadow-[0_0_40px_-8px_hsl(var(--primary))]">
              <Play className="ml-1 h-6 w-6" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
