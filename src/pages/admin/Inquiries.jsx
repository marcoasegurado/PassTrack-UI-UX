import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { ButtonLink } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { FilterBar, FilterChip } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useStore } from "../../data/StoreProvider";
import { INQUIRY_STATUS, INQUIRY_STATUS_LABELS, INQUIRY_PRIORITIES, PRIORITY_TONE } from "../../lib/constants";
import { formatDate, formatRelative } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

export function AdminInquiries() {
  const { state } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("all");
  usePageTitle("Admin Inquiries");
  const rows = useMemo(() => state.inquiries.filter((item) => { if (filter !== "all" && item.status !== filter) return false; if (priority !== "all" && item.priority !== priority) return false; const term = search.trim().toLowerCase(); return !term || [item.id, item.subject, item.applicantName, item.category].join(" ").toLowerCase().includes(term); }), [filter, priority, search, state.inquiries]);
  const count = (value) => state.inquiries.filter((item) => item.status === value).length;
  const columns = [
    { key: "id", header: "Ticket", render: (row) => <Link to={`/admin/inquiries/${row.id}`} className="inline-flex min-h-6 items-center font-mono font-bold text-brand hover:underline">{row.id}</Link> },
    { key: "subject", header: "Subject", render: (row) => <span><strong className="block">{row.subject}</strong><span className="text-xs text-muted">{row.applicantName} · {row.category}</span></span> },
    { key: "updated", header: "Updated", render: (row) => formatRelative(row.updatedAt) },
    { key: "priority", header: "Priority", render: (row) => <StatusBadge tone={PRIORITY_TONE[row.priority] || "outline"}>{row.priority}</StatusBadge> },
    { key: "status", header: "Status", render: (row) => <StatusBadge kind="inquiry" status={row.status} /> },
    { key: "action", header: "", render: (row) => <ButtonLink to={`/admin/inquiries/${row.id}`} variant="ghost" size="sm">Open</ButtonLink> },
  ];
  return <AdminLayout title="Inquiries" description="Respond to members and keep ticket statuses current."><FilterBar search={search} onSearch={setSearch} searchPlaceholder="Search ticket or applicant" actions={<select aria-label="Filter by priority" value={priority} onChange={(event) => setPriority(event.target.value)} className="h-[42px] rounded-control border border-line bg-white px-3 text-sm"><option value="all">All priorities</option>{INQUIRY_PRIORITIES.map((item) => <option key={item} value={item}>{item} priority</option>)}</select>}><div role="group" aria-label="Filter inquiries" className="flex flex-wrap gap-2"><FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All ({state.inquiries.length})</FilterChip>{Object.values(INQUIRY_STATUS).map((value) => <FilterChip key={value} active={filter === value} onClick={() => setFilter(value)}>{INQUIRY_STATUS_LABELS[value]} ({count(value)})</FilterChip>)}</div></FilterBar><section className="overflow-hidden rounded-panel border border-line bg-surface shadow-card"><div className="border-b border-line-soft px-5 py-4"><h2 id="admin-inquiries-caption" className="text-lg font-bold text-navy">Inquiry queue</h2><p className="mt-1 text-xs text-muted">Showing {rows.length} of {state.inquiries.length} tickets.</p></div><div role="region" aria-labelledby="admin-inquiries-caption" tabIndex="0" className="overflow-x-auto"><DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} emptyMessage="No inquiries match these filters." /></div></section></AdminLayout>;
}
