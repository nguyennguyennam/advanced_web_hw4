import { Navigate } from "react-router-dom";
import { useUser } from "../auth/useAuth";

export default function ProtectedRoute({ children }) {
  const { data, isError, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <Navigate to="/login" replace />;

  return children;
}
