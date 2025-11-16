import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import { setupMultiTabSync } from "./auth/authStore";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setupMultiTabSync(); // <-- enable multi-tab sync
  }, []);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!accessToken || !!user);
    } catch (e) {
      setIsAuthenticated(false);
    }
  }, [location.pathname]);

  return (
    <>
      <nav className="w-full border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between">
          <Link to="/" className="font-semibold text-lg">
            MyApp
          </Link>

          {!isAuthenticated && (
            <div className="flex gap-4 text-sm">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute allowed={["admin"]}>
              <Home />
            </RoleRoute>
          }
        />

        <Route path="/not-authorized" element={<div>Not authorized</div>} />
      </Routes>

    </>
  );
}
