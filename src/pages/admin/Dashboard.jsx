import { Link } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { ButtonLink } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Icon } from "../../components/ui/Icon";
import { useStore } from "../../data/StoreProvider";
import { INQUIRY_STATUS, RENEWAL_STATUS } from "../../lib/constants";
import { formatDate, formatRelative } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

function Metric({ label, value, icon, tone = "text-brand" }) {
  return (
    <article className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 shadow-card">
      <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-tint ${tone}`}><Icon name={icon} size={19} /></span>
      <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p><p className="text-2xl font-bold text-ink">{value}</p></div>
    </article>
  );
}

export function AdminDashboard() {
  const { state, adminMetrics } = useStore();
  usePageTitle("Admin Dashboard");

  const recentApplications = [...state.applications].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
  const pendingRenewals = state.renewals.filter((item) => item.status === RENEWAL_STATUS.PENDING);
  const activeInquiries = state.inquiries.filter((item) => item.status !== INQUIRY_STATUS.RESOLVED);

  return (
    <AdminLayout title="Dashboard" description="Review the latest member activity across PASSTRACK.">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Applications" value={state.applications.length} icon="file-text" />
        <Metric label="In review" value={adminMetrics.underReview + adminMetrics.processing} icon="clock" tone="text-amber-ink" />
        <Metric label="Renewals pending" value={pendingRenewals.length} icon="refresh" tone="text-amber-ink" />
        <Metric label="Active inquiries" value={activeInquiries.length} icon="message" />
        <Metric label="Members" value={state.members.length} icon="user" tone="text-green-ink" />
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,.8fr)]">
        <section className="overflow-hidden rounded-panel border border-line bg-surface shadow-card">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-4 sm:px-6">
            <div><h2 className="text-lg font-bold text-navy">Recent applications</h2><p className="mt-1 text-xs text-muted">Latest status changes across member applications.</p></div>
            <ButtonLink to="/admin/applications" variant="outline" size="sm">View all</ButtonLink>
          </header>
          <ul className="divide-y divide-line-soft">
            {recentApplications.map((application) => (
              <li key={application.id}>
                <Link to={`/admin/applications/${application.id}`} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-surface-muted sm:px-6">
                  <span className="w-20 font-mono text-xs font-bold text-brand">{application.id}</span>
                  <span className="min-w-0 flex-1"><strong className="block truncate text-sm text-ink">{application.applicantName}</strong><span className="text-xs text-muted">Updated {formatRelative(application.updatedAt)}</span></span>
                  <StatusBadge kind="application" status={application.status} />
                  <Icon name="chevron-right" size={15} className="text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-navy">Renewals needing review</h2><span className="rounded-full bg-amber-bg px-2.5 py-1 text-xs font-bold text-amber-ink">{pendingRenewals.length}</span></div>
            <div className="mt-3 flex flex-col gap-3">
              {pendingRenewals.slice(0, 3).map((renewal) => <Link key={renewal.ref} to={`/admin/renewals/${renewal.ref}`} className="flex items-center justify-between gap-3 rounded-control bg-surface-muted px-3 py-2.5 text-sm hover:bg-tint"><span><strong className="block font-mono text-brand">{renewal.ref}</strong><span className="text-xs text-muted">{renewal.applicantName}</span></span><Icon name="chevron-right" size={15} className="text-muted" /></Link>)}
              {!pendingRenewals.length && <p className="text-sm text-muted">No pending renewals.</p>}
            </div>
            <ButtonLink to="/admin/renewals" block variant="outline" size="sm" className="mt-4">Open renewal queue</ButtonLink>
          </section>
          <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-navy">Inquiry queue</h2><span className="rounded-full bg-tint px-2.5 py-1 text-xs font-bold text-brand">{activeInquiries.length}</span></div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{activeInquiries.length ? "Member tickets need an administrator response or status update." : "All member inquiries are resolved."}</p>
            <ButtonLink to="/admin/inquiries" block variant="outline" size="sm" className="mt-4">Open inquiry queue</ButtonLink>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
