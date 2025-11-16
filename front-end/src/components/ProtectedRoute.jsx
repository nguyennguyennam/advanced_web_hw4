import { Navigate } from "react-router-dom";
import { useUser } from "../auth/useAuth";

export default function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem("accessToken");
  const userCached = localStorage.getItem("user");

  const hasAuth = !!accessToken || !!userCached;

  if (!hasAuth) {
    return <Navigate to="/login" replace />;
  }

  const { data, isError, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (isError || !data) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
