import { useState } from "react";
import { AppHeader } from "../../components/layout/AppHeader";
import { Footer } from "../../components/layout/Footer";
import { Button, ButtonLink } from "../../components/ui/Button";
import { Checkbox, Radio, SelectField, TextField, TextareaField } from "../../components/ui/Field";
import { FileUploadField } from "../../components/ui/FileUploadField";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { CopyButton } from "../../components/ui/CopyButton";
import { Modal } from "../../components/ui/Modal";
import { Stepper } from "../../components/ui/Stepper";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { DataTable } from "../../components/ui/DataTable";
import { FilterBar, FilterChip } from "../../components/ui/FilterBar";
import { EmptyState } from "../../components/ui/EmptyState";
import { useToast } from "../../components/ui/Toast";
import { APPLICATION_STATUS, RENEWAL_STATUS } from "../../lib/constants";

const SAMPLE_ROWS = [
  { id: "PS-12345", name: "Demo User", type: "Regular (38 Pages)", status: "PROCESSING" },
  { id: "PS-12346", name: "Sample Applicant", type: "Express", status: "FOR_DELIVERY" },
  { id: "PS-12347", name: "Another Applicant", type: "Regular (38 Pages)", status: "REJECTED" },
];

export function StyleGuide() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState("Regular");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        context="Component preview"
        homeTo="/styleguide"
        actions={[
          { label: "Prototype", href: "/prototype/login.html" },
          { label: "Toast", onClick: () => toast("This is a demo toast.") },
        ]}
      />

      <main className="shell flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Step 3
          </p>
          <h1 className="mt-1 text-3xl font-bold text-navy">Shared UI kit</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Visual smoke test for the shared components used across the member and
            administrator portals.
          </p>
        </header>

        <SummaryCard title="Buttons" subtitle="Primary, outline, ghost, danger, sizes, and links.">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button size="sm">Small</Button>
            <Button size="pill">Pill action</Button>
            <Button disabled>Disabled</Button>
            <ButtonLink to="/styleguide" variant="outline">
              Router link
            </ButtonLink>
          </div>
        </SummaryCard>

        <SummaryCard title="Status badges" subtitle="Canonical statuses map to consistent tones.">
          <div className="flex flex-wrap gap-2">
            {Object.values(APPLICATION_STATUS).map((status) => (
              <StatusBadge key={status} status={status} />
            ))}
            <StatusBadge status={RENEWAL_STATUS.PENDING} kind="renewal" />
            <StatusBadge status={RENEWAL_STATUS.APPROVED} kind="renewal" />
            <StatusBadge status={RENEWAL_STATUS.REJECTED} kind="renewal" />
            <StatusBadge status="OPEN" kind="inquiry" />
            <StatusBadge status="AWAITING" kind="inquiry" />
            <StatusBadge status="RESOLVED" kind="inquiry" />
          </div>
        </SummaryCard>

        <SummaryCard title="Form controls" subtitle="Labels, hints, validation, selects, and choices.">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="First Name"
              required
              placeholder="Enter your first name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (event.target.value) setNameError("");
              }}
              error={nameError}
              hint="Use the name printed on your supporting ID."
            />
            <TextField label="Middle Name" placeholder="Optional" hint="Middle name is optional." />
            <TextField label="Email Address" type="email" required placeholder="you@example.com" />
            <SelectField
              label="Sex"
              required
              placeholder="Select sex"
              options={["Female", "Male", "Prefer not to say"]}
            />
            <SelectField
              label="Civil Status"
              required
              placeholder="Select status"
              options={["Single", "Married", "Widowed", "Separated"]}
            />
            <TextField label="Contact Number" type="tel" placeholder="+63 900 000 0000" />
          </div>

          <div className="mt-5">
            <TextareaField
              label="Detailed Message"
              required
              placeholder="Describe your concern"
              hint="Include dates and references where possible."
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-6">
            <Checkbox
              label="I accept the Terms and Conditions"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            <Radio
              label="Regular"
              name="processing"
              checked={processing === "Regular"}
              onChange={() => setProcessing("Regular")}
            />
            <Radio
              label="Express"
              name="processing"
              checked={processing === "Express"}
              onChange={() => setProcessing("Express")}
            />
          </div>

          <div className="mt-5 max-w-md">
            <FileUploadField
              label="Valid ID"
              required
              value={file}
              onChange={setFile}
              error={fileError}
              onError={setFileError}
              hint="JPG, PNG, or PDF up to 10 MB."
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => setNameError("This field is required")}>
              Trigger field error
            </Button>
            <Button variant="outline" onClick={() => setFileError("Use a JPG, PNG, or PDF file.")}>
              Trigger file error
            </Button>
          </div>
        </SummaryCard>

        <SummaryCard title="Stepper" subtitle="Shared by registration and renewal flows.">
          <div className="space-y-5">
            <Stepper steps={["Personal Details", "ID Details", "Create Account"]} current={2} />
            <Stepper
              steps={["Eligibility", "Personal Details", "Documents & Appointment", "Review"]}
              current={3}
            />
          </div>
        </SummaryCard>

        <SummaryCard
          title="Table, search, and filters"
          subtitle="Reusable admin list surface."
          action={<Button size="sm" onClick={() => toast("Demo action")}>Add record</Button>}
        >
          <FilterBar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search applications"
            actions={
              <CopyButton value="PS-12345" label="Copy demo ID" />
            }
          >
            {["all", "PROCESSING", "FOR_DELIVERY", "REJECTED"].map((value) => (
              <FilterChip
                key={value}
                active={filter === value}
                onClick={() => setFilter(value)}
              >
                {value === "all" ? "All" : value.replaceAll("_", " ")}
              </FilterChip>
            ))}
          </FilterBar>

          <DataTable
            columns={[
              { key: "id", header: "Application ID", render: (row) => <strong>{row.id}</strong> },
              { key: "name", header: "Applicant Name" },
              { key: "type", header: "Type", className: "text-muted" },
              {
                key: "status",
                header: "Status",
                render: (row) => <StatusBadge status={row.status} />,
              },
              {
                key: "action",
                header: "Action",
                render: () => <Button size="sm" variant="outline">View</Button>,
              },
            ]}
            rows={SAMPLE_ROWS.filter((row) => filter === "all" || row.status === filter)}
            getRowKey={(row) => row.id}
            emptyMessage="No applications match this filter."
          />
        </SummaryCard>

        <SummaryCard title="Modal and empty state" subtitle="Dialog, focus handling, and empty surfaces.">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-3">
              <Button onClick={() => setModalOpen(true)}>Open demo modal</Button>
              <p className="text-sm text-muted">
                Escape closes the dialog, focus is returned to the trigger, and the page
                scroll is locked while open.
              </p>
            </div>
            <div className="rounded-card border border-line bg-surface-muted">
              <EmptyState
                icon="message"
                title="No inquiries yet"
                description="When you create an inquiry, it will appear here with its current status."
                action={<Button size="sm">Start new inquiry</Button>}
              />
            </div>
          </div>
        </SummaryCard>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm demo action"
          description="This dialog is part of the shared component kit."
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setModalOpen(false);
                  toast("Demo action confirmed.");
                }}
              >
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-slate-body">
            This confirms the dialog, focus trap, and toast wiring all work together.
          </p>
        </Modal>
      </main>

      <Footer />
    </div>
  );
}
