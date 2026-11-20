/* Inline icon set + small UI helpers shared by every screen. */
(function () {
  const ICONS = {
    check: '<path d="m5 12.5 4.2 4.2L19 6.9"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.6 2.6L16 9.6"/>',
    "chevron-down": '<path d="m6 9.5 6 6 6-6"/>',
    "chevron-right": '<path d="m9.5 6 6 6-6 6"/>',
    "chevron-up": '<path d="m6 14.5 6-6 6 6"/>',
    "arrow-right": '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
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
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.2 2"/>'
  };

  function icon(name, size) {
    const path = ICONS[name];
    if (!path) return "";
    const s = size || 20;
    return `<svg class="icon" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach((el) => {
      el.innerHTML = icon(el.getAttribute("data-icon"), Number(el.getAttribute("data-size")) || 20);
    });
  }

  /* ------------------------------------------------------------ formatting */

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function fmtDate(value) {
    if (!value) return "—";
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
  }

  function fmtDateLong(value) {
    if (!value) return "—";
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  function fmtTime(value) {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${suffix}`;
  }

  function fmtDateTime(value) {
    return `${fmtDate(value)} · ${fmtTime(value)}`;
  }

  /* -------------------------------------------------------------- clipboard */

  function toast(message) {
    let el = document.querySelector(".pt-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "pt-toast";
      Object.assign(el.style, {
        position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)",
        background: "#0b1f4b", color: "#fff", fontSize: "13px", padding: "10px 16px",
        borderRadius: "8px", zIndex: 9999, opacity: "0", transition: "opacity .18s ease",
        boxShadow: "0 8px 24px rgba(11,31,75,.25)", pointerEvents: "none"
      });
      document.body.appendChild(el);
    }
    el.textContent = message;
    requestAnimationFrame(() => { el.style.opacity = "1"; });
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = "0"; }, 1800);
  }

  function copyText(text, doneMessage) {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(fallback);
    } else {
      fallback();
    }
    toast(doneMessage || "Copied to clipboard");
  }

  /* ----------------------------------------------------------------- drawer */

  function openDrawer(id) {
    const drawer = document.getElementById(id);
    if (!drawer) return;
    document.body.classList.add("drawer-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    const first = drawer.querySelector("input, select, textarea, button");
    if (first) setTimeout(() => first.focus(), 60);
    drawer._trap = (e) => {
      if (e.key === "Escape") closeDrawer(id);
      if (e.key !== "Tab") return;
      const items = drawer.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    document.addEventListener("keydown", drawer._trap);
  }

  function closeDrawer(id) {
    const drawer = document.getElementById(id);
    if (!drawer) return;
    document.body.classList.remove("drawer-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (drawer._trap) document.removeEventListener("keydown", drawer._trap);
    const opener = document.querySelector("[data-drawer-open]");
    if (opener) opener.focus();
  }

  /* ---------------------------------------------------------------- validation */

  function validate(form) {
    let valid = true;
    let firstInvalid = null;
    form.querySelectorAll("[required]").forEach((input) => {
      const wrap = input.closest(".field") || input.parentElement;
      const message = wrap.querySelector(".field-error");
      const value = input.type === "checkbox" ? input.checked : input.value.trim();
      let messageText = "";

      if (!value) {
        messageText = input.getAttribute("data-required-message") || "This field is required";
      } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) {
        messageText = "Please enter a valid email address";
      } else if (input.getAttribute("data-min") && input.value.trim().length < Number(input.getAttribute("data-min"))) {
        messageText = input.getAttribute("data-min-message") || "This value is too short";
      }

      if (messageText) {
        input.setAttribute("aria-invalid", "true");
        if (message) { message.textContent = messageText; message.hidden = false; }
        valid = false;
        firstInvalid = firstInvalid || input;
      } else {
        input.removeAttribute("aria-invalid");
        if (message) message.hidden = true;
      }
    });
    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  /* ---------------------------------------------------------------- hydration */

  document.addEventListener("DOMContentLoaded", () => {
    hydrateIcons();

    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => copyText(btn.getAttribute("data-copy"), btn.getAttribute("data-copy-message")));
    });

    document.querySelectorAll("[data-drawer-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => { e.preventDefault(); openDrawer(btn.getAttribute("data-drawer-open")); });
    });
    document.querySelectorAll("[data-drawer-close]").forEach((btn) => {
      btn.addEventListener("click", () => closeDrawer(btn.getAttribute("data-drawer-close")));
    });
    document.querySelectorAll(".scrim").forEach((s) => {
      s.addEventListener("click", () => { document.querySelectorAll(".drawer").forEach((d) => closeDrawer(d.id)); });
    });

    document.querySelectorAll("[data-filters]").forEach((group) => {
      group.querySelectorAll(".filter").forEach((chip) => {
        chip.addEventListener("click", () => {
          group.querySelectorAll(".filter").forEach((c) => c.classList.remove("is-active"));
          chip.classList.add("is-active");
          const value = chip.getAttribute("data-filter");
          document.querySelectorAll("[data-status]").forEach((row) => {
            const show = value === "all" || row.getAttribute("data-status") === value;
            row.style.display = show ? "" : "none";
          });
        });
      });
    });

    document.querySelectorAll("form[data-validate]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        let valid = true;
        form.querySelectorAll("[required]").forEach((input) => {
          const wrap = input.closest(".field") || input.parentElement;
          const message = wrap.querySelector(".field-error");
          if (!input.value.trim()) {
            input.setAttribute("aria-invalid", "true");
            if (message) { message.textContent = input.getAttribute("data-required-message") || "This field is required"; message.hidden = false; }
            valid = false;
          } else {
            input.removeAttribute("aria-invalid");
            if (message) message.hidden = true;
          }
        });
        if (!valid) { e.preventDefault(); const first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus(); }
      });
    });
  });

  window.PTui = { icon, hydrateIcons, fmtDate, fmtDateLong, fmtTime, fmtDateTime, toast, copyText, openDrawer, closeDrawer, validate };
})();
