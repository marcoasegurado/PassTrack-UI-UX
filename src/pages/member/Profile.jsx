import { MemberLayout } from "../../components/layout/MemberLayout";
import { StageProgress } from "../../components/application/StageProgress";
import { ButtonLink } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { useStore } from "../../data/StoreProvider";
import { formatDate } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-semibold text-ink">{value || "—"}</dd>
    </div>
  );
}

export function Profile() {
  const { member, application, logoutMember } = useStore();

  usePageTitle("Profile");

  return (
    <MemberLayout
      context="Profile"
      appId={member?.appId}
      memberName={member?.name}
      email={member?.email}
      onLogout={logoutMember}
    >
      {member ? (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Member Profile
              </p>
              <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">{member.name}</h1>
              <p className="mt-1 text-sm text-muted">
                A compact view of the details you submitted. This demo does not include account
                settings.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-card border border-line bg-white px-4 py-3 shadow-card">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  Application ID
                </p>
                <p className="mt-1 font-mono text-base font-bold text-ink">{member.appId}</p>
              </div>
              <CopyButton value={member.appId || ""} compact label="Copy" />
            </div>
          </header>

          <SummaryCard
            title="Application summary"
            action={
              application ? (
                <StatusBadge kind="application" status={application.status} dot />
              ) : null
            }
          >
            {application ? (
              <div className="flex flex-col gap-5">
                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Application type" value={application.applicationType} />
                  <Field label="Passport type" value={application.passportType} />
                  <Field label="Processing type" value={application.processingType} />
                  <Field label="Submitted" value={formatDate(application.submittedAt)} />
                  <Field
                    label="Estimated completion"
                    value={
                      application.estimatedCompletion
                        ? formatDate(application.estimatedCompletion)
                        : "To be scheduled"
                    }
                  />
                  <Field label="Next step" value={application.nextStep} />
                </dl>
                <StageProgress status={application.status} />
                <div>
                  <ButtonLink to="/application/status" variant="outline" size="sm">
                    View application status
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <EmptyState
                icon="file-text"
                title="No application on file"
                description="No application record is linked to this member yet."
              />
            )}
          </SummaryCard>

          <div className="grid gap-5 lg:grid-cols-2">
            <SummaryCard title="Personal details">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" value={member.firstName} />
                <Field label="Middle name" value={member.middleName} />
                <Field label="Last name" value={member.lastName} />
                <Field label="Birthday" value={formatDate(member.birthday)} />
                <Field label="Sex" value={member.sex} />
                <Field label="Civil status" value={member.civilStatus} />
                <Field label="Contact number" value={member.contact} />
                <Field label="Email" value={member.email} />
                <Field label="Place of birth" value={member.birthplace} />
                <Field label="Citizenship" value={member.citizenship} />
              </dl>
            </SummaryCard>

            <SummaryCard title="Identification and address">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field label="Nationality" value={member.nationality} />
                <Field label="ID type" value={member.idType} />
                <Field label="Mother's maiden name" value={member.motherMaidenName} />
                <Field label="Father's full name" value={member.fatherFullName} />
                <div className="sm:col-span-2">
                  <Field label="Address" value={member.address} />
                </div>
                <Field label="City" value={member.city} />
                <Field label="Province" value={member.province} />
                <Field label="Postal code" value={member.postalCode} />
                <Field
                  label="Uploaded ID"
                  value={member.validId?.name || "No file on record"}
                />
              </dl>
            </SummaryCard>
          </div>

          {member.passport?.number && (
            <SummaryCard title="Current passport on record">
              <dl className="grid gap-4 sm:grid-cols-3">
                <Field label="Passport number" value={member.passport.number} />
                <Field label="Issued" value={formatDate(member.passport.issuedAt)} />
                <Field label="Expires" value={formatDate(member.passport.expiry)} />
              </dl>
            </SummaryCard>
          )}

          <p className="text-center text-xs text-muted">
            Need to change a submitted detail? Open an inquiry from the{" "}
            <ButtonLink to="/inquiries" variant="ghost" size="sm" className="mx-1">
              inquiry desk
            </ButtonLink>
            so an officer can review it.
          </p>
        </div>
      ) : (
        <EmptyState
          icon="user"
          title="No member session"
          description="Sign in to view your profile."
          action={<ButtonLink to="/login">Go to login</ButtonLink>}
        />
      )}
    </MemberLayout>
  );
}
