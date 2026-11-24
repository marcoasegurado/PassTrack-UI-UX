import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "../../components/ui/Button";
import { TextField, TextareaField } from "../../components/ui/Field";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { usePageTitle } from "../../lib/usePageTitle";

export function AdminProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const { adminProfile, updateAdminProfile, logoutAdmin } = useStore();
  const [form, setForm] = useState({ ...adminProfile });
  const [saved, setSaved] = useState(false);
  usePageTitle("Admin Profile");
  function update(field, value) { setSaved(false); setForm((current) => ({ ...current, [field]: value })); }
  function submit(event) { event.preventDefault(); updateAdminProfile({ name: form.name.trim(), email: form.email.trim(), dob: form.dob, address: form.address.trim() }); setSaved(true); toast("Administrator profile saved."); }
  function logout() { logoutAdmin(); navigate("/admin/login"); }
  return <AdminLayout title="Profile" description="Update the local administrator profile used by the demo."><section className="max-w-3xl rounded-panel border border-line bg-surface p-5 shadow-card sm:p-7"><div className="rounded-card bg-tint p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Role</p><p className="mt-1 text-lg font-bold text-navy">{adminProfile.role}</p><p className="mt-1 text-sm text-slate-body">Username: {adminProfile.username}</p></div><form onSubmit={submit} className="mt-6 flex flex-col gap-5"><div className="grid gap-5 sm:grid-cols-2"><TextField id="admin-profile-name" label="Name" required value={form.name} onChange={(event) => update("name", event.target.value)} /><TextField id="admin-profile-email" label="Email" required type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} /></div><TextField id="admin-profile-dob" label="Date of birth" type="date" value={form.dob} onChange={(event) => update("dob", event.target.value)} /><TextareaField id="admin-profile-address" label="Office address" value={form.address} onChange={(event) => update("address", event.target.value)} />{saved && <p role="status" className="rounded-control bg-green-bg px-4 py-3 text-sm font-semibold text-green-ink">Profile saved locally.</p>}<div className="flex flex-wrap justify-between gap-3"><Button type="button" variant="outline" onClick={() => setForm({ ...adminProfile })}>Discard changes</Button><Button type="submit">Save profile</Button></div></form><div className="mt-8 border-t border-line-soft pt-5"><Button type="button" variant="dangerGhost" onClick={logout}>Log out of admin portal</Button></div></section></AdminLayout>;
}
