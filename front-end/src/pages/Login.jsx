import React from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../auth/useAuth";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const login = useLogin();
  const nav = useNavigate();

  const onSubmit = (data) => {
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
        alert("Login failed: " + (err?.response?.data?.message || "Unknown error"));
      }
    });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {login.isError && (
          <p className="text-red-600">{login.error.message}</p>
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
