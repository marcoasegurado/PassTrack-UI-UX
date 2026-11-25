import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { Modal } from "../ui/Modal";
import { ButtonLink } from "../ui/Button";
import { CopyButton } from "../ui/CopyButton";
import { useToast } from "../ui/Toast";
import { useStore } from "../../data/StoreProvider";

export function MemberLayout({
  context = "Dashboard",
  appId,
  memberName,
  email,
  onLogout,
  actions: actionsProp,
  children,
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const { member, logoutMember } = useStore();
  const [profileOpen, setProfileOpen] = useState(false);

  const activeAppId = appId || member?.appId || "—";
  const activeName = memberName || member?.name || "Member";
  const activeEmail = email || member?.email || "—";

  function handleLogout() {
    if (onLogout) onLogout();
    else logoutMember();

    toast("Logged out of the demo session.");
    navigate("/login");
  }

  const actions = actionsProp || [
    { label: "Dashboard", to: "/dashboard", icon: "home" },
    {
      label: "Profile",
      icon: "user",
      onClick: () => setProfileOpen(true),
    },
    { label: "Logout", icon: "logout", onClick: handleLogout },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-control focus:font-semibold"
      >
        Skip to main content
      </a>
      <AppHeader context={context} homeTo="/dashboard" actions={actions} />

      <main id="main-content" className="shell flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {children ?? <Outlet />}
      </main>

      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Profile"
        description="Your active demo member session."
        footer={
          <>
            <ButtonLink to="/profile" variant="outline" onClick={() => setProfileOpen(false)}>
              View full profile
            </ButtonLink>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-control border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-surface-muted"
            >
              Logout
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-line bg-surface-muted p-4">
            <p className="text-xs font-bold uppercase tracking-[0.24px] text-muted">Member</p>
            <p className="mt-1 text-xl font-bold text-ink">{activeName}</p>
          </div>

          <dl className="divide-y divide-line-soft text-sm">
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted">Application ID</dt>
              <dd className="flex items-center gap-2 font-semibold text-ink">
                {activeAppId}
                <CopyButton value={activeAppId} compact label="Copy" />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted">Primary email</dt>
              <dd className="text-right font-semibold text-ink">{activeEmail}</dd>
            </div>
          </dl>

          <p className="rounded-control bg-tint p-3 text-xs leading-relaxed text-slate-body">
            Keep your application ID private. PASSTRACK officers will never ask for your
            password. This profile is part of the frontend demo only.
          </p>
        </div>
      </Modal>
    </div>
  );
}
