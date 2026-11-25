import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { InquiryShell } from "../../components/inquiries/InquiryShell";
import { NewInquiry } from "./NewInquiry";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { FilterBar, FilterChip } from "../../components/ui/FilterBar";
import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useStore } from "../../data/StoreProvider";
import {
  INQUIRY_CATEGORIES,
  INQUIRY_PRIORITIES,
  INQUIRY_STATUS,
  PRIORITY_TONE,
} from "../../lib/constants";
import { formatDate, formatRelative } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

const GROUPS = [
  {
    status: INQUIRY_STATUS.AWAITING,
    title: "Awaiting your reply",
    description: "An officer has responded and is waiting on you.",
  },
  {
    status: INQUIRY_STATUS.OPEN,
    title: "Open",
    description: "Submitted and currently with the review team.",
  },
  {
    status: INQUIRY_STATUS.RESOLVED,
    title: "Resolved",
    description: "Closed tickets kept for your records.",
  },
];

const STAT_TONES = {
  blue: "bg-tint text-brand",
  amber: "bg-amber-bg text-amber-ink",
  green: "bg-green-bg text-green-ink",
  slate: "bg-surface-muted text-slate-body",
};

function StatCard({ label, value, icon, tone = "slate" }) {
  return (
    <article className="flex items-center gap-3.5 rounded-card border border-line bg-surface p-4 shadow-card">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${STAT_TONES[tone]}`}
        aria-hidden="true"
      >
        <Icon name={icon} size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{label}</p>
        <p className="text-2xl font-bold leading-tight text-ink">{value}</p>
      </div>
    </article>
  );
}

function InquiryRow({ inquiry }) {
  return (
    <li>
      <Link
        to={`/inquiries/${inquiry.id}`}
        className="group flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition hover:bg-surface-muted sm:px-6"
      >
        <span className="w-[84px] shrink-0 font-mono text-xs font-bold text-brand">
          {inquiry.id}
        </span>

        <span className="min-w-0 flex-1 basis-[220px]">
          <span className="block truncate text-sm font-semibold text-ink group-hover:text-brand">
            {inquiry.subject}
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            {inquiry.category} · updated {formatRelative(inquiry.updatedAt)}
          </span>
        </span>

        <span className="hidden w-[90px] shrink-0 text-xs text-muted lg:block">
          {formatDate(inquiry.createdAt)}
        </span>

        <StatusBadge kind="inquiry" status={inquiry.status} className="hidden sm:inline-flex" />
        <StatusBadge
          tone={PRIORITY_TONE[inquiry.priority] || "outline"}
          className="hidden md:inline-flex"
        >
          {inquiry.priority || "Medium"}
        </StatusBadge>

        <Icon name="chevron-right" size={16} className="text-muted" />
      </Link>
    </li>
  );
}

export function Inquiries() {
  const { memberInquiries } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const newOpen = searchParams.get("new") === "1";

  usePageTitle("My Inquiries");

  function openNewInquiry() {
    const next = new URLSearchParams(searchParams);
    next.set("new", "1");
    setSearchParams(next);
  }

  function closeNewInquiry() {
    const next = new URLSearchParams(searchParams);
    next.delete("new");
    setSearchParams(next, { replace: true });
  }

  const counts = useMemo(
    () => ({
      all: memberInquiries.length,
      [INQUIRY_STATUS.OPEN]: memberInquiries.filter(
        (inquiry) => inquiry.status === INQUIRY_STATUS.OPEN,
      ).length,
      [INQUIRY_STATUS.AWAITING]: memberInquiries.filter(
        (inquiry) => inquiry.status === INQUIRY_STATUS.AWAITING,
      ).length,
      [INQUIRY_STATUS.RESOLVED]: memberInquiries.filter(
        (inquiry) => inquiry.status === INQUIRY_STATUS.RESOLVED,
      ).length,
    }),
    [memberInquiries],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return memberInquiries.filter((inquiry) => {
      if (statusFilter !== "all" && inquiry.status !== statusFilter) return false;
      if (priorityFilter !== "all" && inquiry.priority !== priorityFilter) return false;
      if (!term) return true;

      return [inquiry.id, inquiry.subject, inquiry.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [memberInquiries, priorityFilter, search, statusFilter]);

  const visibleGroups = GROUPS.filter((group) => group.status === statusFilter || statusFilter === "all")
    .map((group) => ({
      ...group,
      items: filtered.filter((inquiry) => inquiry.status === group.status),
    }))
    .filter((group) => group.items.length > 0);

  const filtersActive = Boolean(search.trim()) || statusFilter !== "all" || priorityFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  }

  return (
    <InquiryShell
      title="My Inquiries"
      description="Ask questions about your passport application and follow every officer response."
      actions={
        <Button onClick={openNewInquiry}>
          <Icon name="plus" size={15} />
          New inquiry
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total inquiries" value={counts.all} icon="message" tone="blue" />
        <StatCard
          label="Open"
          value={counts[INQUIRY_STATUS.OPEN]}
          icon="file-text"
          tone="slate"
        />
        <StatCard
          label="Awaiting your reply"
          value={counts[INQUIRY_STATUS.AWAITING]}
          icon="clock"
          tone="amber"
        />
        <StatCard
          label="Resolved"
          value={counts[INQUIRY_STATUS.RESOLVED]}
          icon="check-circle"
          tone="green"
        />
      </div>

      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search inquiries"
        actions={
          <select
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="h-[42px] cursor-pointer rounded-control border border-line bg-white px-3.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          >
            <option value="all">All priorities</option>
            {INQUIRY_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority} priority
              </option>
            ))}
          </select>
        }
      >
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          <FilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
            All ({counts.all})
          </FilterChip>
          <FilterChip
            active={statusFilter === INQUIRY_STATUS.OPEN}
            onClick={() => setStatusFilter(INQUIRY_STATUS.OPEN)}
          >
            Open ({counts[INQUIRY_STATUS.OPEN]})
          </FilterChip>
          <FilterChip
            active={statusFilter === INQUIRY_STATUS.AWAITING}
            onClick={() => setStatusFilter(INQUIRY_STATUS.AWAITING)}
          >
            Awaiting response ({counts[INQUIRY_STATUS.AWAITING]})
          </FilterChip>
          <FilterChip
            active={statusFilter === INQUIRY_STATUS.RESOLVED}
            onClick={() => setStatusFilter(INQUIRY_STATUS.RESOLVED)}
          >
            Resolved ({counts[INQUIRY_STATUS.RESOLVED]})
          </FilterChip>
        </div>
      </FilterBar>

      {memberInquiries.length === 0 && (
        <section className="rounded-panel border border-line bg-surface shadow-card">
          <EmptyState
            icon="message"
            title="No inquiries yet"
            description="Need help with your application, documents, or delivery? Start an inquiry and an officer will respond within one business day."
            action={
              <Button onClick={openNewInquiry}>
                <Icon name="plus" size={15} />
                Start new inquiry
              </Button>
            }
          />
        </section>
      )}

      {memberInquiries.length > 0 && visibleGroups.length === 0 && (
        <section className="rounded-panel border border-line bg-surface shadow-card">
          <EmptyState
            icon="search"
            title="No matching inquiries"
            description="Try a different search term, status, or priority filter."
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        </section>
      )}

      {visibleGroups.map((group) => (
        <section
          key={group.status}
          className="overflow-hidden rounded-panel border border-line bg-surface shadow-card"
        >
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-navy">{group.title}</h2>
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-bold text-muted">
                {group.items.length}
              </span>
            </div>
            <p className="text-xs text-muted">{group.description}</p>
          </header>

          <ul className="divide-y divide-line-soft">
            {group.items.map((inquiry) => (
              <InquiryRow key={inquiry.id} inquiry={inquiry} />
            ))}
          </ul>
        </section>
      ))}

      <p className="text-xs text-muted" aria-live="polite">
        Showing {filtered.length} of {memberInquiries.length} inquiries
        {filtersActive ? " · filters applied" : ""}
      </p>

      <NewInquiry open={newOpen} onClose={closeNewInquiry} />
    </InquiryShell>
  );
}
