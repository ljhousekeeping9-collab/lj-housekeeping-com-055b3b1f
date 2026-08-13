import { createServerFn } from "@tanstack/react-start";

import { estimateSchema } from "./lead-schema";

export const submitEstimate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => estimateSchema.parse(input))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data: inserted, error } = await supabase
      .from("leads")
      .insert({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        property_address: data.propertyAddress,
        property_type: data.propertyType,
        square_footage: data.squareFootage,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        service_requested: data.serviceRequested,
        cleaning_frequency: data.cleaningFrequency,
        preferred_date: data.preferredDate,
        additional_details: data.additionalDetails,
        lead_source: data.leadSource,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to save lead", error);
      throw new Error("We couldn't save your request. Please try again.");
    }

    const { notifyNewLead } = await import("./notifications.server");
    await notifyNewLead({
      fullName: data.fullName,
      phone: data.phone,
      serviceRequested: data.serviceRequested,
    });

    return { leadId: inserted.id as string };
  });
