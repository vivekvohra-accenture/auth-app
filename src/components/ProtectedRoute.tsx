import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { Role } from "../types/users";

type Props = {
  children: ReactNode;
  requiredRole?: Role;     // 🆕 optional role restriction
};


export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { currentUser, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Not logged in → go to login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // 🆕 Logged in but wrong role → go to dashboard
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}