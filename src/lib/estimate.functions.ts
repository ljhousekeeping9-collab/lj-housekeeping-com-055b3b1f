import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const estimateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(30),
  email: z.string().trim().email().max(255),
  address: z.string().trim().min(1).max(200),
  propertyType: z.string().trim().max(50),
  size: z.string().trim().max(30).optional().default(""),
  bedrooms: z.string().trim().max(10).optional().default(""),
  bathrooms: z.string().trim().max(10).optional().default(""),
  service: z.string().trim().max(50),
  frequency: z.string().trim().max(50),
  details: z.string().trim().max(1000).optional().default(""),
  referral: z.string().trim().max(120).optional().default(""),
});

export type EstimateInput = z.input<typeof estimateSchema>;

const NOTIFY_NUMBER = "+17606978242";

export const submitEstimate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => estimateSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["PINGRAM_API_KEY"];
    if (!apiKey) throw new Error("PINGRAM_API_KEY missing");

    const { Pingram } = await import("pingram");
    const pingram = new Pingram({ apiKey });

    const message = [
      `New estimate request — LJ Housekeeping`,
      `${data.name} · ${data.phone}`,
      data.email,
      `${data.propertyType} · ${data.address}`,
      `${data.service} · ${data.frequency}`,
      data.details ? `Notes: ${data.details}` : "",
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 900);

    await pingram.sms.send({
      type: "welcome_sms",
      to: NOTIFY_NUMBER,
      message,
    });

    return { ok: true as const };
  });
