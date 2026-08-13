import { z } from "zod";

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Estimate Sent",
  "Follow-Up",
  "Won",
  "Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const PROPERTY_TYPES = [
  "Residential",
  "Office",
  "Salon",
  "Retail",
  "Other",
] as const;

export const SERVICES = [
  "Standard Cleaning",
  "Deep Cleaning",
  "Recurring Cleaning",
  "Commercial Cleaning",
  "Move-In / Move-Out Cleaning",
  "Other",
] as const;

export const FREQUENCIES = ["One-Time", "Weekly", "Bi-Weekly", "Monthly", "Other"] as const;

export const LEAD_SOURCES = [
  "Google",
  "Instagram",
  "Facebook",
  "Referral",
  "Website",
  "Other",
] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

export const estimateSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  phone: z.string().trim().min(7, "Phone number is required").max(30),
  email: z.string().trim().email("Enter a valid email").max(255),
  propertyAddress: z.string().trim().min(1, "Property address is required").max(250),
  propertyType: z.enum(PROPERTY_TYPES),
  squareFootage: optionalText(30),
  bedrooms: optionalText(10),
  bathrooms: optionalText(10),
  serviceRequested: z.enum(SERVICES),
  cleaningFrequency: z
    .enum(FREQUENCIES)
    .optional()
    .transform((v) => (v ? v : null)),
  preferredDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  additionalDetails: optionalText(1500),
  leadSource: z
    .enum(LEAD_SOURCES)
    .optional()
    .transform((v) => (v ? v : null)),
});

export type EstimateInput = z.input<typeof estimateSchema>;
