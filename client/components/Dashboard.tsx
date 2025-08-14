"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Tasklist from "./Tasklist";
import Kanban from "./Kanban";

export function DashboardComponent() {
  const { boardView, user, setUser } = useDashboardStore();
  const { fetchTasks, loading, error } = useTaskStore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setUser(
      localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null
    );
  }, [setUser]);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Fetch tasks when user is available
  useEffect(() => {
    if (user) {
      const loadTasks = async () => {
        try {
          await fetchTasks();
        } catch (error: any) {
          console.error("Failed to fetch tasks:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to load tasks",
            variant: "destructive",
          });
        }
      };

      loadTasks();
    }
  }, [user, fetchTasks, toast]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8">
          <Header />

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border p-8">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            </div>
          )}

          {/* Task Content */}
          <div className="mt-8">
            {boardView === "list" ? <Tasklist /> : <Kanban />}
          </div>
        </div>
      </div>
    </div>
  );
}
