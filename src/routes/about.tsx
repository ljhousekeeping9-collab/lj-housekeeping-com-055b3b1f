import { createFileRoute, Link } from "@tanstack/react-router";
import aboutHero from "@/assets/about-hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LJ Housekeeping | Professional Cleaning, Personal Attention" },
      {
        name: "description",
        content:
          "LJ Housekeeping was built to provide dependable, professional cleaning with the care and attention every client deserves.",
      },
      { property: "og:title", content: "About LJ Housekeeping" },
      {
        property: "og:description",
        content: "Professional cleaning. Personal attention.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const standards = [
  { title: "Quality", body: "We take pride in doing the job right." },
  { title: "Reliability", body: "Our clients should be able to count on us." },
  { title: "Detail", body: "The little things make a big difference." },
  {
    title: "Professionalism",
    body: "We treat every space with care and respect.",
  },
];

function About() {
  return (
    <div>
      <section className="relative flex min-h-[70svh] items-center overflow-hidden">
        <img
          src={aboutHero}
          alt="Pristine modern lobby with polished dark floors"
          width={1920}
          height={1280}
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--background),transparent_60%)]" />
        <div className="reveal relative mx-auto w-full max-w-7xl px-5 pt-36 pb-20 md:px-10">
          <p className="eyebrow">LJ Housekeeping</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold md:text-6xl">
            <span className="text-silver-gradient">ABOUT LJ HOUSEKEEPING</span>
          </h1>
          <p className="mt-5 text-sm tracking-[0.18em] text-primary uppercase">
            Professional cleaning. Personal attention.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Our Story</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Built on care, not shortcuts.
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              LJ Housekeeping started with a simple goal: provide dependable, professional
              cleaning services while giving every client the level of care and attention
              they deserve.
            </p>
            <p>
              We believe cleaning is a service built on trust. Clients let us into their
              homes and businesses, and we treat that access with respect — showing up when
              we say we will, working to the same standard every time, and leaving a space
              better than we found it.
            </p>
            <p>
              Professionalism, reliability, attention to detail, and consistency aren't
              marketing words to us. They're the reason clients stay with us, and the
              reason we take pride in the work.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden border-y border-border bg-card/30">
        <div className="absolute inset-x-0 top-0 mx-auto h-64 max-w-2xl rounded-full bg-primary/25 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center md:py-32">
          <p className="eyebrow">Our Mission</p>
          <p className="mt-8 text-xl leading-relaxed font-light text-silver md:text-3xl md:leading-snug">
            “To provide dependable, high-quality cleaning services that allow our clients
            to enjoy a cleaner, more comfortable, and more professional space without
            having to worry about the details.”
          </p>
        </div>
      </section>

      {/* Why we do it */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center md:py-32">
        <p className="eyebrow">Why We Do It</p>
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          A clean environment changes how a space feels. It changes how you work, how you
          rest, and how you welcome people in. Most of our clients aren't short on
          standards — they're short on time. We want them to have one less thing to worry
          about.
        </p>
        <div className="hairline mt-16" />
        <blockquote className="mt-16 text-2xl leading-snug font-light md:text-4xl">
          <span className="text-silver-gradient">
            “We take care of the cleaning, so you can focus on what matters most.”
          </span>
        </blockquote>
      </section>

      {/* Standard */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <p className="eyebrow">Our Standard</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {standards.map((s, i) => (
              <div key={s.title} className="glow-panel rounded-lg p-8">
                <span className="text-xs tracking-[0.3em] text-steel">0{i + 1}</span>
                <h3 className="mt-5 text-sm tracking-[0.22em] text-primary uppercase">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-x-0 bottom-0 mx-auto h-64 max-w-2xl rounded-full bg-primary/20 blur-[130px]" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:py-36">
          <h2 className="text-3xl font-semibold md:text-5xl">
            <span className="text-silver-gradient">LET US TAKE CARE OF THE CLEANING.</span>
          </h2>
          <Link
            to="/estimate"
            className="mt-10 inline-flex rounded-md bg-primary px-9 py-4 text-[0.72rem] font-semibold tracking-[0.24em] text-primary-foreground uppercase transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
          >
            Request an Estimate
          </Link>
        </div>
      </section>
    </div>
  );
}
