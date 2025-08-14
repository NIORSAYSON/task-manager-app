"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/dashboardStore";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { user, setUser } = useDashboardStore();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    // Client-side validation
    if (!loginInfo.email || !loginInfo.password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (!loginInfo.email.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await res.json();
      const { success, message, jwtToken, email, name } = result;

      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${name}!`,
          variant: "default",
          className: "bg-green-500 text-white border-green-600",
          duration: 3000,
        });

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
        // Handle specific error cases
        let errorMessage = message || "Login failed. Please try again.";

        if (
          res.status === 404 ||
          message?.toLowerCase().includes("user not found")
        ) {
          errorMessage = "No account found with this email address.";
        } else if (
          res.status === 401 ||
          message?.toLowerCase().includes("invalid password")
        ) {
          errorMessage = "Incorrect password. Please try again.";
        } else if (res.status === 400) {
          errorMessage = "Please check your email and password.";
        }

        setError(errorMessage);

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
          className: "bg-red-500 text-white border-red-600",
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage =
        "Network error. Please check your connection and try again.";

      // Handle network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage = "Unable to connect to server. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(
      localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null
    );
  }, [setUser]);

  // Redirecting the user to the dashboard if they are already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSignUp = () => {
    router.push("/register");
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Nior Task Manager
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Welcome back! Please sign in to continue
            </p>

            {/* Test Account Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-800 font-medium mb-1">
                Test Account:
              </p>
              <p className="text-xs text-blue-700">
                Email:{" "}
                <span className="font-mono font-semibold">test@gmail.com</span>
              </p>
              <p className="text-xs text-blue-700">
                Password:{" "}
                <span className="font-mono font-semibold">test123</span>
              </p>
            </div>
          </div>

          <form onSubmit={submitForm} className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`w-full rounded-xl bg-white border px-3 md:px-4 py-2.5 md:py-3 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-200 text-sm md:text-base ${
                  error &&
                  (error.toLowerCase().includes("email") ||
                    error.toLowerCase().includes("account"))
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                }`}
                placeholder="Enter your email"
                name="email"
                value={loginInfo.email}
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
                className={`w-full rounded-xl bg-white border px-3 md:px-4 py-2.5 md:py-3 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-200 text-sm md:text-base ${
                  error && error.toLowerCase().includes("password")
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                }`}
                placeholder="Enter your password"
                name="password"
                value={loginInfo.password}
                autoComplete="on"
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-900 py-2.5 md:py-3 text-white font-semibold hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 rounded-full">
                  Don't have an account?
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-4 rounded-xl bg-white border border-gray-300 py-2.5 md:py-3 text-gray-900 font-semibold hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 text-sm md:text-base"
              onClick={handleSignUp}>
              Create Account
            </button>
          </div>

          {/* Forgot Password Link - for future implementation */}
          {/* <div className="mt-4 text-center">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              onClick={() => {
                toast({
                  title: "Feature Coming Soon",
                  description:
                    "Password reset functionality will be available soon.",
                  variant: "default",
                  className: "bg-blue-500 text-white border-blue-600",
                  duration: 3000,
                });
              }}>
              Forgot your password?
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
