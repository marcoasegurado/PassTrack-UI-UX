import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AdminSidebar } from "./AdminSidebar";
import { Footer } from "./Footer";
import { ButtonLink } from "../ui/Button";
import { useToast } from "../ui/Toast";
import { useStore } from "../../data/StoreProvider";

export function AdminLayout({ title = "Admin Dashboard", description, actions, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { logoutAdmin } = useStore();

  function handleLogout() {
    logoutAdmin();
    toast("Logged out of the admin demo session.");
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-control focus:font-semibold"
      >
        Skip to main content
      </a>
      <AppHeader
        context="Admin Portal"
        homeTo="/admin/dashboard"
        onMenu={() => setSidebarOpen(true)}
        actions={[
          { label: "Account", to: "/admin/profile", icon: "user" },
          { label: "Logout", icon: "logout", onClick: handleLogout },
        ]}
      />

      <div className="flex flex-1">
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Admin Portal</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">{title}</h1>
                {description && <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">{description}</p>}
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </header>
            {children}
          </div>
        </main>
      </div>

      <Footer portal />
    </div>
  );
}
