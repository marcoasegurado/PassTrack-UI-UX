import { AppHeader } from "../../components/layout/AppHeader";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { DataTable } from "../../components/ui/DataTable";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { displayTicket, formatDate, formatDateTime } from "../../lib/format";
import {
  APPLICATION_STATUS,
  RENEWAL_STATUS,
} from "../../lib/constants";
import { DEMO_MEMBER_VARIANTS } from "../../data/seed";

export function StoreCheck() {
  const toast = useToast();
  const {
    state,
    member,
    application,
    latestRenewal,
    adminMetrics,
    isMemberLoggedIn,
    isAdminLoggedIn,
    loginMember,
    logoutMember,
    loginAdmin,
    logoutAdmin,
    updateApplicationStatus,
    decideRenewal,
    addInquiry,
    resetDemo,
  } = useStore();

  function run(label, result) {
    if (result?.ok === false) {
      toast(result.error || "Action failed.");
      return;
    }
    toast(label);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        context="Store check"
        homeTo="/store-check"
        actions={[
          { label: "UI kit", href: "/styleguide" },
          { label: "Prototype", href: "/prototype/login.html" },
        ]}
      />

      <main className="shell flex-1 space-y-6 px-4 py-8 sm:px-6 lg:px-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Step 4
          </p>
          <h1 className="mt-1 text-3xl font-bold text-navy">Mock store check</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            Verifies seeded records, member and admin sessions, shared status updates,
            renewal decisions, inquiry creation, and local persistence.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard title="Member session" bodyClassName="p-5">
            {isMemberLoggedIn ? (
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-ink">{member?.name}</p>
                <p className="text-muted">{member?.appId}</p>
                <p className="text-muted">
                  Application: {application?.status || "none"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted">No member signed in.</p>
            )}
          </SummaryCard>

          <SummaryCard title="Admin session" bodyClassName="p-5">
            {isAdminLoggedIn ? (
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-ink">{state.adminSession.username}</p>
                <p className="text-muted">{state.adminProfile.name}</p>
              </div>
            ) : (
              <p className="text-sm text-muted">No administrator signed in.</p>
            )}
          </SummaryCard>

          <SummaryCard title="Shared records" bodyClassName="p-5">
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted">Applications</dt>
              <dd className="text-right font-semibold">{state.applications.length}</dd>
              <dt className="text-muted">Inquiries</dt>
              <dd className="text-right font-semibold">{state.inquiries.length}</dd>
              <dt className="text-muted">Renewals</dt>
              <dd className="text-right font-semibold">{state.renewals.length}</dd>
              <dt className="text-muted">Pending renewals</dt>
              <dd className="text-right font-semibold">{adminMetrics.pendingRenewals}</dd>
            </dl>
          </SummaryCard>
        </div>

        <SummaryCard
          title="Demo controls"
          subtitle="Every control below dispatches through the shared store."
        >
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Member login
              </p>
              <div className="flex flex-wrap gap-2">
                {DEMO_MEMBER_VARIANTS.map((variant) => (
                  <Button
                    key={variant.appId}
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      run(
                        `Signed in as ${variant.label}.`,
                        loginMember(variant.appId, variant.password),
                      )
                    }
                  >
                    Login {variant.label}
                  </Button>
                ))}
                <Button size="sm" variant="ghost" onClick={logoutMember}>
                  Logout member
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Admin session
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => run("Admin signed in.", loginAdmin("admin", "demo"))}
                >
                  Login admin
                </Button>
                <Button size="sm" variant="ghost" onClick={logoutAdmin}>
                  Logout admin
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Shared application status
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  APPLICATION_STATUS.PROCESSING,
                  APPLICATION_STATUS.FOR_DELIVERY,
                  APPLICATION_STATUS.REJECTED,
                ].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={status === APPLICATION_STATUS.REJECTED ? "dangerGhost" : "outline"}
                    onClick={() =>
                      run(
                        `PS-12345 set to ${status}.`,
                        updateApplicationStatus(
                          "PS-12345",
                          status,
                          status === APPLICATION_STATUS.REJECTED
                            ? "Demo rejection: corrected documents are required."
                            : `Demo update to ${status}.`,
                        ),
                      )
                    }
                  >
                    Set PS-12345 → {status.replaceAll("_", " ")}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Renewal decision
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    run(
                      "RN-2026-0004 approved.",
                      decideRenewal(
                        "RN-2026-0004",
                        RENEWAL_STATUS.APPROVED,
                        "Approved in the demo store check.",
                      ),
                    )
                  }
                >
                  Approve RN-2026-0004
                </Button>
                <Button
                  size="sm"
                  variant="dangerGhost"
                  onClick={() =>
                    run(
                      "RN-2026-0004 rejected.",
                      decideRenewal(
                        "RN-2026-0004",
                        RENEWAL_STATUS.REJECTED,
                        "Demo rejection: the uploaded document is not readable.",
                      ),
                    )
                  }
                >
                  Reject RN-2026-0004
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Inquiries and reset
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    run(
                      "Demo inquiry created.",
                      addInquiry({
                        subject: "Store check inquiry",
                        category: "Other",
                        priority: "Low",
                        body: "This inquiry was created from the Step 4 store check.",
                      }),
                    )
                  }
                >
                  Add demo inquiry
                </Button>
                <Button
                  size="sm"
                  variant="dangerGhost"
                  onClick={() => {
                    resetDemo();
                    toast("Demo data reset to seed.");
                  }}
                >
                  Reset demo data
                </Button>
              </div>
            </div>
          </div>
        </SummaryCard>

        {state.lastRegistration && (
          <SummaryCard title="Last registration result">
            <p className="text-sm text-muted">
              Generated credentials:{" "}
              <strong className="text-ink">{state.lastRegistration.appId}</strong> /{" "}
              <strong className="text-ink">{state.lastRegistration.password}</strong>
            </p>
          </SummaryCard>
        )}

        <SummaryCard
          title="Applications"
          subtitle="One shared array powers member tracking and admin lists."
          bodyClassName="p-0"
        >
          <DataTable
            columns={[
              {
                key: "id",
                header: "Application ID",
                render: (row) => <strong>{row.id}</strong>,
              },
              { key: "applicantName", header: "Applicant" },
              {
                key: "status",
                header: "Status",
                render: (row) => <StatusBadge status={row.status} />,
              },
              {
                key: "submittedAt",
                header: "Submitted",
                render: (row) => formatDate(row.submittedAt),
                className: "text-muted",
              },
              {
                key: "updatedAt",
                header: "Updated",
                render: (row) => formatDateTime(row.updatedAt),
                className: "text-muted",
              },
            ]}
            rows={state.applications}
            getRowKey={(row) => row.id}
          />
        </SummaryCard>

        <SummaryCard
          title="Renewals"
          subtitle="Member status and admin decisions read the same record."
          bodyClassName="p-0"
        >
          <DataTable
            columns={[
              { key: "ref", header: "Reference", render: (row) => <strong>{row.ref}</strong> },
              { key: "applicantName", header: "Member" },
              {
                key: "status",
                header: "Status",
                render: (row) => <StatusBadge status={row.status} kind="renewal" />,
              },
              {
                key: "submittedAt",
                header: "Submitted",
                render: (row) => formatDate(row.submittedAt),
                className: "text-muted",
              },
              {
                key: "decisionAt",
                header: "Decision",
                render: (row) => (row.decisionAt ? formatDate(row.decisionAt) : "—"),
                className: "text-muted",
              },
            ]}
            rows={state.renewals}
            getRowKey={(row) => row.ref}
          />
        </SummaryCard>

        <SummaryCard
          title="Inquiries"
          subtitle="Statuses use the same canonical values as the inquiry screens."
          bodyClassName="p-0"
        >
          <DataTable
            columns={[
              {
                key: "id",
                header: "Ticket",
                render: (row) => <strong>{displayTicket(row.id)}</strong>,
              },
              { key: "subject", header: "Subject" },
              { key: "applicantName", header: "Member" },
              {
                key: "status",
                header: "Status",
                render: (row) => <StatusBadge status={row.status} kind="inquiry" />,
              },
              {
                key: "updatedAt",
                header: "Updated",
                render: (row) => formatDateTime(row.updatedAt),
                className: "text-muted",
              },
            ]}
            rows={state.inquiries}
            getRowKey={(row) => row.id}
          />
        </SummaryCard>

        {latestRenewal && (
          <p className="text-xs text-muted">
            Latest renewal for signed-in member: {latestRenewal.ref} ({latestRenewal.status}).
          </p>
        )}
      </main>
    </div>
  );
}
