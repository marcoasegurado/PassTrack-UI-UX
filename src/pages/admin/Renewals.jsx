import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { ButtonLink } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { FilterBar, FilterChip } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useStore } from "../../data/StoreProvider";
import { RENEWAL_STATUS, RENEWAL_STATUS_LABELS } from "../../lib/constants";
import { formatDate } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

export function AdminRenewals() {
  const { state } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  usePageTitle("Admin Renewals");
  const rows = useMemo(() => state.renewals.filter((renewal) => {
    if (filter !== "all" && renewal.status !== filter) return false;
    const term = search.trim().toLowerCase();
    return !term || [renewal.ref, renewal.applicantName, renewal.applicationId].join(" ").toLowerCase().includes(term);
  }), [filter, search, state.renewals]);
  const columns = [
    { key: "ref", header: "Reference", render: (row) => <Link to={`/admin/renewals/${row.ref}`} className="inline-flex min-h-6 items-center font-mono font-bold text-brand hover:underline">{row.ref}</Link> },
    { key: "applicant", header: "Applicant", render: (row) => <span><strong className="block">{row.applicantName}</strong><span className="text-xs text-muted">{row.applicationId}</span></span> },
    { key: "submitted", header: "Submitted", render: (row) => formatDate(row.submittedAt) },
    { key: "type", header: "Processing", render: (row) => row.draft?.processing || "—" },
    { key: "status", header: "Status", render: (row) => <StatusBadge kind="renewal" status={row.status} /> },
    { key: "action", header: "", render: (row) => <ButtonLink to={`/admin/renewals/${row.ref}`} variant="ghost" size="sm">Review</ButtonLink> },
  ];
  const count = (value) => state.renewals.filter((row) => row.status === value).length;
  return <AdminLayout title="Renewals" description="Review submitted passport renewal requests and record decisions.">
    <FilterBar search={search} onSearch={setSearch} searchPlaceholder="Search reference or applicant"><div role="group" aria-label="Filter renewals" className="flex flex-wrap gap-2"><FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All ({state.renewals.length})</FilterChip>{Object.values(RENEWAL_STATUS).map((value) => <FilterChip key={value} active={filter === value} onClick={() => setFilter(value)}>{RENEWAL_STATUS_LABELS[value]} ({count(value)})</FilterChip>)}</div></FilterBar>
    <section className="overflow-hidden rounded-panel border border-line bg-surface shadow-card"><div className="border-b border-line-soft px-5 py-4"><h2 id="renewals-caption" className="text-lg font-bold text-navy">Renewal queue</h2><p className="mt-1 text-xs text-muted">Showing {rows.length} of {state.renewals.length} renewal requests.</p></div><div role="region" aria-labelledby="renewals-caption" tabIndex="0" className="overflow-x-auto"><DataTable columns={columns} rows={rows} getRowKey={(row) => row.ref} emptyMessage="No renewals match these filters." /></div></section>
  </AdminLayout>;
}
