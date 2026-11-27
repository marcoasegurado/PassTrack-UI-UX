import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { ButtonLink } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useStore } from "../../data/StoreProvider";
import { cn } from "../../lib/cn";
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

  const count = (value) => state.applications.filter((row) => row.status === value).length;

  const columns = [
    { key: "id", header: "Application", render: (row) => <Link to={`/admin/applications/${row.id}`} className="inline-flex min-h-6 items-center font-mono font-bold text-brand hover:text-brand-strong">{row.id}</Link> },
    { key: "applicant", header: "Applicant", render: (row) => <span><strong className="block">{row.applicantName}</strong><span className="text-xs text-muted">{row.email}</span></span> },
    { key: "type", header: "Application type", render: (row) => <span>{row.applicationType}<br /><span className="text-xs text-muted">{row.processingType}</span></span> },
    { key: "submitted", header: "Submitted", render: (row) => formatDate(row.submittedAt) },
    { key: "status", header: "Status", render: (row) => <StatusBadge kind="application" status={row.status} /> },
    { key: "action", header: "", render: (row) => <ButtonLink to={`/admin/applications/${row.id}`} variant="ghost" size="sm">Review</ButtonLink> },
  ];

  return (
    <AdminLayout title="Applications" description="Search applications and update their canonical processing status.">
      <FilterBar search={search} onSearch={setSearch} searchPlaceholder="Search ID or applicant">
        <div className="relative w-full sm:w-auto">
          <Icon
            name="filter"
            size={16}
            className={cn(
              "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2",
              status === "all" ? "text-muted" : "text-brand",
            )}
          />
          <select
            aria-label="Filter applications by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={cn(
              "h-[42px] w-full cursor-pointer rounded-control border bg-white pl-10 pr-8 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 sm:w-auto sm:min-w-[220px]",
              status === "all"
                ? "border-line text-ink"
                : "border-brand bg-tint font-semibold text-brand",
            )}
          >
            <option value="all">All statuses ({state.applications.length})</option>
            {STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {APPLICATION_STATUS_LABELS[item]} ({count(item)})
              </option>
            ))}
          </select>
        </div>
      </FilterBar>
      <section className="overflow-hidden rounded-panel border border-line bg-surface shadow-card">
        <div className="border-b border-line-soft px-5 py-4"><h2 id="applications-caption" className="text-lg font-bold text-navy">Application queue</h2><p className="mt-1 text-xs text-muted">Showing {rows.length} of {state.applications.length} applications.</p></div>
        <div role="region" aria-labelledby="applications-caption" tabIndex="0" className="overflow-x-auto"><DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} emptyMessage="No applications match these filters." /></div>
      </section>
    </AdminLayout>
  );
}
