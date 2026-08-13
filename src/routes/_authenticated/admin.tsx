import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/lead-schema";
import {
  addLeadNote,
  getLead,
  getMyAdminAccess,
  listLeads,
  updateLeadStatus,
} from "@/lib/leads.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Lead Dashboard | LJ Housekeeping" },
      {
        name: "description",
        content: "Private LJ Housekeeping dashboard for managing estimate request leads.",
      },
      { property: "og:title", content: "Lead Dashboard | LJ Housekeeping" },
      {
        property: "og:description",
        content: "Private dashboard for managing estimate requests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

type Lead = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string;
  property_address: string;
  property_type: string;
  square_footage: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  service_requested: string;
  cleaning_frequency: string | null;
  preferred_date: string | null;
  additional_details: string | null;
  lead_source: string | null;
  status: LeadStatus;
};

const statusTone: Record<LeadStatus, string> = {
  New: "border-primary/50 text-primary",
  Contacted: "border-silver/40 text-silver",
  "Estimate Sent": "border-silver/40 text-silver",
  "Follow-Up": "border-silver/40 text-silver",
  Won: "border-primary/50 text-primary",
  Lost: "border-muted-foreground/30 text-muted-foreground",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchAccess = useServerFn(getMyAdminAccess);
  const fetchLeads = useServerFn(listLeads);
  const fetchLead = useServerFn(getLead);
  const setStatus = useServerFn(updateLeadStatus);
  const createNote = useServerFn(addLeadNote);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | LeadStatus>("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [openId, setOpenId] = useState<string | null>(null);

  const access = useQuery({ queryKey: ["admin-access"], queryFn: () => fetchAccess({}) });

  const leadsQuery = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchLeads({}) as Promise<Lead[]>,
    enabled: access.data?.isAdmin === true,
  });

  const detailQuery = useQuery({
    queryKey: ["lead", openId],
    queryFn: () => fetchLead({ data: { id: openId! } }),
    enabled: !!openId,
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: LeadStatus }) => setStatus({ data: vars }),
    onSuccess: () => {
      toast.success("Lead status updated");
      void queryClient.invalidateQueries({ queryKey: ["leads"] });
      void queryClient.invalidateQueries({ queryKey: ["lead"] });
    },
    onError: () => toast.error("Could not update the status"),
  });

  const noteMutation = useMutation({
    mutationFn: (vars: { leadId: string; body: string }) => createNote({ data: vars }),
    onSuccess: () => {
      toast.success("Note added");
      void queryClient.invalidateQueries({ queryKey: ["lead"] });
    },
    onError: () => toast.error("Could not add the note"),
  });

  const allLeads = useMemo(() => leadsQuery.data ?? [], [leadsQuery.data]);

  const counts = useMemo(() => {
    const base: Record<string, number> = {};
    for (const s of LEAD_STATUSES) base[s] = 0;
    for (const lead of allLeads) base[lead.status] = (base[lead.status] ?? 0) + 1;
    return base;
  }, [allLeads]);

  const serviceOptions = useMemo(
    () => Array.from(new Set(allLeads.map((l) => l.service_requested))).sort(),
    [allLeads],
  );
  const propertyOptions = useMemo(
    () => Array.from(new Set(allLeads.map((l) => l.property_type))).sort(),
    [allLeads],
  );

  const leads = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = allLeads.filter((lead) => {
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      const matchesService =
        serviceFilter === "All" || lead.service_requested === serviceFilter;
      const matchesProperty =
        propertyFilter === "All" || lead.property_type === propertyFilter;
      const matchesSearch =
        !q ||
        [lead.full_name, lead.phone, lead.email, lead.property_address, lead.service_requested]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesStatus && matchesService && matchesProperty && matchesSearch;
    });
    return [...rows].sort((a, b) =>
      sort === "newest"
        ? b.created_at.localeCompare(a.created_at)
        : a.created_at.localeCompare(b.created_at),
    );
  }, [allLeads, search, statusFilter, serviceFilter, propertyFilter, sort]);

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ to: "/auth" });
  };

  if (access.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-32">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!access.data?.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-5 pt-40 pb-32 text-center">
        <h1 className="text-2xl font-semibold">
          <span className="text-silver-gradient">ACCESS RESTRICTED</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This account does not have lead dashboard access.
        </p>
        <button
          onClick={signOut}
          className="mt-8 rounded-md border border-input px-6 py-3 text-[0.7rem] tracking-[0.24em] uppercase transition-colors hover:border-primary/60"
        >
          Sign out
        </button>
      </div>
    );
  }

  const detail = detailQuery.data?.lead as Lead | undefined;
  const notes = (detailQuery.data?.notes ?? []) as {
    id: string;
    body: string;
    created_at: string;
  }[];

  const onAddNote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const body = String(new FormData(form).get("body") ?? "").trim();
    if (!body || !openId) return;
    noteMutation.mutate({ leadId: openId, body });
    form.reset();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">LJ Housekeeping</p>
          <h1 className="mt-3 text-2xl font-semibold md:text-4xl">
            <span className="text-silver-gradient">LEAD DASHBOARD</span>
          </h1>
        </div>
        <button
          onClick={signOut}
          className="rounded-md border border-input px-5 py-2.5 text-[0.66rem] tracking-[0.24em] uppercase transition-colors hover:border-primary/60"
        >
          Sign out
        </button>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email, address"
            className="w-full rounded-md border border-input bg-secondary/40 py-3 pr-4 pl-11 text-sm outline-none transition-all focus:border-primary/70"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "All" | LeadStatus)}
          className="rounded-md border border-input bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary/70"
        >
          <option value="All">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 space-y-3">
        {leadsQuery.isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        )}
        {!leadsQuery.isLoading && leads.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">No leads found.</p>
        )}
        {leads.map((lead) => (
          <button
            key={lead.id}
            onClick={() => setOpenId(lead.id)}
            className="glow-panel flex w-full flex-wrap items-center justify-between gap-4 rounded-lg px-5 py-4 text-left"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{lead.full_name}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {lead.service_requested} · {lead.phone}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {formatDate(lead.created_at)}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-[0.62rem] tracking-[0.16em] uppercase ${statusTone[lead.status]}`}
              >
                {lead.status}
              </span>
            </div>
          </button>
        ))}
      </div>

      {openId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm">
          <div className="h-full w-full max-w-lg overflow-y-auto border-l border-border bg-card p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold">
                <span className="text-silver-gradient">
                  {detail?.full_name ?? "Loading…"}
                </span>
              </h2>
              <button
                onClick={() => setOpenId(null)}
                aria-label="Close lead"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <X className="size-5" />
              </button>
            </div>

            {detailQuery.isLoading || !detail ? (
              <div className="flex justify-center py-20">
                <Loader2 className="size-5 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <p className="mt-2 text-xs text-muted-foreground">
                  Lead ID {detail.id} · Submitted {formatDate(detail.created_at)}
                </p>

                <div className="mt-6">
                  <label className="mb-2 block text-[0.66rem] tracking-[0.2em] text-muted-foreground uppercase">
                    Status
                  </label>
                  <select
                    value={detail.status}
                    onChange={(e) =>
                      statusMutation.mutate({
                        id: detail.id,
                        status: e.target.value as LeadStatus,
                      })
                    }
                    className="w-full rounded-md border border-input bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary/70"
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <dl className="mt-8 space-y-3 text-sm">
                  {[
                    ["Phone", detail.phone],
                    ["Email", detail.email],
                    ["Address", detail.property_address],
                    ["Property type", detail.property_type],
                    ["Square footage", detail.square_footage],
                    ["Bedrooms", detail.bedrooms],
                    ["Bathrooms", detail.bathrooms],
                    ["Service", detail.service_requested],
                    ["Frequency", detail.cleaning_frequency],
                    ["Preferred date", detail.preferred_date],
                    ["Lead source", detail.lead_source],
                    ["Details", detail.additional_details],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-4 border-b border-border/60 pb-3">
                      <dt className="w-36 shrink-0 text-xs tracking-[0.14em] text-muted-foreground uppercase">
                        {label}
                      </dt>
                      <dd className="min-w-0 break-words">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8">
                  <h3 className="text-xs tracking-[0.2em] text-silver uppercase">
                    Internal notes
                  </h3>
                  <form onSubmit={onAddNote} className="mt-4 space-y-3">
                    <textarea
                      name="body"
                      rows={3}
                      maxLength={2000}
                      placeholder="Add an internal note…"
                      className="w-full resize-none rounded-md border border-input bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary/70"
                    />
                    <button
                      type="submit"
                      disabled={noteMutation.isPending}
                      className="rounded-md bg-primary px-5 py-2.5 text-[0.66rem] font-semibold tracking-[0.2em] text-primary-foreground uppercase disabled:opacity-60"
                    >
                      Add note
                    </button>
                  </form>

                  <ul className="mt-6 space-y-3">
                    {notes.map((note) => (
                      <li key={note.id} className="rounded-md border border-border/60 p-4">
                        <p className="text-sm whitespace-pre-wrap">{note.body}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {formatDate(note.created_at)}
                        </p>
                      </li>
                    ))}
                    {notes.length === 0 && (
                      <li className="text-xs text-muted-foreground">No notes yet.</li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
