import React, { useEffect, useState } from "react";
import { meApi } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "../auth/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { mutate: logoutMutation, isPending } = useLogout();

  useEffect(() => {
    meApi()
      .then(setUser)
      .catch(() => navigate("/login"));
  }, [navigate]);

  const logout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  const displayName = user.email;
  const isAdminPage = location.pathname === "/admin";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      {isAdminPage ? (
        <h1 className="text-3xl font-bold">Hello {displayName} admin!!</h1>
      ) : (
        <h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
      )}

      <button
        onClick={logout}
        disabled={isPending}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
