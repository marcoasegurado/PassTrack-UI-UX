import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { createSeedState } from "./seed";
import { loadState, saveState } from "./storage";
import {
  getAdminMetrics,
  getInquiry,
  getMember,
  getMemberApplication,
  getMemberInquiries,
  getMemberRenewals,
  getRenewal,
} from "./selectors";
import {
  APPLICATION_STATUS,
  INQUIRY_STATUS,
  RENEWAL_STATUS,
} from "../lib/constants";
import {
  generateAppId,
  generateInquiryId,
  generateMessageId,
  generatePassword,
  generateRenewalRef,
} from "../lib/ids";

const StoreContext = createContext(null);

const RENEWAL_STATUSES = Object.values(RENEWAL_STATUS);
const INQUIRY_STATUSES = Object.values(INQUIRY_STATUS);

function mergeDraft(current, patch) {
  const next = { ...current, ...patch };

  ["personal", "idDetails", "application", "documents", "appointment"].forEach((key) => {
    if (patch[key] && typeof patch[key] === "object" && !Array.isArray(patch[key])) {
      next[key] = { ...(current[key] || {}), ...patch[key] };
    }
  });

  return next;
}

function reducer(state, action) {
  switch (action.type) {
    case "MEMBER_LOGIN":
      return { ...state, memberSession: action.session };

    case "MEMBER_LOGOUT":
      return { ...state, memberSession: null };

    case "ADMIN_LOGIN":
      return { ...state, adminSession: action.session };

    case "ADMIN_LOGOUT":
      return { ...state, adminSession: null };

    case "REGISTER":
      return {
        ...state,
        members: [...state.members, action.member],
        applications: [action.application, ...state.applications],
        registrationDraft: {},
        lastRegistration: action.result,
      };

    case "SAVE_REGISTRATION_DRAFT":
      return {
        ...state,
        registrationDraft: mergeDraft(state.registrationDraft, action.patch),
      };

    case "RESET_REGISTRATION_DRAFT":
      return { ...state, registrationDraft: {} };

    case "SAVE_RENEWAL_DRAFT":
      return {
        ...state,
        renewalDraft: mergeDraft(state.renewalDraft, action.patch),
      };

    case "RESET_RENEWAL_DRAFT":
      return { ...state, renewalDraft: {} };

    case "UPDATE_MEMBER_PROFILE": {
      const members = state.members.map((member) =>
        member.id === action.memberId
          ? { ...member, ...action.patch, updatedAt: action.at }
          : member,
      );

      const applications = state.applications.map((application) => {
        if (application.memberId !== action.memberId) return application;
        return {
          ...application,
          applicantName: action.patch.name ?? application.applicantName,
          email: action.patch.email ?? application.email,
          contact: action.patch.contact ?? application.contact,
          address: action.patch.address ?? application.address,
          city: action.patch.city ?? application.city,
          province: action.patch.province ?? application.province,
          postalCode: action.patch.postalCode ?? application.postalCode,
          updatedAt: action.at,
        };
      });

      return { ...state, members, applications };
    }

    case "UPDATE_ADMIN_PROFILE":
      return {
        ...state,
        adminProfile: { ...state.adminProfile, ...action.patch },
      };

    case "APPLICATION_STATUS": {
      const applications = state.applications.map((application) => {
        if (application.id !== action.applicationId) return application;

        return {
          ...application,
          status: action.status,
          updatedAt: action.at,
          note: action.note || application.note,
          rejectionReason:
            action.status === APPLICATION_STATUS.REJECTED
              ? action.note || application.rejectionReason
              : application.rejectionReason,
          history: [
            ...(application.history || []),
            { status: action.status, at: action.at, note: action.note || "" },
          ],
        };
      });

      return { ...state, applications };
    }

    case "SUBMIT_RENEWAL":
      return {
        ...state,
        renewals: [action.renewal, ...state.renewals],
        renewalDraft: {},
      };

    case "DECIDE_RENEWAL": {
      const renewals = state.renewals.map((renewal) =>
        renewal.ref === action.reference
          ? {
              ...renewal,
              status: action.status,
              notes: action.notes,
              decisionAt: action.at,
            }
          : renewal,
      );

      return { ...state, renewals };
    }

    case "ADD_INQUIRY":
      return { ...state, inquiries: [action.inquiry, ...state.inquiries] };

    case "ADD_INQUIRY_MESSAGE": {
      const inquiries = state.inquiries.map((inquiry) => {
        if (inquiry.id !== action.inquiryId) return inquiry;

        return {
          ...inquiry,
          status: action.status,
          updatedAt: action.at,
          attachments: [...(inquiry.attachments || []), ...action.attachments],
          messages: [...inquiry.messages, action.message],
        };
      });

      return { ...state, inquiries };
    }

    case "SET_INQUIRY_STATUS": {
      const inquiries = state.inquiries.map((inquiry) =>
        inquiry.id === action.inquiryId
          ? { ...inquiry, status: action.status, updatedAt: action.at }
          : inquiry,
      );

      return { ...state, inquiries };
    }

    case "RESET":
      return createSeedState();

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = useMemo(() => {
    const now = () => new Date().toISOString();
    const currentState = () => stateRef.current;

    function loginMember(appId, password) {
      const current = currentState();
      const normalized = String(appId || "").trim().toUpperCase();

      if (!normalized || !password) {
        return {
          ok: false,
          error: "Enter your Application ID and Password to continue.",
        };
      }

      const member = current.members.find(
        (item) =>
          item.appId.toUpperCase() === normalized && item.password === password,
      );

      if (!member) {
        return {
          ok: false,
          error:
            "Login failed. Please check your Application ID and Password and try again.",
        };
      }

      dispatch({
        type: "MEMBER_LOGIN",
        session: {
          appId: member.appId,
          memberId: member.id,
          name: member.name,
          at: now(),
        },
      });

      return { ok: true, member };
    }

    function logoutMember() {
      dispatch({ type: "MEMBER_LOGOUT" });
    }

    function loginAdmin(username, password) {
      const current = currentState();
      const normalizedUsername = String(username || "").trim();
      const normalizedPassword = String(password || "").trim();

      if (!normalizedUsername || !normalizedPassword) {
        return {
          ok: false,
          error: "Enter your username and password to continue.",
        };
      }

      dispatch({
        type: "ADMIN_LOGIN",
        session: {
          username: normalizedUsername,
          name: current.adminProfile.name,
          at: now(),
        },
      });

      return { ok: true };
    }

    function logoutAdmin() {
      dispatch({ type: "ADMIN_LOGOUT" });
    }

    function registerMember({ personal = {}, idDetails = {}, application = {} } = {}) {
      const current = currentState();

      if (!application.termsAccepted) {
        return {
          ok: false,
          error: "Accept the Terms and Conditions before submitting your application.",
        };
      }

      const at = now();
      const appId = generateAppId([
        ...current.members.map((member) => member.appId),
        ...current.applications.map((application) => application.id),
      ]);
      const password = generatePassword();
      const name =
        [personal.firstName, personal.middleName, personal.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() || "New Applicant";
      const processingType = application.processingType || "Regular";
      const passportType =
        application.appType === "Renewal"
          ? "Renewal"
          : processingType === "Express"
            ? "Express"
            : "Regular (38 Pages)";
      const estimatedCompletion = new Date(
        Date.now() + (processingType === "Express" ? 7 : 12) * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .slice(0, 10);

      const member = {
        id: `mem_${appId}`,
        appId,
        password,
        ...personal,
        ...idDetails,
        name,
        email: personal.email || "",
        contact: personal.contact || "",
        passport: { number: "", expiry: "", issuedAt: "" },
        createdAt: at,
        updatedAt: at,
      };

      const applicationRecord = {
        id: appId,
        memberId: member.id,
        applicantName: name,
        applicationType: application.appType || "New Passport",
        passportType,
        processingType,
        email: personal.email || "",
        contact: personal.contact || "",
        address: idDetails.address || "",
        city: idDetails.city || "",
        province: idDetails.province || "",
        postalCode: idDetails.postalCode || "",
        status: APPLICATION_STATUS.SUBMITTED,
        submittedAt: at,
        updatedAt: at,
        estimatedCompletion,
        nextStep: "Initial document check",
        note: "Application received. Initial checks are queued. Payment is not collected in this demo.",
        rejectionReason: "",
        courier: "",
        termsAcceptedAt: at,
        history: [
          {
            status: APPLICATION_STATUS.SUBMITTED,
            at,
            note: "Application received.",
          },
        ],
      };

      dispatch({
        type: "REGISTER",
        member,
        application: applicationRecord,
        result: { appId, password, name, at },
      });

      return {
        ok: true,
        appId,
        password,
        member,
        application: applicationRecord,
      };
    }

    function saveRegistrationDraft(patch) {
      dispatch({ type: "SAVE_REGISTRATION_DRAFT", patch });
    }

    function resetRegistrationDraft() {
      dispatch({ type: "RESET_REGISTRATION_DRAFT" });
    }

    function updateMemberProfile(patch) {
      const current = currentState();
      const session = current.memberSession;

      if (!session) {
        return { ok: false, error: "Sign in to update your profile." };
      }

      const member = getMember(current, session.memberId);
      if (!member) {
        return { ok: false, error: "Member record not found." };
      }

      const name = [
        patch.firstName ?? member.firstName,
        patch.middleName ?? member.middleName,
        patch.lastName ?? member.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      dispatch({
        type: "UPDATE_MEMBER_PROFILE",
        memberId: member.id,
        patch: { ...patch, name: name || member.name },
        at: now(),
      });

      return { ok: true };
    }

    function updateAdminProfile(patch) {
      dispatch({ type: "UPDATE_ADMIN_PROFILE", patch });
      return { ok: true };
    }

    function updateApplicationStatus(applicationId, status, note = "") {
      const current = currentState();
      const application = current.applications.find((item) => item.id === applicationId);

      if (!application) {
        return { ok: false, error: "Application not found." };
      }

      if (status === APPLICATION_STATUS.REJECTED && !String(note || "").trim()) {
        return { ok: false, error: "Add a reason before rejecting an application." };
      }

      const at = now();
      dispatch({
        type: "APPLICATION_STATUS",
        applicationId,
        status,
        note: String(note || "").trim(),
        at,
      });

      return {
        ok: true,
        application: {
          ...application,
          status,
          updatedAt: at,
          note: String(note || "").trim() || application.note,
          rejectionReason:
            status === APPLICATION_STATUS.REJECTED
              ? String(note || "").trim()
              : application.rejectionReason,
        },
      };
    }

    function saveRenewalDraft(patch) {
      dispatch({ type: "SAVE_RENEWAL_DRAFT", patch });
    }

    function resetRenewalDraft() {
      dispatch({ type: "RESET_RENEWAL_DRAFT" });
    }

    function submitRenewal(draft) {
      const current = currentState();
      const session = current.memberSession;

      if (!session) {
        return { ok: false, error: "Sign in to submit a renewal request." };
      }

      const member = getMember(current, session.memberId);
      if (!member) {
        return { ok: false, error: "Member record not found." };
      }

      const draftData = draft || current.renewalDraft;
      if (!draftData?.passportNumber || !draftData?.expiry) {
        return {
          ok: false,
          error: "Add your current passport number and expiry date first.",
        };
      }

      const at = now();
      const application = getMemberApplication(current, member.id);
      const renewal = {
        ref: generateRenewalRef(current.renewals.map((item) => item.ref)),
        memberId: member.id,
        applicationId: application?.id || member.appId,
        applicantName: member.name,
        email: member.email,
        status: RENEWAL_STATUS.PENDING,
        submittedAt: at,
        decisionAt: null,
        notes: "",
        draft: draftData,
      };

      dispatch({ type: "SUBMIT_RENEWAL", renewal });

      return { ok: true, renewal };
    }

    function decideRenewal(reference, status, notes = "") {
      const current = currentState();
      const renewal = getRenewal(current, reference);

      if (!renewal) {
        return { ok: false, error: "Renewal request not found." };
      }

      if (!RENEWAL_STATUSES.includes(status)) {
        return { ok: false, error: "Choose a valid renewal decision." };
      }

      if (status === RENEWAL_STATUS.REJECTED && !String(notes || "").trim()) {
        return { ok: false, error: "Add a reason before rejecting a renewal request." };
      }

      const at = now();
      dispatch({
        type: "DECIDE_RENEWAL",
        reference,
        status,
        notes: String(notes || "").trim(),
        at,
      });

      return { ok: true };
    }

    function addInquiry({
      subject,
      category,
      priority = "Medium",
      body,
      attachments = [],
      replyChannels = [],
    }) {
      const current = currentState();
      const session = current.memberSession;

      if (!session) {
        return { ok: false, error: "Sign in to create an inquiry." };
      }

      if (!String(subject || "").trim() || !String(body || "").trim()) {
        return { ok: false, error: "Add a subject and a detailed message." };
      }

      const member = getMember(current, session.memberId);
      if (!member) {
        return { ok: false, error: "Member record not found." };
      }

      const at = now();
      const application = getMemberApplication(current, member.id);
      const id = generateInquiryId(current.inquiries.map((inquiry) => inquiry.id));
      const message = {
        id: generateMessageId(id, 0),
        from: "member",
        author: member.name,
        role: "Member",
        body: String(body).trim(),
        at,
        attachments,
      };

      const inquiry = {
        id,
        applicationId: application?.id || member.appId,
        memberId: member.id,
        applicantName: member.name,
        subject: String(subject).trim(),
        category: category || "Other",
        priority,
        status: INQUIRY_STATUS.OPEN,
        assignedOfficer: "Maya Cruz",
        createdAt: at,
        updatedAt: at,
        attachments,
        replyChannels,
        messages: [message],
      };

      dispatch({ type: "ADD_INQUIRY", inquiry });

      return { ok: true, inquiry };
    }

    function addInquiryMessage(
      inquiryId,
      { body, from = "member", attachments = [], copyToEmail = false } = {},
    ) {
      const current = currentState();
      const inquiry = getInquiry(current, inquiryId);

      if (!inquiry) {
        return { ok: false, error: "Inquiry not found." };
      }

      if (!String(body || "").trim() && attachments.length === 0) {
        return { ok: false, error: "Write a reply or attach a file." };
      }

      const isSupport = from === "support";
      const member = inquiry.memberId ? getMember(current, inquiry.memberId) : null;
      const author = isSupport
        ? current.adminProfile.name
        : member?.name || inquiry.applicantName;
      const at = now();
      const status = isSupport ? INQUIRY_STATUS.AWAITING : INQUIRY_STATUS.OPEN;

      const message = {
        id: generateMessageId(inquiryId, inquiry.messages.length),
        from: isSupport ? "support" : "member",
        author,
        role: isSupport ? "Passport Services" : "Member",
        body: String(body || "").trim(),
        at,
        attachments,
        copyToEmail,
      };

      dispatch({
        type: "ADD_INQUIRY_MESSAGE",
        inquiryId,
        status,
        at,
        message,
        attachments,
      });

      return {
        ok: true,
        inquiry: {
          ...inquiry,
          status,
          updatedAt: at,
          attachments: [...(inquiry.attachments || []), ...attachments],
          messages: [...inquiry.messages, message],
        },
      };
    }

    function setInquiryStatus(inquiryId, status) {
      const current = currentState();
      const inquiry = getInquiry(current, inquiryId);

      if (!inquiry) {
        return { ok: false, error: "Inquiry not found." };
      }

      if (!INQUIRY_STATUSES.includes(status)) {
        return { ok: false, error: "Choose a valid inquiry status." };
      }

      dispatch({
        type: "SET_INQUIRY_STATUS",
        inquiryId,
        status,
        at: now(),
      });

      return { ok: true };
    }

    function resetDemo() {
      dispatch({ type: "RESET" });
    }

    return {
      loginMember,
      logoutMember,
      loginAdmin,
      logoutAdmin,
      registerMember,
      saveRegistrationDraft,
      resetRegistrationDraft,
      updateMemberProfile,
      updateAdminProfile,
      updateApplicationStatus,
      saveRenewalDraft,
      resetRenewalDraft,
      submitRenewal,
      decideRenewal,
      addInquiry,
      addInquiryMessage,
      setInquiryStatus,
      resetDemo,
    };
  }, []);

  const value = useMemo(() => {
    const member = state.memberSession
      ? getMember(state, state.memberSession.memberId)
      : null;
    const application = member ? getMemberApplication(state, member.id) : null;
    const memberRenewals = member ? getMemberRenewals(state, member.id) : [];
    const memberInquiries = member ? getMemberInquiries(state, member.id) : [];

    return {
      state,
      member,
      application,
      memberRenewals,
      latestRenewal: memberRenewals[0] || null,
      memberInquiries,
      adminProfile: state.adminProfile,
      adminMetrics: getAdminMetrics(state),
      isMemberLoggedIn: Boolean(state.memberSession),
      isAdminLoggedIn: Boolean(state.adminSession),
      ...actions,
    };
  }, [state, actions]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used inside a StoreProvider.");
  }

  return context;
}
