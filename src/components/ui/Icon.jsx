import { cn } from "../../lib/cn";

const ICONS = {
  check: '<path d="m5 12.5 4.2 4.2L19 6.9"/>',
  "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.6 2.6L16 9.6"/>',
  "chevron-down": '<path d="m6 9.5 6 6 6-6"/>',
  "chevron-right": '<path d="m9.5 6 6 6-6 6"/>',
  "chevron-up": '<path d="m6 14.5 6-6 6 6"/>',
  "arrow-right": '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
  "arrow-left": '<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5V4.5A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  upload: '<path d="M12 16V5"/><path d="m7.5 9.5 4.5-4.5 4.5 4.5"/><path d="M4.5 16.5v2A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-2"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M6.5 7l.8 11.2A1.8 1.8 0 0 0 9.1 20h5.8a1.8 1.8 0 0 0 1.8-1.8L17.5 7"/>',
  "alert-circle": '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v6"/><path d="M12 16.6h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.9h.01"/>',
  logout: '<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
  shield: '<path d="M12 21s7-3.5 7-9.5V5.5L12 3 5 5.5v6C5 17.5 12 21 12 21Z"/><path d="m9 12 2 2 4-4"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  download: '<path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M5 19h14"/>',
  printer: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="2"/><path d="M7 14h10v6H7z"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.4 3.6-5 7-5s6.2 1.6 7 5"/>',
  message: '<path d="M20 15.5a2.5 2.5 0 0 1-2.5 2.5H8l-4 3V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.2 2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  send: '<path d="m21 3-7.5 18-3.2-7.3L3 10.5 21 3Z"/><path d="m10.3 13.7 4.2-4.2"/>',
  "eye-off": '<path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A9.8 9.8 0 0 1 12 5c5 0 9 4.5 9 7a11.8 11.8 0 0 1-2.2 3.3"/><path d="M6.1 6.1C4.2 7.6 3 9.6 3 12c0 2.5 4 7 9 7a10.7 10.7 0 0 0 4.3-.9"/>',
  eye: '<path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7-4 7-9 7-9-4.5-9-7Z"/><circle cx="12" cy="12" r="2.6"/>',
  "file-text": '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
  home: '<path d="m4 10 8-6 8 6v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M9.5 21v-6h5v6"/>',
  lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
  "id-card": '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.5-1.7 1.6-2.5 3-2.5s2.5.8 3 2.5"/><path d="M14 10h4M14 13.5h4"/>',
  "help-circle": '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.6 2.3c-.7.4-1.2.9-1.2 1.7v.3"/><path d="M12 17h.01"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.8"/><path d="M20 4v7h-7"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/>',
};

export function Icon({ name, size = 20, className, ...props }) {
  const path = ICONS[name];
  if (!path) return null;

  return (
    <svg
      className={cn("inline-block shrink-0 align-middle", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
}
