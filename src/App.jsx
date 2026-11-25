import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { StoreProvider, useStore } from "./data/StoreProvider";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { NotFound } from "./components/layout/NotFound";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { StyleGuide } from "./pages/dev/StyleGuide";
import { StoreCheck } from "./pages/dev/StoreCheck";
import { Login } from "./pages/auth/Login";
import { RegisterPersonal } from "./pages/auth/RegisterPersonal";
import { RegisterId } from "./pages/auth/RegisterId";
import { RegisterApplication } from "./pages/auth/RegisterApplication";
import { Terms } from "./pages/auth/Terms";
import { RegisterSuccess } from "./pages/auth/RegisterSuccess";
import { Dashboard } from "./pages/member/Dashboard";
import { ApplicationStatus } from "./pages/member/ApplicationStatus";
import { ApplicationInformation } from "./pages/member/ApplicationInformation";
import { Profile } from "./pages/member/Profile";
import { Inquiries } from "./pages/member/Inquiries";
import { InquiryDetail } from "./pages/member/InquiryDetail";
import { RenewalEligibility } from "./pages/renewal/Eligibility";
import { RenewalPersonalDetails } from "./pages/renewal/PersonalDetails";
import { RenewalDocumentsAppointment } from "./pages/renewal/DocumentsAppointment";
import { RenewalReview } from "./pages/renewal/Review";
import { RenewalSubmitted } from "./pages/renewal/Submitted";
import { RenewalStatus } from "./pages/renewal/Status";
import { RenewalStepGuard } from "./components/renewal/RenewalStepGuard";
import { AdminLogin } from "./pages/admin/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminApplications } from "./pages/admin/Applications";
import { AdminApplicationDetail } from "./pages/admin/ApplicationDetail";
import { AdminRenewals } from "./pages/admin/Renewals";
import { AdminRenewalDetail } from "./pages/admin/RenewalDetail";
import { AdminInquiries } from "./pages/admin/Inquiries";
import { AdminInquiryDetail } from "./pages/admin/InquiryDetail";
import { AdminProfile } from "./pages/admin/Profile";

function MemberOnly({ children }) {
  const { isMemberLoggedIn } = useStore();

  return (
    <ProtectedRoute allowed={isMemberLoggedIn} redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}

function AdminOnly({ children }) {
  const { isAdminLoggedIn } = useStore();

  return (
    <ProtectedRoute allowed={isAdminLoggedIn} redirectTo="/admin/login">
      {children}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <StoreProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/register"
              element={<Navigate to="/register/personal-details" replace />}
            />
            <Route path="/register/personal-details" element={<RegisterPersonal />} />
            <Route path="/register/id-details" element={<RegisterId />} />
            <Route path="/register/application" element={<RegisterApplication />} />
            <Route path="/register/success" element={<RegisterSuccess />} />
            <Route path="/terms" element={<Terms />} />

            <Route
              path="/dashboard"
              element={
                <MemberOnly>
                  <Dashboard />
                </MemberOnly>
              }
            />

            <Route
              path="/application/status"
              element={
                <MemberOnly>
                  <ApplicationStatus />
                </MemberOnly>
              }
            />

            <Route
              path="/application/information"
              element={
                <MemberOnly>
                  <ApplicationInformation />
                </MemberOnly>
              }
            />

            <Route
              path="/profile"
              element={
                <MemberOnly>
                  <Profile />
                </MemberOnly>
              }
            />

            <Route
              path="/inquiries"
              element={
                <MemberOnly>
                  <Inquiries />
                </MemberOnly>
              }
            />
            <Route
              path="/inquiries/new"
              element={<Navigate to="/inquiries?new=1" replace />}
            />
            <Route
              path="/inquiries/:ticketId"
              element={
                <MemberOnly>
                  <InquiryDetail />
                </MemberOnly>
              }
            />

            <Route
              path="/renewal"
              element={<Navigate to="/renewal/eligibility" replace />}
            />
            <Route
              path="/renewal/eligibility"
              element={
                <MemberOnly>
                  <RenewalEligibility />
                </MemberOnly>
              }
            />
            <Route
              path="/renewal/personal-details"
              element={
                <MemberOnly>
                  <RenewalStepGuard>
                    <RenewalPersonalDetails />
                  </RenewalStepGuard>
                </MemberOnly>
              }
            />
            <Route
              path="/renewal/documents-appointment"
              element={
                <MemberOnly>
                  <RenewalStepGuard>
                    <RenewalDocumentsAppointment />
                  </RenewalStepGuard>
                </MemberOnly>
              }
            />
            <Route
              path="/renewal/review"
              element={
                <MemberOnly>
                  <RenewalStepGuard>
                    <RenewalReview />
                  </RenewalStepGuard>
                </MemberOnly>
              }
            />
            <Route
              path="/renewal/submitted"
              element={
                <MemberOnly>
                  <RenewalSubmitted />
                </MemberOnly>
              }
            />
            <Route
              path="/renewal/status"
              element={
                <MemberOnly>
                  <RenewalStatus />
                </MemberOnly>
              }
            />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
            <Route path="/admin/applications" element={<AdminOnly><AdminApplications /></AdminOnly>} />
            <Route path="/admin/applications/:applicationId" element={<AdminOnly><AdminApplicationDetail /></AdminOnly>} />
            <Route path="/admin/renewals" element={<AdminOnly><AdminRenewals /></AdminOnly>} />
            <Route path="/admin/renewals/:reference" element={<AdminOnly><AdminRenewalDetail /></AdminOnly>} />
            <Route path="/admin/inquiries" element={<AdminOnly><AdminInquiries /></AdminOnly>} />
            <Route path="/admin/inquiries/:ticketId" element={<AdminOnly><AdminInquiryDetail /></AdminOnly>} />
            <Route path="/admin/profile" element={<AdminOnly><AdminProfile /></AdminOnly>} />

            <Route path="/styleguide" element={<StyleGuide />} />
            <Route path="/store-check" element={<StoreCheck />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ToastProvider>
  );
}
