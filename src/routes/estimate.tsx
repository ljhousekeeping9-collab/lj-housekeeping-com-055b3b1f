import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { submitEstimate } from "@/lib/estimate.functions";
import {
  FREQUENCIES,
  LEAD_SOURCES,
  PROPERTY_TYPES,
  SERVICES,
  estimateSchema,
} from "@/lib/lead-schema";

export const Route = createFileRoute("/estimate")({
  head: () => ({
    meta: [
      { title: "Request an Estimate | LJ Housekeeping" },
      {
        name: "description",
        content:
          "Tell us about your space and receive a personalized cleaning estimate from LJ Housekeeping. Residential, commercial, and deep cleaning.",
      },
      { property: "og:title", content: "Request an Estimate | LJ Housekeeping" },
      {
        property: "og:description",
        content: "Share a few details and we'll get back to you with your estimate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Estimate,
});

const fieldClass =
  "w-full rounded-md border border-input bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-primary/70 focus:shadow-[var(--shadow-glow)]";
const labelClass =
  "mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground";

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string | undefined;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {error && <span className="mt-2 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="text-xs tracking-[0.3em] text-primary">{index}</span>
      <h2 className="text-sm tracking-[0.24em] text-silver uppercase">{title}</h2>
    </div>
  );
}

function Estimate() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const send = useServerFn(submitEstimate);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = Object.fromEntries(
      Array.from(new FormData(e.currentTarget).entries()).map(([k, v]) => [k, String(v)]),
    );

    const parsed = estimateSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setSending(true);
    try {
      await send({ data: raw as never });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Something went wrong. Please call us at (760) 697-8242.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 mx-auto h-72 max-w-3xl rounded-full bg-primary/15 blur-[140px]" />

      <div className="relative mx-auto max-w-3xl px-5 pt-36 pb-24 md:pt-44 md:pb-32">
        {submitted ? (
          <div className="reveal glow-panel rounded-xl p-10 text-center md:p-16">
            <CheckCircle2 className="mx-auto size-10 text-primary" strokeWidth={1.2} />
            <h1 className="mt-8 text-2xl font-semibold md:text-4xl">
              <span className="text-silver-gradient">
                THANK YOU FOR CHOOSING LJ HOUSEKEEPING
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              We've received your estimate request and will review the details provided.
              We'll be in touch soon.
            </p>
            <Link
              to="/"
              className="mt-10 inline-flex rounded-md bg-primary px-8 py-4 text-[0.72rem] font-semibold tracking-[0.24em] text-primary-foreground uppercase transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="eyebrow">LJ Housekeeping</p>
              <h1 className="mt-5 text-3xl font-semibold md:text-5xl">
                <span className="text-silver-gradient">REQUEST YOUR ESTIMATE</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Tell us a little about your space and what you're looking for. We'll review
                your request and get back to you with your estimate.
              </p>
            </div>

            <form onSubmit={onSubmit} noValidate className="mt-16 space-y-14">
              <section>
                <SectionTitle index="01" title="Contact Information" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Full Name" error={errors["fullName"]}>
                      <input
                        required
                        name="fullName"
                        autoComplete="name"
                        className={fieldClass}
                        maxLength={100}
                      />
                    </Field>
                  </div>
                  <Field label="Phone Number" error={errors["phone"]}>
                    <input
                      required
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className={fieldClass}
                      maxLength={30}
                    />
                  </Field>
                  <Field label="Email Address" error={errors["email"]}>
                    <input
                      required
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className={fieldClass}
                      maxLength={255}
                    />
                  </Field>
                </div>
              </section>

              <div className="hairline" />

              <section>
                <SectionTitle index="02" title="Property Information" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Property Address" error={errors["propertyAddress"]}>
                      <input
                        required
                        name="propertyAddress"
                        autoComplete="street-address"
                        className={fieldClass}
                        maxLength={250}
                      />
                    </Field>
                  </div>
                  <Field label="Property Type" error={errors["propertyType"]}>
                    <select
                      required
                      name="propertyType"
                      defaultValue=""
                      className={fieldClass}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Approximate Square Footage">
                    <input
                      name="squareFootage"
                      inputMode="numeric"
                      className={fieldClass}
                      maxLength={30}
                    />
                  </Field>
                  <Field label="Bedrooms">
                    <input
                      name="bedrooms"
                      inputMode="numeric"
                      className={fieldClass}
                      maxLength={10}
                    />
                  </Field>
                  <Field label="Bathrooms">
                    <input
                      name="bathrooms"
                      inputMode="numeric"
                      className={fieldClass}
                      maxLength={10}
                    />
                  </Field>
                </div>
              </section>

              <div className="hairline" />

              <section>
                <SectionTitle index="03" title="Service Information" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Service Requested" error={errors["serviceRequested"]}>
                    <select
                      required
                      name="serviceRequested"
                      defaultValue=""
                      className={fieldClass}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {SERVICES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Cleaning Frequency">
                    <select name="cleaningFrequency" defaultValue="" className={fieldClass}>
                      <option value="">Select</option>
                      {FREQUENCIES.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Preferred Date">
                    <input name="preferredDate" type="date" className={fieldClass} />
                  </Field>
                  <Field label="How did you hear about us?">
                    <select name="leadSource" defaultValue="" className={fieldClass}>
                      <option value="">Select</option>
                      {LEAD_SOURCES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Additional Details / Special Requests">
                      <textarea
                        name="additionalDetails"
                        rows={5}
                        maxLength={1500}
                        className={`${fieldClass} resize-none`}
                      />
                    </Field>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-primary px-8 py-4 text-[0.72rem] font-semibold tracking-[0.24em] text-primary-foreground uppercase transition-all duration-300 hover:shadow-[var(--shadow-glow)] disabled:opacity-60"
              >
                {sending && <Loader2 className="size-4 animate-spin" />}
                {sending ? "Sending Your Request" : "Request My Estimate"}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Every estimate is customized to your space. No fixed pricing.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
