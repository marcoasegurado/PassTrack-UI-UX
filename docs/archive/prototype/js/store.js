/* localStorage-backed fake backend for the prototype. */
(function () {
  const KEY = "passtrack.prototype.v1";
  const DEMO_ID = "PS-12345";
  const DEMO_PASSWORD = "Pw-8Kq27xM";

  const seed = () => ({
    session: null,
    credentials: { appId: DEMO_ID, password: DEMO_PASSWORD },
    registration: { appType: "", processingType: "Regular", personal: {}, id: {} },
    application: {
      id: DEMO_ID,
      name: "Demo User",
      email: "username@gmail.com",
      passportType: "Regular (38 Pages)",
      processingType: "Express",
      stage: 3,
      status: "Processing",
      submittedAt: "2026-09-08T11:38:00",
      updatedAt: "2026-09-09T08:00:00",
      steps: [
        { key: "submitted", label: "Submitted", at: "2026-09-08T11:38:00", state: "done", meta: "" },
        { key: "review", label: "Under Review", at: "2026-09-08T12:00:00", state: "done", meta: "" },
        { key: "processing", label: "Processing", at: null, state: "current", meta: "In progress" },
        { key: "ready", label: "Ready for Release", at: null, state: "upcoming", meta: "Pending previous phase completion" },
        { key: "approved", label: "Approved", at: null, state: "upcoming", meta: "Awaiting delivery dispatch" },
        { key: "delivery", label: "For Delivery", at: null, state: "upcoming", meta: "Awaiting delivery dispatch" }
      ]
    },
    inquiries: [
      {
        id: "#INQ-901",
        subject: "Passport delivery timeline",
        category: "Application Status",
        status: "awaiting",
        createdAt: "2026-09-28T09:42:00",
        updatedAt: "2026-09-29T10:18:00",
        officer: "Maya Cruz",
        messages: [
          { from: "me", name: "You", role: "Member", body: "Hello, my application has been processing since my biometric appointment. Could you confirm the expected delivery timeline for application PS-12345? I have travel planned in November.", at: "2026-09-28T09:42:00" },
          { from: "officer", name: "Officer Maya Cruz", role: "Passport Services", body: "Thank you for contacting PASSTRACK. Your biometric details were received successfully and your application is now in the document verification stage. I am checking the latest production estimate for you.", at: "2026-09-28T14:16:00" },
          { from: "me", name: "You", role: "Member", body: "Thank you. Please let me know if you need any additional documents from me to avoid delays.", at: "2026-09-29T08:05:00" },
          { from: "officer", name: "Officer Maya Cruz", role: "Passport Services", body: "No additional documents are required at this time. Current estimates place dispatch within 7–10 business days. We will post the tracking number here once the passport is released to the courier.", at: "2026-09-29T10:18:00" }
        ]
      },
      { id: "#INQ-896", subject: "Additional proof of residence", category: "Document Clarification", status: "open", createdAt: "2026-09-25T11:05:00", updatedAt: "2026-09-25T11:05:00", officer: "Maya Cruz", messages: [] },
      { id: "#INQ-882", subject: "Biometric review completed", category: "Application Status", status: "resolved", createdAt: "2026-09-17T15:20:00", updatedAt: "2026-09-18T09:00:00", officer: "Maya Cruz", messages: [] },
      { id: "#INQ-867", subject: "Renewal document requirements", category: "Renewal", status: "resolved", createdAt: "2026-09-12T10:10:00", updatedAt: "2026-09-12T16:40:00", officer: "Maya Cruz", messages: [] },
      { id: "#INQ-854", subject: "Appointment rescheduling", category: "Application Status", status: "resolved", createdAt: "2026-09-08T14:30:00", updatedAt: "2026-09-09T09:15:00", officer: "Maya Cruz", messages: [] },
      { id: "#INQ-841", subject: "Spelling correction on record", category: "Document Clarification", status: "resolved", createdAt: "2026-09-02T08:45:00", updatedAt: "2026-09-03T10:20:00", officer: "Maya Cruz", messages: [] },
      { id: "#INQ-830", subject: "Payment confirmation", category: "Application Status", status: "open", createdAt: "2026-08-27T13:10:00", updatedAt: "2026-08-27T13:10:00", officer: "Maya Cruz", messages: [] },
      { id: "#INQ-812", subject: "Courier address update", category: "Application Status", status: "resolved", createdAt: "2026-08-19T16:15:00", updatedAt: "2026-08-20T09:05:00", officer: "Maya Cruz", messages: [] },
      { id: "#INQ-798", subject: "Renewal eligibility question", category: "Renewal", status: "resolved", createdAt: "2026-08-11T09:00:00", updatedAt: "2026-08-11T15:30:00", officer: "Maya Cruz", messages: [] },
      { id: "#INQ-781", subject: "Upload failed twice", category: "Document Clarification", status: "resolved", createdAt: "2026-08-02T17:40:00", updatedAt: "2026-08-03T08:50:00", officer: "Maya Cruz", messages: [] },
      { id: "#INQ-764", subject: "Travel date moved earlier", category: "Application Status", status: "resolved", createdAt: "2026-07-24T10:25:00", updatedAt: "2026-07-25T11:00:00", officer: "Maya Cruz", messages: [] }
    ],
    renewal: {
      status: "pending",
      ref: "RN-2026-0001",
      submittedAt: "2026-11-19T14:05:00",
      decisionAt: null,
      notes: "",
      draft: {
        passportNumber: "DEMO-12345",
        expiry: "2026-12-14",
        reason: "Expiring passport",
        processing: "Regular",
        first: "Demo",
        middle: "",
        last: "User",
        dob: "2005-01-15",
        sex: "Male",
        civil: "Single",
        phone: "000-000-0000",
        email: "demo@example.test",
        address: "Sample Address, Brgy. Central",
        city: "Quezon City",
        province: "Metro Manila",
        postal: "1100",
        citizenship: "Filipino",
        branch: "Quezon City Consular Office",
        date: "2026-11-26",
        time: "10:30 AM",
        passportCopy: "passport_copy.jpg",
        governmentId: "government_id.jpg",
        supporting: [],
        files: ["passport_copy.jpg", "government_id.jpg"]
      }
    }
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return seed();
      const parsed = JSON.parse(raw);
      const base = seed();
      return {
        ...base,
        ...parsed,
        application: { ...base.application, ...(parsed.application || {}) },
        renewal: { ...base.renewal, ...(parsed.renewal || {}), draft: { ...base.renewal.draft, ...((parsed.renewal || {}).draft || {}) } },
        credentials: { ...base.credentials, ...(parsed.credentials || {}) }
      };
    } catch (e) {
      return seed();
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage may be blocked */ }
  }

  function isLoggedIn() { return Boolean(state.session && state.session.appId); }

  function login(appId, password) {
    const normalized = (appId || "").trim().toUpperCase();
    const expected = state.credentials;
    const matchesDemo = normalized === DEMO_ID && password === DEMO_PASSWORD;
    const matchesGenerated = normalized === expected.appId.toUpperCase() && password === expected.password;
    if (!matchesDemo && !matchesGenerated) return false;
    const activeId = matchesGenerated ? expected.appId : normalized;
    state.session = { appId: activeId, name: state.application.name, at: new Date().toISOString() };
    state.application.id = activeId;
    save();
    return true;
  }

  function logout() { state.session = null; save(); }

  function reset() { state = seed(); save(); }

  function saveRegistration(patch) { state.registration = { ...state.registration, ...patch }; save(); }

  function completeRegistration() {
    const appId = "PS-" + String(Math.floor(10000 + Math.random() * 89999));
    const password = "Pw-" + Math.random().toString(36).slice(2, 9).replace(/[^a-zA-Z0-9]/g, "").slice(0, 6);
    const personal = state.registration.personal || {};
    const name = [personal.first, personal.middle, personal.last].filter(Boolean).join(" ") || "Demo User";
    const now = new Date().toISOString();
    state.credentials = { appId, password };
    state.registration.result = { appId, password };
    state.registration.agreed = true;
    state.application = {
      ...state.application,
      id: appId,
      name,
      email: personal.email || state.application.email,
      passportType: state.registration.appType === "Renewal" ? "Renewal" : "Regular (38 Pages)",
      processingType: state.registration.processingType || "Regular",
      stage: 1,
      status: "Submitted",
      delivered: false,
      submittedAt: now,
      updatedAt: now,
      steps: state.application.steps.map((step, index) => ({
        ...step,
        at: index === 0 ? now : null,
        state: index === 0 ? "current" : "upcoming",
        meta: index === 0 ? "Received" : "Pending previous phase completion"
      }))
    };
    save();
    return { appId, password };
  }

  function addInquiry({ category, subject, body }) {
    const highest = state.inquiries.reduce((max, item) => {
      const n = Number(String(item.id).replace(/\D/g, ""));
      return Number.isFinite(n) && n > max ? n : max;
    }, 900);
    const item = {
      id: `#INQ-${highest + 1}`,
      subject,
      category,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      officer: "Maya Cruz",
      messages: [
        { from: "me", name: "You", role: "Member", body, at: new Date().toISOString() }
      ]
    };
    state.inquiries.unshift(item);
    save();
    return item;
  }

  function addMessage(id, body) {
    const item = state.inquiries.find((i) => i.id === id);
    if (!item) return null;
    item.messages.push({ from: "me", name: "You", role: "Member", body, at: new Date().toISOString() });
    item.updatedAt = new Date().toISOString();
    item.status = "open";
    save();
    return item;
  }

  function setRenewalStatus(status, notes) {
    state.renewal.status = status;
    state.renewal.decisionAt = new Date().toISOString();
    if (notes) state.renewal.notes = notes;
    save();
  }

  function saveRenewalDraft(patch) { state.renewal.draft = { ...state.renewal.draft, ...patch }; save(); }

  function submitRenewal() {
    state.renewal.status = "pending";
    state.renewal.submittedAt = new Date().toISOString();
    state.renewal.decisionAt = null;
    save();
  }

  function setApplicationStage(stage) {
    const steps = state.application.steps.map((step, index) => {
      if (index + 1 < stage) return { ...step, state: "done", at: step.at || state.application.submittedAt };
      if (index + 1 === stage) return { ...step, state: "current", meta: step.key === "delivery" ? "Courier has the package" : "In progress" };
      return { ...step, state: "upcoming", at: null, meta: step.meta || "Pending previous phase completion" };
    });
    state.application.stage = stage;
    state.application.delivered = false;
    state.application.steps = steps;
    state.application.status = steps[stage - 1].label;
    save();
  }

  function markDelivered() {
    const now = new Date().toISOString();
    state.application.stage = 6;
    state.application.delivered = true;
    state.application.status = "Delivered";
    state.application.steps = state.application.steps.map((step, index) => ({
      ...step,
      state: "done",
      at: step.at || now,
      meta: index === 5 ? "Delivered" : step.meta
    }));
    save();
  }

  window.PT = {
    get state() { return state; },
    get application() { return state.application; },
    get renewal() { return state.renewal; },
    get inquiries() { return state.inquiries; },
    get registration() { return state.registration; },
    DEMO_ID, DEMO_PASSWORD,
    isLoggedIn, login, logout, reset, save,
    saveRegistration, completeRegistration,
    addInquiry, addMessage,
    setRenewalStatus, saveRenewalDraft, submitRenewal, setApplicationStage, markDelivered
  };
})();
