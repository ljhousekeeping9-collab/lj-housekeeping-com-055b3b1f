/**
 * Notification layer (SMS + email backup).
 *
 * All credentials are read from server-side environment variables only — never
 * from the client bundle. Swapping providers only requires re-implementing
 * `sendSms` / `sendEmail`; the message templates stay the same.
 */

type SmsPayload = { to: string; message: string; type: string };

async function sendSms({ to, message, type }: SmsPayload): Promise<void> {
  const apiKey = process.env["PINGRAM_API_KEY"];
  if (!apiKey) {
    console.warn("PINGRAM_API_KEY not configured — skipping SMS notification");
    return;
  }

  try {
    const { Pingram } = await import("pingram");
    const pingram = new Pingram({ apiKey });
    await pingram.sms.send({ type, to, message });
  } catch (error) {
    // Never fail the lead submission because a notification failed.
    console.error("SMS notification failed", error);
  }
}

export type LeadNotificationData = {
  fullName: string;
  phone: string;
  email?: string;
  propertyAddress?: string | null;
  propertyType?: string | null;
  squareFootage?: string | null;
  bedrooms?: string | null;
  bathrooms?: string | null;
  serviceRequested: string;
  cleaningFrequency?: string | null;
  preferredDate?: string | null;
  additionalDetails?: string | null;
  leadSource?: string | null;
};

export function internalLeadMessage(lead: LeadNotificationData): string {
  return `NEW LJ HOUSEKEEPING LEAD

Name: ${lead.fullName}
Service: ${lead.serviceRequested}
Property: ${lead.propertyType ?? "—"}
Phone: ${lead.phone}

Open the LJ Housekeeping dashboard to view the full request.`;
}

export function customerConfirmationMessage(lead: LeadNotificationData): string {
  return `Hi ${lead.fullName}, thank you for contacting LJ Housekeeping! We've received your estimate request and will review the details provided. We'll be in touch soon. — LJ Housekeeping`;
}

export function leadEmailSubject(lead: LeadNotificationData): string {
  return `New estimate request — ${lead.fullName} (${lead.serviceRequested})`;
}

export function leadEmailBody(lead: LeadNotificationData): string {
  const rows: [string, string | null | undefined][] = [
    ["Name", lead.fullName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Property address", lead.propertyAddress],
    ["Property type", lead.propertyType],
    ["Square footage", lead.squareFootage],
    ["Bedrooms", lead.bedrooms],
    ["Bathrooms", lead.bathrooms],
    ["Service requested", lead.serviceRequested],
    ["Cleaning frequency", lead.cleaningFrequency],
    ["Preferred date", lead.preferredDate],
    ["Lead source", lead.leadSource],
    ["Additional details", lead.additionalDetails],
  ];

  return [
    "NEW LJ HOUSEKEEPING LEAD",
    "",
    ...rows.map(([label, value]) => `${label}: ${value || "—"}`),
    "",
    "Open the LJ Housekeeping dashboard to manage this lead.",
  ].join("\n");
}

/**
 * Email backup. Wired to send as soon as an email provider key is configured
 * (RESEND_API_KEY) plus a destination address (LJ_NOTIFY_EMAIL).
 */
async function sendLeadEmail(lead: LeadNotificationData): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["LJ_NOTIFY_EMAIL"];
  const from = process.env["LJ_EMAIL_FROM"];

  if (!apiKey || !to || !from) {
    console.warn("Email provider not configured — skipping lead email backup");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: leadEmailSubject(lead),
        text: leadEmailBody(lead),
      }),
    });
    if (!response.ok) {
      console.error("Lead email failed", response.status, await response.text());
    }
  } catch (error) {
    console.error("Lead email failed", error);
  }
}

export async function notifyNewLead(lead: LeadNotificationData): Promise<void> {
  const internalNumber = process.env["LJ_NOTIFY_PHONE"] ?? "+17606978242";

  await sendSms({
    to: internalNumber,
    message: internalLeadMessage(lead),
    type: "new_lead_internal",
  });

  // Customer confirmation SMS — enabled once the provider number is verified
  // for outbound customer messaging.
  if (process.env["LJ_SEND_CUSTOMER_SMS"] === "true") {
    await sendSms({
      to: lead.phone,
      message: customerConfirmationMessage(lead),
      type: "new_lead_customer",
    });
  }

  await sendLeadEmail(lead);
}
