"use client";

import { LogOut, User } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import { useTaskStore } from "@/store/taskStore";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Header = () => {
  const { boardView, user, setUser } = useDashboardStore();
  const { tasks } = useTaskStore();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "To Do").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    done: tasks.filter((task) => task.status === "Done").length,
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mb-4">
            {boardView === "list"
              ? "Managing your tasks in list view"
              : "Managing your tasks in kanban board view"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
