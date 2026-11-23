import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ allowed, redirectTo, children }) {
  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ?? <Outlet />;
}
