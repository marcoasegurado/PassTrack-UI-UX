import { useState } from "react";
import { AuthShell } from "../../components/layout/AuthShell";
import { Button, ButtonLink } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { Icon } from "../../components/ui/Icon";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { getApplication } from "../../data/selectors";
import { downloadTextFile } from "../../lib/download";
import { formatDate } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

export function RegisterSuccess() {
  const toast = useToast();
  const { state } = useStore();
  const result = state.lastRegistration;
  const [emailOpen, setEmailOpen] = useState(false);

  usePageTitle("Application Received");

  if (!result) {
    return (
      <AuthShell
        context="Application Successful"
        actions={[{ label: "Back to Login", to: "/login" }]}
      >
        <div className="w-full max-w-[720px] overflow-hidden rounded-panel border border-line bg-white shadow-card">
          <div className="px-6 py-8 text-center sm:px-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tint text-brand">
              <Icon name="file-text" size={26} />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-navy">
              No recent application in this browser
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Credentials appear here right after you submit a registration. If you already
              created an account, use the Application ID and password from your saved
              confirmation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink to="/register/personal-details">
                Start a new application
              </ButtonLink>
              <ButtonLink to="/login" variant="outline">
                Go to Login
              </ButtonLink>
            </div>
          </div>
        </div>
      </AuthShell>
    );
  }

  const application = getApplication(state, result.appId);
  const loginPath = `/login?id=${encodeURIComponent(result.appId)}`;
  const loginUrl = `${window.location.origin}${loginPath}`;

  function downloadDetails() {
    const text = [
      "PASSTRACK — Passport Application & Tracking System",
      "",
      `Application ID: ${result.appId}`,
      `Temporary password: ${result.password}`,
      "",
      `Log in at: ${loginUrl}`,
      "",
      "Keep this file private. PASSTRACK officers will never ask for your password.",
      "This is a frontend demo. Credentials are stored only in this browser.",
    ].join("\n");

    downloadTextFile("passtrack-login-details.txt", text);
    toast("Login details downloaded.");
  }

  function openEmailDemo() {
    setEmailOpen(true);
  }

  return (
    <AuthShell
      context="Application Successful"
      actions={[{ label: "Back to Login", to: "/login" }]}
    >
      <div className="w-full max-w-[720px] overflow-hidden rounded-panel border border-line bg-white shadow-card">
        <header className="flex gap-4 border-b border-line-soft px-6 py-6 sm:px-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-ink text-white">
            <Icon name="check" size={24} />
          </span>
          <div>
            <h1 className="text-2xl font-bold leading-tight text-navy sm:text-[29px]">
              Application Received
            </h1>
            <p className="mt-1 text-sm text-muted">
              We&rsquo;ve received your application.
            </p>
          </div>
        </header>

        <div className="px-6 pb-6 pt-5 sm:px-8">
          <div className="relative rounded-control bg-[#edf3fd] px-5 py-4 pr-24">
            <p className="text-xs font-bold text-ink">Your Application ID</p>
            <p className="mt-1 break-all font-mono text-2xl font-bold leading-tight text-brand sm:text-3xl">
              {result.appId}
            </p>
            <CopyButton
              value={result.appId}
              label="Copy"
              compact
              className="absolute right-3 top-3"
            />
          </div>

          <div className="relative mt-4 rounded-control bg-[#edf3fd] px-5 py-4 pr-24">
            <p className="text-xs font-bold text-ink">Your Temporary Password</p>
            <p className="mt-1 break-all font-mono text-2xl font-bold leading-tight text-brand sm:text-3xl">
              {result.password}
            </p>
            <CopyButton
              value={result.password}
              label="Copy"
              compact
              className="absolute right-3 top-3"
            />
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-control bg-[#edf3fd] px-4 py-3 text-[13px] leading-relaxed text-slate-body">
            <Icon name="shield" size={17} className="mt-0.5 shrink-0 text-brand" />
            <span>
              <strong className="text-ink">Save both values.</strong> You&rsquo;ll need
              them to log in and track your application. They are also saved in this
              browser so you can recover them from the login screen.
            </span>
          </div>

          {application && (
            <dl className="mt-5 grid gap-x-6 gap-y-2 border-t border-line-soft pt-4 text-sm sm:grid-cols-2">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">Applicant</dt>
                <dd className="text-right font-semibold text-ink">
                  {application.applicantName}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">Application type</dt>
                <dd className="text-right font-semibold text-ink">
                  {application.applicationType}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">Processing</dt>
                <dd className="text-right font-semibold text-ink">
                  {application.processingType}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">Submitted</dt>
                <dd className="text-right font-semibold text-ink">
                  {formatDate(application.submittedAt)}
                </dd>
              </div>
            </dl>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink to={loginPath} size="lg" block>
              Go to Login
            </ButtonLink>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline" onClick={downloadDetails}>
                <Icon name="download" size={16} />
                Download login details
              </Button>
              <Button variant="ghost" onClick={openEmailDemo}>
                <Icon name="mail" size={16} />
                Email login details
              </Button>
            </div>

            <p className="text-center text-xs text-muted">
              Email is a clearly labeled demo action. No message is actually sent.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        title="Email login details (demo)"
        description="Email delivery is not connected in this frontend-only build."
        footer={
          <Button onClick={() => setEmailOpen(false)}>Close</Button>
        }
      >
        <div className="space-y-4 text-sm leading-relaxed text-slate-body">
          <p>
            No email will be sent. In a real system these details would be delivered to the
            address on your application. For this demo, copy or download them instead.
          </p>

          <div className="rounded-control border border-line bg-surface-muted p-4">
            <dl className="space-y-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-muted">Application ID</dt>
                <dd className="flex items-center gap-2 font-mono font-semibold text-ink">
                  {result.appId}
                  <CopyButton value={result.appId} compact label="Copy" />
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-muted">Temporary password</dt>
                <dd className="flex items-center gap-2 font-mono font-semibold text-ink">
                  {result.password}
                  <CopyButton value={result.password} compact label="Copy" />
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={downloadDetails}>
              <Icon name="download" size={16} />
              Download instead
            </Button>
          </div>
        </div>
      </Modal>
    </AuthShell>
  );
}
