"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useDashboardStore } from "@/store/dashboardStore";

export default function RegisterPage() {
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useDashboardStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterInfo({ ...registerInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !registerInfo.name ||
      !registerInfo.email ||
      !registerInfo.password ||
      !registerInfo.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (registerInfo.password !== registerInfo.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (registerInfo.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerInfo.name,
          email: registerInfo.email,
          password: registerInfo.password,
        }),
      });

      const result = await res.json();
      const { success, message, jwtToken, email, name } = result;

      if (success) {
        toast({
          title: "Registration Successful",
          description: "Account created successfully! You are now logged in.",
          variant: "default",
          className: "bg-green-400 text-black",
          duration: 2000,
        });

        // Save user data and login
        await localStorage.setItem(
          "user",
          JSON.stringify({ name: name, email: email, token: jwtToken })
        );
        setUser(
          localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user") as string)
            : null
        );
        router.push("/");
      } else {
        toast({
          title: "Registration Failed",
          description: message,
          variant: "default",
          className: "bg-red-400 text-black",
          duration: 2000,
        });
        setError(message);
      }
    } catch (error: any) {
      const message =
        error.message || "Something went wrong. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "default",
        className: "bg-red-400 text-black",
        duration: 2000,
      });
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
          {/* Logo/Icon */}
          <div className="text-center mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gray-900 rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Join Nior Task Manager
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full rounded-xl bg-white border border-gray-300 px-3 md:px-4 py-2.5 md:py-3 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all duration-200 text-sm md:text-base"
                placeholder="Enter your name"
                name="name"
                value={registerInfo.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-xl bg-white border border-gray-300 px-3 md:px-4 py-2.5 md:py-3 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all duration-200 text-sm md:text-base"
                placeholder="Enter your email"
                name="email"
                value={registerInfo.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full rounded-xl bg-white border border-gray-300 px-3 md:px-4 py-2.5 md:py-3 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all duration-200 text-sm md:text-base"
                placeholder="Minimum 6 characters"
                name="password"
                value={registerInfo.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full rounded-xl bg-white border border-gray-300 px-3 md:px-4 py-2.5 md:py-3 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all duration-200 text-sm md:text-base"
                placeholder="Re-enter your password"
                name="confirmPassword"
                value={registerInfo.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <p className="text-black text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-900 py-2.5 md:py-3 text-white font-semibold hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 rounded-full">
                  Already have an account?
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-4 rounded-xl bg-white border border-gray-300 py-2.5 md:py-3 text-gray-900 font-semibold hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 text-sm md:text-base"
              onClick={handleSignIn}>
              Sign In Instead
            </button>
          </div>

          {/* <div className="mt-6 text-center">
            <p className="text-xs text-white/60">
              By creating an account, you agree to our{" "}
              <a
                href="#"
                className="text-purple-300 hover:text-purple-200 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-purple-300 hover:text-purple-200 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
