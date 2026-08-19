import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

import { LEAD_STATUSES } from "./lead-schema";

async function isAdmin(context: {
  supabase: { from: (table: "user_roles") => any };
  userId: string;
}) {
  const { data } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}

async function assertAdmin(context: Parameters<typeof isAdmin>[0]) {
  if (!(await isAdmin(context))) throw new Error("Forbidden");
}

export const getMyAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return { isAdmin: await isAdmin(context as never) };
  });


export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { data, error } = await context.supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const [lead, notes] = await Promise.all([
      context.supabase.from("leads").select("*").eq("id", data.id).single(),
      context.supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", data.id)
        .order("created_at", { ascending: false }),
    ]);
    if (lead.error) throw new Error(lead.error.message);
    return { lead: lead.data, notes: notes.data ?? [] };
  });

export const updateLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(LEAD_STATUSES) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase
      .from("leads")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const addLeadNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ leadId: z.string().uuid(), body: z.string().trim().min(1).max(2000) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase
      .from("lead_notes")
      .insert({ lead_id: data.leadId, body: data.body, author_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
