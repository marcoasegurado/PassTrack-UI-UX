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
import { Profile } from "./pages/member/Profile";

function MemberOnly({ children }) {
  const { isMemberLoggedIn } = useStore();

  return (
    <ProtectedRoute allowed={isMemberLoggedIn} redirectTo="/login">
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
              path="/profile"
              element={
                <MemberOnly>
                  <Profile />
                </MemberOnly>
              }
            />

            <Route path="/styleguide" element={<StyleGuide />} />
            <Route path="/store-check" element={<StoreCheck />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ToastProvider>
  );
}
