import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ShieldCheck,
  Search,
  UserRoundCheck,
  Star,
} from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";
import differenceAsset from "@/assets/kitchen-difference.jpg.asset.json";
import { Logo } from "@/components/site/Logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LJ Housekeeping | Premium Residential & Commercial Cleaning" },
      {
        name: "description",
        content:
          "Professional cleaning services designed to keep your home or business looking its best. Request a personalized estimate from LJ Housekeeping.",
      },
      {
        property: "og:title",
        content: "LJ Housekeeping | Premium Residential & Commercial Cleaning",
      },
      {
        property: "og:description",
        content:
          "Your space. Our priority. Detail-focused cleaning for homes and businesses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: ShieldCheck,
    title: "Professional Service",
    body: "Reliable cleaning with attention to detail.",
  },
  {
    icon: Sparkles,
    title: "Consistent Results",
    body: "We focus on maintaining a clean, polished environment every time.",
  },
  {
    icon: Search,
    title: "Detail Focused",
    body: "We don't just clean — we pay attention to the details that make a space feel truly refreshed.",
  },
  {
    icon: UserRoundCheck,
    title: "Built Around You",
    body: "Cleaning services tailored to your home's or business's needs.",
  },
];

const services = [
  {
    title: "Residential Cleaning",
    body: "Professional cleaning designed to keep your home fresh, comfortable, and presentable.",
  },
  {
    title: "Commercial Cleaning",
    body: "Reliable cleaning solutions for offices, salons, businesses, and professional spaces.",
  },
  {
    title: "Deep Cleaning",
    body: "Detailed cleaning for spaces that need extra attention and a more thorough reset.",
  },
];

const faqs = [
  {
    question: "Do I need to be home while you clean?",
    answer:
      "Not necessarily. We can discuss access arrangements that work best for you before your service.",
  },
  {
    question: "How long does a cleaning typically take?",
    answer:
      "The time depends on the size and condition of the space, the type of cleaning requested, and the level of detail needed. Your estimate will help determine the appropriate service.",
  },
  {
    question: "Can I request specific areas to receive extra attention?",
    answer:
      "Absolutely. Let us know about any areas or priorities you have when requesting your estimate so we can take them into consideration.",
  },
  {
    question: "What should I do before my cleaning?",
    answer:
      "We recommend putting away personal or valuable items and clearing areas you'd like cleaned whenever possible. This allows our team to focus more time on cleaning.",
  },
  {
    question: "Can you clean around pets?",
    answer:
      "Yes. We understand that pets are part of the family. Please let us know about any pets or special considerations when requesting your estimate.",
  },
  {
    question: "Can I make changes to my cleaning service later?",
    answer:
      "Yes. If your cleaning needs change, contact us and we'll discuss the best option for your updated needs.",
  },
  {
    question: "What if I have a special cleaning request?",
    answer:
      "Just let us know. Include your request in the estimate form or discuss it with us when we follow up. We'll determine whether we can accommodate it.",
  },
  {
    question: "How do I get in touch with LJ Housekeeping?",
    answer:
      "You can contact us through the information provided on our website or submit a Request an Estimate form, and we'll get back to you.",
  },
];



