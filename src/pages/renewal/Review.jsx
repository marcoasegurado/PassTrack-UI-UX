import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { RequirementRail } from "../../components/renewal/RequirementRail";
import { RenewalCard, RenewalShell, RENEWAL_STEPS } from "../../components/renewal/RenewalShell";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { Stepper } from "../../components/ui/Stepper";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { formatDate } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-[13px] leading-snug">
      <dt className="text-muted">{label}</dt>
      <dd className="max-w-[62%] text-right font-semibold text-ink">{value || "—"}</dd>
    </div>
  );
}

function SummarySection({ title, children }) {
  return (
    <section className="rounded-card border border-line bg-surface-muted p-4">
      <h3 className="text-sm font-bold text-navy">{title}</h3>
      <dl className="mt-2.5 flex flex-col gap-1.5">{children}</dl>
    </section>
  );
}

export function RenewalReview() {
  const navigate = useNavigate();
  const toast = useToast();
  const { state, submitRenewal } = useStore();
  const draft = state.renewalDraft || {};
  const personal = draft.personal || {};
  const documents = draft.documents || {};
  const appointment = draft.appointment || {};

  const [confirmed, setConfirmed] = useState(Boolean(draft.confirmed));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  usePageTitle("Passport Renewal · Review");

  if (!submitted && !draft.passportNumber) {
    return <Navigate to="/renewal/eligibility" replace />;
  }

  if (!submitted && !personal.firstName) {
    return <Navigate to="/renewal/personal-details" replace />;
  }

  if (
    !submitted &&
    (!documents.passportCopy || !documents.governmentId || !appointment.date)
  ) {
    return <Navigate to="/renewal/documents-appointment" replace />;
  }

  const fullName =
    [personal.firstName, personal.middleName, personal.lastName].filter(Boolean).join(" ") ||
    "—";
  const supportingCount = documents.supporting?.length || 0;

  function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setError("");

    if (!confirmed) {
      setError("Confirm that your information and documents are true before submitting.");
      document.getElementById("renewal-confirm")?.focus();
      return;
    }

    setSubmitting(true);
    const result = submitRenewal({ ...draft, confirmed: true });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.error);
      return;
    }

    setSubmitted(true);
    toast(`Renewal request ${result.renewal.ref} submitted.`);
    navigate("/renewal/submitted", {
      replace: true,
      state: { ref: result.renewal.ref },
    });
  }

  return (
    <RenewalShell
      title="Passport Renewal"
      description="Review your information before submitting your renewal request."
      rail={<RequirementRail processing={draft.processing} />}
    >
      <RenewalCard
        title="Review & Submit"
        subtitle="Check that your details are correct before sending your passport renewal request."
      >
        <Stepper steps={RENEWAL_STEPS} current={4} className="mb-6" />

        <div className="grid gap-4 md:grid-cols-2">
          <SummarySection title="Personal Details">
            <SummaryRow label="Full name" value={fullName} />
            <SummaryRow label="Date of birth" value={formatDate(personal.dob)} />
            <SummaryRow label="Contact number" value={personal.contact} />
            <SummaryRow label="Email address" value={personal.email} />
            <SummaryRow
              label="Home address"
              value={[personal.city, personal.province].filter(Boolean).join(", ")}
            />
          </SummarySection>

          <SummarySection title="Documents & Appointment">
            <SummaryRow
              label="Passport copy"
              value={documents.passportCopy ? documents.passportCopy.name : "Not uploaded"}
            />
            <SummaryRow
              label="Government ID"
              value={documents.governmentId ? documents.governmentId.name : "Not uploaded"}
            />
            <SummaryRow
              label="Supporting documents"
              value={
                supportingCount
                  ? `${supportingCount} file${supportingCount === 1 ? "" : "s"}`
                  : "None added"
              }
            />
            <SummaryRow label="Preferred branch" value={appointment.branch} />
            <SummaryRow
              label="Appointment"
              value={`${formatDate(appointment.date)} · ${appointment.time}`}
            />
          </SummarySection>

          <SummarySection title="Current Passport">
            <SummaryRow label="Passport number" value={draft.passportNumber} />
            <SummaryRow label="Expiry date" value={formatDate(draft.expiry)} />
            <SummaryRow label="Reason for renewal" value={draft.reason} />
            <SummaryRow label="Processing type" value={draft.processing} />
          </SummarySection>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-control border border-[#f9c2c2] bg-[#fff6f6] px-4 py-3 text-sm font-medium text-[#b42318]"
            >
              <Icon name="alert-circle" size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="rounded-control border border-[#dce6f3] bg-tint p-4">
            <Checkbox
              id="renewal-confirm"
              checked={confirmed}
              onChange={(event) => {
                setConfirmed(event.target.checked);
                setError("");
              }}
              label={
                <>
                  <strong className="mb-0.5 block text-sm font-bold text-navy">
                    Confirmation
                  </strong>
                  I confirm that the information and documents provided are true and correct to
                  the best of my knowledge.
                </>
              }
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/renewal/documents-appointment")}
            >
              Back to Documents
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Renewal Request"}
            </Button>
          </div>
        </form>
      </RenewalCard>
    </RenewalShell>
  );
}
