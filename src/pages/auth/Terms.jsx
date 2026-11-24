import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { useStore } from "../../data/StoreProvider";
import { usePageTitle } from "../../lib/usePageTitle";

const SECTIONS = [
  {
    id: "s1",
    title: "Acceptance of Terms",
    body: (
      <p>
        By accessing and registering an account with the Passport Tracking System, you
        agree to be bound by these Terms and Conditions. If you do not agree, you must not
        use this system.
      </p>
    ),
  },
  {
    id: "s2",
    title: "Eligibility to Register",
    body: (
      <p>
        You must be a citizen or legal resident eligible for a passport under national
        law. Any fraudulent registration will lead to immediate cancellation of your
        application.
      </p>
    ),
  },
  {
    id: "s3",
    title: "Account and Password Responsibility",
    body: (
      <>
        <p>
          You are responsible for maintaining the confidentiality of your Application ID
          and password. You agree to:
        </p>
        <ul>
          <li>Notify support immediately of any unauthorized use.</li>
          <li>Ensure you log out at the end of each session.</li>
          <li>Avoid sharing your login credentials with third parties.</li>
        </ul>
      </>
    ),
  },
  {
    id: "s4",
    title: "Accuracy of Application Information",
    body: (
      <p>
        You must provide accurate, current, and complete information during registration
        and application submission. Providing false information is a punishable offense.
      </p>
    ),
  },
  {
    id: "s5",
    title: "Application Status Updates",
    body: (
      <div className="flex items-start gap-2.5 rounded-control border border-[#cfe0fa] bg-tint px-4 py-3 text-xs leading-relaxed text-slate-body">
        <Icon name="info" size={16} className="mt-0.5 shrink-0 text-brand" />
        <span>
          The system provides estimated tracking and status updates. These are indicative
          and subject to processing times of the passport authority.
        </span>
      </div>
    ),
  },
  {
    id: "s6",
    title: "Use and Protection of Your Data",
    body: (
      <p>
        Your personal data, including biometrics, address, and contact details, will be
        processed securely in accordance with our Privacy Policy and relevant data
        protection laws.
      </p>
    ),
  },
  {
    id: "s7",
    title: "Acceptable Use",
    body: (
      <>
        <p>You may not:</p>
        <ul>
          <li>Use the system for any illegal or unauthorized purpose.</li>
          <li>Attempt to bypass system security or access other users&rsquo; accounts.</li>
          <li>Submit automated or bulk queries to the tracking database.</li>
        </ul>
      </>
    ),
  },
  {
    id: "s8",
    title: "Service Availability",
    body: (
      <p>
        We strive to keep the tracking system online 24/7, but we do not guarantee
        uninterrupted access due to scheduled maintenance or unforeseen technical issues.
      </p>
    ),
  },
  {
    id: "s9",
    title: "Limitation of Liability",
    body: (
      <p>
        The Passport Tracking System is provided on an &ldquo;as-is&rdquo; basis. We are
        not liable for any direct or indirect damages arising from the use or inability to
        use the system.
      </p>
    ),
  },
  {
    id: "s10",
    title: "Changes to These Terms",
    body: (
      <p>
        We reserve the right to modify these terms at any time. Changes will be effective
        immediately upon posting. Your continued use of the system constitutes acceptance
        of modified terms.
      </p>
    ),
  },
  {
    id: "s11",
    title: "Contact Us",
    body: (
      <p>
        For any questions or issues regarding these terms or your passport application,
        please contact our support team at{" "}
        <a href="mailto:support@passtrack.com" className="inline-flex min-h-6 items-center font-semibold">
          support@passtrack.com
        </a>
        .
      </p>
    ),
  },
];

export function Terms() {
  const navigate = useNavigate();
  const { state, saveRegistrationDraft } = useStore();
  const [accepted, setAccepted] = useState(Boolean(state.registrationDraft.agreed));

  usePageTitle("Terms and Conditions");

  function accept() {
    saveRegistrationDraft({ agreed: true });
    navigate("/register/application");
  }

  function decline() {
    saveRegistrationDraft({ agreed: false });
    navigate("/register/application");
  }

  return (
    <AuthShell
      context="Terms and Conditions"
      actions={[{ label: "Back to Login", to: "/login" }]}
    >
      <div className="w-full max-w-[960px]">
        <article className="overflow-hidden rounded-panel border border-line bg-white shadow-card">
          <header className="border-b border-line-soft px-6 py-6 sm:px-10 sm:py-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              Legal
            </p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-navy sm:text-[32px]">
              Terms and Conditions
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Please read these terms carefully before using the Passport Tracking System.
            </p>
          </header>

          <div className="px-6 py-6 sm:px-10 sm:py-8">
            <nav
              aria-label="Sections on this page"
              className="rounded-card border border-line bg-surface-muted px-5 py-4"
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                On this page
              </h2>
              <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {SECTIONS.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="inline-flex min-h-6 items-center text-xs font-medium leading-snug text-brand hover:underline"
                  >
                    {index + 1}. {section.title}
                  </a>
                ))}
              </div>
            </nav>

            <div className="mt-2">
              {SECTIONS.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-32 border-t border-line-soft py-5 first:border-t-0"
                >
                  <h3 className="flex items-center gap-3 text-[15px] font-bold text-ink">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      {index + 1}
                    </span>
                    {section.title}
                  </h3>
                  <div className="mt-2 pl-9 text-xs leading-relaxed text-slate-body sm:text-sm [&_li]:ml-4 [&_li]:list-disc [&_p+p]:mt-2 [&_ul]:mt-2 [&_ul]:space-y-1">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-4 rounded-control border border-line bg-surface-muted p-4">
              <Checkbox
                id="terms-accept"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                label="I have read and agree to the Terms and Conditions"
              />
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-line-soft pt-5">
              <Button variant="ghost" onClick={decline}>
                Decline
              </Button>
              <Button onClick={accept} disabled={!accepted}>
                Accept &amp; Continue
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              Accepting returns you to the Create Account step. Declining keeps the terms
              unaccepted, so the application cannot be submitted.
            </p>
          </div>
        </article>
      </div>
    </AuthShell>
  );
}