function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Immaculate modern living space at night"
          width={1920}
          height={1280}
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent,var(--background)_75%)]" />
        <div className="absolute inset-x-0 top-1/3 -z-0 mx-auto h-64 max-w-2xl rounded-full bg-primary/20 blur-[120px]" />

        <div className="reveal relative z-10 mx-auto max-w-4xl px-6 pt-28 pb-20 text-center">
          <Logo className="mx-auto h-32 md:h-44" />
          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl md:text-7xl">
            <span className="text-silver-gradient">YOUR SPACE.</span>
            <br />
            <span className="text-primary">OUR PRIORITY.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Professional cleaning services designed to keep your home or business looking
            its best.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/estimate"
              className="w-full rounded-md bg-primary px-8 py-4 text-[0.72rem] font-semibold tracking-[0.24em] text-primary-foreground uppercase transition-all duration-300 hover:shadow-[var(--shadow-glow)] sm:w-auto"
            >
              Request an Estimate
            </Link>
            <Link
              to="/about"
              className="w-full rounded-md border border-border px-8 py-4 text-[0.72rem] tracking-[0.24em] text-foreground uppercase transition-all duration-300 hover:border-primary/60 hover:bg-secondary/50 sm:w-auto"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow">Why LJ Housekeeping</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            A standard you can see, every single visit.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="glow-panel rounded-lg p-7">
              <f.icon className="size-6 text-primary" strokeWidth={1.4} />
              <h3 className="mt-6 text-base font-semibold tracking-tight text-silver">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <p className="eyebrow">Our Services</p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold md:text-4xl">
            Tailored cleaning for every kind of space.
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {services.map((s, i) => (
              <div key={s.title} className="glow-panel rounded-lg p-8">
                <span className="text-xs tracking-[0.3em] text-steel">
                  0{i + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-silver">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/estimate"
              className="inline-flex rounded-md border border-primary/50 bg-primary/10 px-7 py-3.5 text-[0.7rem] tracking-[0.24em] uppercase transition-all duration-300 hover:bg-primary/25 hover:shadow-[var(--shadow-glow)]"
            >
              Request an Estimate
            </Link>
          </div>
        </div>
      </section>

      {/* Premium difference */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-primary/15 blur-[90px]" />
            <img
              src={differenceAsset.url}
              alt="Spotless modern kitchen with a polished quartz island"
              width={1209}
              height={1612}
              loading="lazy"
              className="relative rounded-xl border border-border object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">A Premium Difference</p>
            <h2 className="mt-5 text-3xl leading-tight font-semibold md:text-5xl">
              <span className="text-silver-gradient">A cleaner space.</span>
              <br />
              <span className="text-primary">A better experience.</span>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              LJ Housekeeping is built on professionalism, consistency, and an obsession
              with the details other services overlook. Every visit follows the same
              standard, so your space always feels considered, cared for, and ready.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              The result is simple: confidence in your space, and one less thing on your
              mind.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 py-24 md:px-10 md:py-32">
        <div className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            <span className="text-silver-gradient">Questions? We've got answers.</span>
          </h2>
        </div>
        <div className="mt-14">
          <Accordion type="single" collapsible className="glow-panel rounded-xl px-6 md:px-8">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/40 last:border-b-0"
              >
                <AccordionTrigger className="py-5 text-left text-sm font-medium text-silver transition-colors duration-300 hover:text-primary hover:no-underline md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-14 text-center">
          <h3 className="text-lg font-semibold text-silver md:text-xl">
            Still have questions?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            We're happy to help. Reach out or request your personalized estimate and we'll
            get back to you.
          </p>
          <Link
            to="/estimate"
            className="mt-8 inline-flex rounded-md bg-primary px-9 py-4 text-[0.72rem] font-semibold tracking-[0.24em] text-primary-foreground uppercase transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
          >
            Request an Estimate
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center md:px-10 md:py-32">
          <p className="eyebrow">What Our Clients Say</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            <span className="text-silver-gradient">Real experiences. Coming soon.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            We’re building our client community and look forward to sharing their
            experiences with LJ Housekeeping.
          </p>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-border/60 bg-secondary/30 px-6 py-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className="size-4 text-steel/60"
                  strokeWidth={1.4}
                />
              ))}
            </div>
            <span className="text-xs tracking-[0.2em] text-steel uppercase">
              Client reviews coming soon
            </span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-x-0 bottom-0 mx-auto h-72 max-w-3xl rounded-full bg-primary/20 blur-[130px]" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:py-36">
          <h2 className="text-3xl font-semibold md:text-5xl">
            <span className="text-silver-gradient">READY FOR A CLEANER SPACE?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground md:text-base">
            Tell us about your space and let us create a personalized estimate for you.
          </p>
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
