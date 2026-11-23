import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AdminSidebar } from "./AdminSidebar";
import { Footer } from "./Footer";
import { useToast } from "../ui/Toast";

export function AdminLayout({ context = "Admin Dashboard", onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  function handleLogout() {
    onLogout?.();
    toast("Logged out of the admin demo session.");
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        context={context}
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
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children ?? <Outlet />}
        </main>
      </div>

      <Footer portal />
    </div>
  );
}
