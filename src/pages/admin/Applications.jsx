import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { ButtonLink } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { FilterBar, FilterChip } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useStore } from "../../data/StoreProvider";
import { APPLICATION_STATUS, APPLICATION_STATUS_LABELS } from "../../lib/constants";
import { formatDate } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

const STATUS_OPTIONS = Object.values(APPLICATION_STATUS);

export function AdminApplications() {
  const { state } = useStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  usePageTitle("Admin Applications");

  const rows = useMemo(() => state.applications.filter((application) => {
    if (status !== "all" && application.status !== status) return false;
    const term = search.trim().toLowerCase();
    return !term || [application.id, application.applicantName, application.email, application.status].join(" ").toLowerCase().includes(term);
  }), [search, state.applications, status]);

  const columns = [
    { key: "id", header: "Application", render: (row) => <Link to={`/admin/applications/${row.id}`} className="inline-flex min-h-6 items-center font-mono font-bold text-brand hover:underline">{row.id}</Link> },
    { key: "applicant", header: "Applicant", render: (row) => <span><strong className="block">{row.applicantName}</strong><span className="text-xs text-muted">{row.email}</span></span> },
    { key: "type", header: "Application type", render: (row) => <span>{row.applicationType}<br /><span className="text-xs text-muted">{row.processingType}</span></span> },
    { key: "submitted", header: "Submitted", render: (row) => formatDate(row.submittedAt) },
    { key: "status", header: "Status", render: (row) => <StatusBadge kind="application" status={row.status} /> },
    { key: "action", header: "", render: (row) => <ButtonLink to={`/admin/applications/${row.id}`} variant="ghost" size="sm">Review</ButtonLink> },
  ];

  return (
    <AdminLayout title="Applications" description="Search applications and update their canonical processing status.">
      <FilterBar search={search} onSearch={setSearch} searchPlaceholder="Search ID or applicant">
        <div role="group" aria-label="Filter applications by status" className="flex flex-wrap gap-2">
          <FilterChip active={status === "all"} onClick={() => setStatus("all")}>All ({state.applications.length})</FilterChip>
          {STATUS_OPTIONS.map((item) => <FilterChip key={item} active={status === item} onClick={() => setStatus(item)}>{APPLICATION_STATUS_LABELS[item]} ({state.applications.filter((row) => row.status === item).length})</FilterChip>)}
        </div>
      </FilterBar>
      <section className="overflow-hidden rounded-panel border border-line bg-surface shadow-card">
        <div className="border-b border-line-soft px-5 py-4"><h2 id="applications-caption" className="text-lg font-bold text-navy">Application queue</h2><p className="mt-1 text-xs text-muted">Showing {rows.length} of {state.applications.length} applications.</p></div>
        <div role="region" aria-labelledby="applications-caption" tabIndex="0" className="overflow-x-auto"><DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} emptyMessage="No applications match these filters." /></div>
      </section>
    </AdminLayout>
  );
}
