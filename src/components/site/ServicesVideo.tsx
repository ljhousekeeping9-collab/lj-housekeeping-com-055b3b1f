import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import video1 from "@/assets/lj-services.mp4.asset.json";
import poster1 from "@/assets/lj-services-poster.jpg.asset.json";
import video2 from "@/assets/lj-services-2.mp4.asset.json";
import poster2 from "@/assets/lj-services-2-poster.jpg.asset.json";
import video3 from "@/assets/lj-services-3.mp4.asset.json";
import poster3 from "@/assets/lj-services-3-poster.jpg.asset.json";

const clips = [
  { src: video1.url, poster: poster1.url },
  { src: video2.url, poster: poster2.url },
  { src: video3.url, poster: poster3.url },
];

function Clip({ src, poster, index }: { src: string; poster: string; index: number }) {
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

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) void tryPlay();
          else el.pause();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);

    return () => observer.disconnect();
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
    <div className="relative w-[260px] shrink-0 snap-center md:w-[300px]">
      <div className="absolute -inset-3 rounded-[2rem] bg-primary/15 blur-[50px]" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <video
          ref={ref}
          src={src}
          poster={poster}
          width={1080}
          height={1920}
          muted
          loop
          playsInline
          preload="metadata"
          onClick={handleTap}
          className="aspect-[9/16] w-full object-cover"
          aria-label={`LJ Housekeeping cleaning showcase ${index + 1}`}
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

export function ServicesVideo() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.scrollWidth / clips.length;
    setActive(Math.round(el.scrollLeft / slide));
  };

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: (el.scrollWidth / clips.length) * i, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[calc(50%-130px)] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:px-[calc(50%-150px)] [&::-webkit-scrollbar]:hidden"
      >
        {clips.map((c, i) => (
          <Clip key={c.src} src={c.src} poster={c.poster} index={i} />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        {clips.map((c, i) => (
          <button
            key={c.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to video ${i + 1}`}
            className={
              i === active
                ? "h-1.5 w-6 rounded-full bg-primary transition-all"
                : "h-1.5 w-1.5 rounded-full bg-steel/60 transition-all"
            }
          />
        ))}
      </div>
    </div>
  );
}
