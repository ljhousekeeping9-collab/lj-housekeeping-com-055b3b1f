/**
 * SMS notification layer. Credentials are read from server-side environment
 * variables only — never from the client bundle.
 *
 * Swapping providers (Twilio, another CRM) only requires re-implementing
 * `sendSms` below; the message templates stay the same.
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
  serviceRequested: string;
};

export function internalLeadMessage(lead: LeadNotificationData): string {
  return `NEW LJ HOUSEKEEPING LEAD — ${lead.fullName} requested an estimate for ${lead.serviceRequested}. Phone: ${lead.phone}. View the lead dashboard for details.`;
}

export function customerConfirmationMessage(lead: LeadNotificationData): string {
  return `Hi ${lead.fullName}, thank you for contacting LJ Housekeeping! We've received your estimate request and will review the details provided. We'll be in touch soon.`;
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
}
