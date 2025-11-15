import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerApi, checkEmailApi } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const nav = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [checking, setChecking] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });

  const passwordValue = watch("password");

  // Check email khi blur
  const handleEmailBlur = async (e) => {
    const value = e.target.value.trim();

    // nếu format sai thì để RHF tự báo lỗi
    if (!emailRegex.test(value)) return;

    try {
      setChecking(true);
      const res = await checkEmailApi(value);

      if (res.exists) {
        setError("email", {
          type: "manual",
          message: "This email has been used",
        });
      } else {
        // nếu trước đó có lỗi email do "đã dùng" thì clear đi
        if (errors.email?.type === "manual") {
          clearErrors("email");
        }
      }
    } catch (err) {
      // có thể log ra nếu cần
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const onSubmit = async (data) => {
    // handleSubmit chỉ gọi onSubmit khi KHÔNG có errors
    try {
      await registerApi({
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      // lưu map email -> name để greet sau login
      const map = JSON.parse(localStorage.getItem("userNameByEmail") || "{}");
      map[data.email.trim()] = data.username.trim();
      localStorage.setItem("userNameByEmail", JSON.stringify(map));

      alert("Registration successful. Please log in.");
      nav("/login");
    } catch (err) {
      setError("root", {
        type: "server",
        message: err?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-1">Create account</h1>
        <p className="text-sm text-gray-600 mb-6">Sign up to get started.</p>

        {errors.root && (
          <p className="text-red-600 text-sm mb-2">
            {errors.root.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full name"
            {...register("username", {
              required: "Please enter your full name",
              validate: (v) =>
                v.trim().length > 0 || "Please enter your full name",
            })}
            placeholder="e.g., John Doe"
            error={errors.username?.message}
          />

          <Input
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: emailRegex,
                message: "Invalid email",
              },
            })}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
            error={errors.email?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Password"
              type={showPwd ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "At least 6 characters",
                },
              })}
              placeholder="••••••"
              error={errors.password?.message}
            />
            <Input
              label="Confirm password"
              type={showPwd ? "text" : "password"}
              {...register("confirm", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
              placeholder="••••••"
              error={errors.confirm?.message}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                onChange={(e) => setShowPwd(e.target.checked)}
              />
            </label>
            Show passwords
            {checking ? (
              <span className="text-xs text-gray-500">Checking email…</span>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || checking}
            className="w-full"
          >
            {isSubmitting ? "Creating…" : "Register"}
          </Button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
