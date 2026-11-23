import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Button, ButtonLink } from "../../components/ui/Button";
import { Checkbox, SelectField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { Stepper } from "../../components/ui/Stepper";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { PROCESSING_TYPES } from "../../lib/constants";
import { cn } from "../../lib/cn";
import { usePageTitle } from "../../lib/usePageTitle";

const STEPS = ["Personal Details", "ID Details", "Create Account"];

export function RegisterApplication() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    state,
    registerMember,
    saveRegistrationDraft,
  } = useStore();

  const personal = state.registrationDraft.personal || {};
  const idDetails = state.registrationDraft.idDetails || {};
  const draft = state.registrationDraft.application || {};

  const [appType, setAppType] = useState(draft.appType || "");
  const [processingType, setProcessingType] = useState(
    draft.processingType || "Regular",
  );
  const [agreed, setAgreed] = useState(Boolean(state.registrationDraft.agreed));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  usePageTitle("Create Account");

  if (!submitted && !personal.firstName) {
    return <Navigate to="/register/personal-details" replace />;
  }

  if (!submitted && !idDetails.idType) {
    return <Navigate to="/register/id-details" replace />;
  }

  const selectedProcessing =
    PROCESSING_TYPES.find((type) => type.value === processingType) ||
    PROCESSING_TYPES[0];

  function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitError("");

    const nextErrors = {};
    if (!appType) nextErrors.appType = "Select an application type.";
    if (!agreed) nextErrors.agreed = "Accept the Terms and Conditions before submitting.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      document.getElementById(nextErrors.appType ? "application-appType" : "application-terms")?.focus();
      return;
    }

    setSubmitting(true);
    const result = registerMember({
      personal,
      idDetails,
      application: {
        appType,
        processingType,
        termsAccepted: agreed,
      },
    });

    if (!result.ok) {
      setSubmitting(false);
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
    toast("Application submitted. Save your new sign-in details.");
    navigate("/register/success", { replace: true });
  }

  return (
    <AuthShell
      context="Create Account"
      actions={[{ label: "Back to Login", to: "/login" }]}
    >
      <div className="w-full max-w-[720px] overflow-hidden rounded-panel border border-line bg-white shadow-card">
        <header className="border-b border-line-soft px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-bold leading-tight text-navy sm:text-3xl">
            Create Your Account
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted sm:text-[15px]">
            Choose your application type. Your password is generated for you after you
            submit.
          </p>
        </header>

        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <Stepper steps={STEPS} current={3} className="mb-6" />

          <div className="mb-6 rounded-control border border-line bg-surface-muted p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  Applying as
                </p>
                <p className="mt-1 text-base font-bold text-ink">
                  {[personal.firstName, personal.middleName, personal.lastName]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {personal.email} · {personal.contact}
                </p>
              </div>
              <Link
                to="/register/personal-details"
                className="text-xs font-semibold text-brand hover:underline"
              >
                Edit details
              </Link>
            </div>
            <p className="mt-3 border-t border-line-soft pt-2 text-xs text-muted">
              ID on file: {idDetails.idType} · {idDetails.city}, {idDetails.province}
            </p>
          </div>

          {submitError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-control border border-[#f9c2c2] bg-[#fff6f6] px-4 py-3 text-sm font-medium text-[#b42318]"
            >
              <Icon name="alert-circle" size={18} className="mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <SelectField
              id="application-appType"
              label="Application Type"
              required
              placeholder="Select application type"
              options={["New Passport", "Renewal"]}
              value={appType}
              error={errors.appType}
              onChange={(event) => {
                setAppType(event.target.value);
                setErrors((current) => {
                  if (!current.appType) return current;
                  const next = { ...current };
                  delete next.appType;
                  return next;
                });
              }}
            />

            <fieldset>
              <legend className="flex items-center gap-1 text-sm font-semibold text-ink">
                Processing Type
                <span className="text-danger" aria-hidden="true">
                  *
                </span>
              </legend>

              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {PROCESSING_TYPES.map((type) => {
                  const checked = processingType === type.value;
                  return (
                    <label
                      key={type.value}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-card border p-4 transition",
                        checked
                          ? "border-brand bg-tint ring-2 ring-brand/10"
                          : "border-line bg-white hover:border-brand/60",
                      )}
                    >
                      <input
                        type="radio"
                        name="processingType"
                        value={type.value}
                        checked={checked}
                        onChange={() => setProcessingType(type.value)}
                        className="mt-1 h-[18px] w-[18px] shrink-0 accent-brand"
                      />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-bold text-ink">{type.label}</span>
                          <span className="text-sm font-bold text-brand">{type.fee}</span>
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {type.days}
                        </span>
                        <span className="mt-1.5 block text-xs leading-relaxed text-slate-body">
                          {type.note}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Checkbox
              id="application-terms"
              checked={agreed}
              error={errors.agreed}
              onChange={(event) => {
                setAgreed(event.target.checked);
                setErrors((current) => {
                  if (!current.agreed) return current;
                  const next = { ...current };
                  delete next.agreed;
                  return next;
                });
              }}
              label={
                <>
                  I agree to the{" "}
                  <Link
                    to="/terms?return=register"
                    onClick={() =>
                      saveRegistrationDraft({
                        application: { appType, processingType },
                        agreed,
                      })
                    }
                    className="font-semibold text-brand hover:underline"
                  >
                    Terms and Conditions
                  </Link>
                </>
              }
            />

            <div className="rounded-control bg-surface-muted px-4 py-3 text-xs leading-relaxed text-muted">
              Selected processing:{" "}
              <strong className="text-ink">{selectedProcessing.label}</strong> ·{" "}
              {selectedProcessing.days} · {selectedProcessing.fee}. Payment is not collected
              in this demo.
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ButtonLink to="/register/id-details" variant="outline">
                Back
              </ButtonLink>
              <Button type="submit" disabled={!agreed || submitting}>
                {submitting ? "Submitting…" : "Submit Application"}
              </Button>
            </div>

            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-brand">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
