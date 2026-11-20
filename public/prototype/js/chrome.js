/* Shared header/footer/prototype chrome. */
(function () {
  const PAGES = {
    login: { label: "Member Login", role: "auth", actions: [] },
    register: { label: "Create Account", role: "auth", actions: [{ label: "Back to Login", href: "login.html" }] },
    "register-personal": { label: "Registration · Personal Details", role: "auth", actions: [{ label: "Back to Login", href: "login.html" }] },
    "register-id": { label: "Registration · ID Details", role: "auth", actions: [{ label: "Back to Login", href: "login.html" }] },
    terms: { label: "Terms and Conditions", role: "auth", actions: [{ label: "Back to Login", href: "login.html" }] },
    success: { label: "Application Successful", role: "auth", actions: [{ label: "Back to Login", href: "login.html" }] },
    dashboard: { label: "Dashboard", role: "portal", actions: [{ label: "Logout", href: "login.html", logout: true }] },
    status: { label: "Application Status", role: "portal", actions: [{ label: "Dashboard", href: "dashboard.html" }] },
    inquiries: { label: "Inquiries", role: "portal", actions: [{ label: "Back to Dashboard", href: "dashboard.html" }, { label: "Profile", profile: true }, { label: "Logout", href: "login.html", logout: true }] },
    inquiry: { label: "Inquiry Details", role: "portal", actions: [{ label: "Back to Dashboard", href: "dashboard.html" }] },
    "renewal-1": { label: "Passport Renewal", role: "portal", actions: [{ label: "Back to Dashboard", href: "dashboard.html" }, { label: "Profile", profile: true }, { label: "Logout", href: "login.html", logout: true }] },
    "renewal-2": { label: "Passport Renewal", role: "portal", actions: [{ label: "Back to Dashboard", href: "dashboard.html" }, { label: "Profile", profile: true }, { label: "Logout", href: "login.html", logout: true }] },
    "renewal-3": { label: "Passport Renewal", role: "portal", actions: [{ label: "Back to Dashboard", href: "dashboard.html" }, { label: "Profile", profile: true }, { label: "Logout", href: "login.html", logout: true }] },
    "renewal-4": { label: "Passport Renewal", role: "portal", actions: [{ label: "Back to Dashboard", href: "dashboard.html" }, { label: "Profile", profile: true }, { label: "Logout", href: "login.html", logout: true }] },
    "renewal-submitted": { label: "Renewal Request Submitted", role: "portal", actions: [{ label: "Back to Dashboard", href: "dashboard.html" }, { label: "Profile", profile: true }, { label: "Logout", href: "login.html", logout: true }] },
    "renewal-status": { label: "Renewal Status", role: "portal", actions: [{ label: "Back to Dashboard", href: "dashboard.html" }, { label: "Profile", profile: true }, { label: "Logout", href: "login.html", logout: true }] }
  };

  const pageKey = document.body.dataset.page || "login";
  const config = PAGES[pageKey] || PAGES.login;

  if (config.role === "portal" && !PT.isLoggedIn()) {
    window.location.replace("login.html");
    return;
  }

  function actionMarkup(action) {
    if (action.profile) {
      return `<button type="button" class="btn-head" data-drawer-open="profile-drawer">${action.label}</button>`;
    }
    return `<a class="btn-head" href="${action.href}"${action.logout ? ' data-logout="1"' : ""}>${action.label}</a>`;
  }

  function renderHeader() {
    const host = document.querySelector("[data-chrome-header]");
    if (!host) return;
    host.outerHTML = `
      <header class="site-head">
        <div class="head-plane" aria-hidden="true"><img src="img/plane.jpeg" alt=""></div>
        <div class="site-head__inner">
          <a class="brand" href="${config.role === "portal" ? "dashboard.html" : "login.html"}">
            <img class="brand__mark" src="img/logo-mark.png" alt="PASSTRACK">
            <span>
              <strong class="brand__name">PASSTRACK</strong>
              <span class="brand__sub">Passport Application &amp; Tracking System</span>
            </span>
          </a>
          <div class="page-context">${config.label}</div>
          <div class="head-actions">${config.actions.map(actionMarkup).join("")}</div>
        </div>
      </header>`;
  }

  function renderFooter() {
    const host = document.querySelector("[data-chrome-footer]");
    if (!host) return;
    const isPortal = config.role === "portal";
    host.outerHTML = `
      <footer class="site-foot${isPortal ? "" : " site-foot--bare"}">
        <span>&copy; 2026 PASSTRACK Travel Agency. All rights reserved.</span>
        ${isPortal ? `<span class="site-foot__links">
          <a href="#" data-noop>Privacy</a><span class="site-foot__dot">·</span>
          <a href="#" data-noop>Accessibility</a><span class="site-foot__dot">·</span>
          <a href="#" data-noop>Help Center</a>
        </span>` : ""}
      </footer>`;
  }

  function renderProfileDrawer() {
    if (config.role !== "portal") return;
    const app = PT.application;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="scrim" data-drawer-close="profile-drawer"></div>
      <aside class="drawer" id="profile-drawer" aria-hidden="true" aria-label="Profile" role="dialog" aria-modal="true">
        <div class="drawer__head">
          <div class="drawer__title-row">
            <h2 class="drawer__title">Profile</h2>
            <button class="icon-btn" data-drawer-close="profile-drawer" aria-label="Close profile">${PTui.icon("x", 20)}</button>
          </div>
        </div>
        <div class="drawer__body">
          <div class="credential" style="background:#f7faff;border:1px solid var(--border)">
            <div class="credential__label">Member</div>
            <div class="credential__value" style="font-size:22px;color:var(--text)">${app.name}</div>
          </div>
          <div>
            <div class="rail-row"><span>Application ID</span><strong>${app.id}</strong></div>
            <div class="rail-row"><span>Primary email</span><strong>${app.email}</strong></div>
            <div class="rail-row"><span>Passport type</span><strong>${app.passportType}</strong></div>
            <div class="rail-row"><span>Processing type</span><strong>${app.processingType}</strong></div>
            <div class="rail-row"><span>Submission date</span><strong>${PTui.fmtDateLong(app.submittedAt)}</strong></div>
          </div>
          <p class="hint">Keep your application ID private. PASSTRACK officers will never ask for your password.</p>
        </div>
        <div class="drawer__foot">
          <a class="btn btn--ghost btn--block" href="login.html" data-logout="1">Logout</a>
        </div>
      </aside>`;
    document.body.appendChild(wrap);
    PTui.hydrateIcons(wrap);
    wrap.querySelectorAll("[data-drawer-close]").forEach((el) => {
      el.addEventListener("click", () => PTui.closeDrawer("profile-drawer"));
    });
  }

  function renderDemoBar() {
    if (config.role !== "portal") return;
    const bar = document.createElement("div");
    bar.className = "demo-bar";
    bar.innerHTML = `
      <div class="demo-bar__panel">
        <p>Prototype controls</p>
        <a href="renewal-status.html?state=pending">Renewal · pending</a>
        <a href="renewal-status.html?state=approved">Renewal · approved</a>
        <a href="renewal-status.html?state=rejected">Renewal · rejected</a>
        <a href="status.html?stage=6&delivered=1">Application · delivered</a>
        <button type="button" data-reset-demo>Reset all demo data</button>
      </div>
      <button type="button" class="demo-bar__toggle">Preview</button>`;
    document.body.appendChild(bar);
    bar.querySelector(".demo-bar__toggle").addEventListener("click", () => bar.classList.toggle("is-open"));
  }

  function bindGlobal() {
    document.querySelectorAll("[data-logout]").forEach((el) => {
      el.addEventListener("click", () => PT.logout());
    });
    document.querySelectorAll("[data-noop]").forEach((el) => {
      el.addEventListener("click", (e) => e.preventDefault());
    });
    document.querySelectorAll("[data-reset-demo]").forEach((el) => {
      el.addEventListener("click", () => {
        PT.reset();
        window.location.href = "login.html";
      });
    });
    document.querySelectorAll("[data-app-id]").forEach((el) => {
      el.textContent = PT.application.id;
    });
  }

  renderHeader();
  renderFooter();
  renderProfileDrawer();
  renderDemoBar();
  bindGlobal();
  PTui.hydrateIcons();
})();
