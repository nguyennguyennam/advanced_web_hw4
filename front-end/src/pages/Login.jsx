import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../auth/useAuth";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const login = useLogin();
  const nav = useNavigate();
  const [serverError, setServerError] = useState("");

  const onSubmit = (data) => {
    setServerError(""); 

    login.mutate(data, {
      onSuccess: (res) => {
        const user = res.user;

        if (user.role === "admin") {
          nav("/admin");
        } else {
          nav("/");
        }
      },
      onError: (err) => {
        const msg =
          err?.response?.data?.message ||
          "Login failed. Please try again.";
        // ví dụ: "invalid email or password"
        setServerError(msg);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {serverError && (
          <p className="text-red-600 text-sm mb-3">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" {...register("email")} required />
          <Input
            label="Password"
            type="password"
            {...register("password")}
            required
          />

          <Button type="submit" className="w-full mt-3">
            {login.isPending ? "Loading..." : "Login"}
          </Button>
        </form>

        <p className="text-sm mt-4">
          No account?{" "}
          <Link className="text-blue-600" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
