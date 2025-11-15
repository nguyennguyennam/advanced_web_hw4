import { Navigate } from "react-router-dom";
import { useUser } from "../auth/useAuth";

export default function RoleRoute({ children, allowed }) {
  const { data: user, isLoading, isError } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <Navigate to="/login" replace />;

  if (!allowed.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
