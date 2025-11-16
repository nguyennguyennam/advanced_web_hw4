import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import { setupMultiTabSync } from "./auth/authStore";

export default function App() {
  useEffect(() => {
    setupMultiTabSync(); // <-- enable multi-tab sync
  }, []);

  return (
    <>
      <nav className="w-full border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between">
          <Link to="/" className="font-semibold text-lg">
            MyApp
          </Link>

          <div className="flex gap-4 text-sm">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Admin Route*/}
        <Route
          path="/admin"
          element={
            <RoleRoute allowed={["admin"]}>
              <Home />
            </RoleRoute>
          }
        />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/not-authorized" element={<div>Not authorized</div>} />
      </Routes>
    </>
  );
}
