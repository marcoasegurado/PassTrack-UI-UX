import { APPLICATION_STATUS } from "../lib/constants";

export function getMember(state, memberId) {
  return state.members.find((member) => member.id === memberId) || null;
}

export function getMemberByAppId(state, appId) {
  const normalized = String(appId || "").trim().toUpperCase();
  return (
    state.members.find((member) => member.appId.toUpperCase() === normalized) || null
  );
}

export function getApplication(state, applicationId) {
  return state.applications.find((application) => application.id === applicationId) || null;
}

export function getMemberApplications(state, memberId) {
  return state.applications
    .filter((application) => application.memberId === memberId)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export function getMemberApplication(state, memberId) {
  return getMemberApplications(state, memberId)[0] || null;
}

export function getRenewal(state, reference) {
  return state.renewals.find((renewal) => renewal.ref === reference) || null;
}

export function getMemberRenewals(state, memberId) {
  return state.renewals
    .filter((renewal) => renewal.memberId === memberId)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export function getLatestRenewal(state, memberId) {
  return getMemberRenewals(state, memberId)[0] || null;
}

export function getInquiry(state, inquiryId) {
  return state.inquiries.find((inquiry) => inquiry.id === inquiryId) || null;
}

export function getMemberInquiries(state, memberId) {
  return state.inquiries
    .filter((inquiry) => inquiry.memberId === memberId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function getSessionMember(state) {
  if (!state.memberSession) return null;
  return getMember(state, state.memberSession.memberId);
}

export function getSessionApplication(state) {
  const member = getSessionMember(state);
  return member ? getMemberApplication(state, member.id) : null;
}

export function getSessionRenewals(state) {
  const member = getSessionMember(state);
  return member ? getMemberRenewals(state, member.id) : [];
}

export function getSessionLatestRenewal(state) {
  return getSessionRenewals(state)[0] || null;
}

export function getSessionInquiries(state) {
  const member = getSessionMember(state);
  return member ? getMemberInquiries(state, member.id) : [];
}

export function getAdminMetrics(state) {
  const count = (status) =>
    state.applications.filter((application) => application.status === status).length;

  return {
    total: state.applications.length,
    submitted: count(APPLICATION_STATUS.SUBMITTED),
    underReview: count(APPLICATION_STATUS.UNDER_REVIEW),
    processing: count(APPLICATION_STATUS.PROCESSING),
    readyForRelease: count(APPLICATION_STATUS.READY_FOR_RELEASE),
    approved: count(APPLICATION_STATUS.APPROVED),
    forDelivery: count(APPLICATION_STATUS.FOR_DELIVERY),
    released: count(APPLICATION_STATUS.DELIVERED),
    rejected: count(APPLICATION_STATUS.REJECTED),
    pendingRenewals: state.renewals.filter((renewal) => renewal.status === "PENDING").length,
    openInquiries: state.inquiries.filter((inquiry) => inquiry.status !== "RESOLVED").length,
  };
}
