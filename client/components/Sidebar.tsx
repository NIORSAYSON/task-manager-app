"use client";

import { useToast } from "@/hooks/use-toast";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useDashboardStore } from "@/store/dashboardStore";
import { LayoutGrid, List, LogOut, Moon, Sun } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTaskStore } from "@/store/taskStore";
import { Button } from "./ui/button";

const Sidebar = () => {
  const { setBoardView, boardView, setUser, user } = useDashboardStore();
  const { setTasks } = useTaskStore();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "default",
      className: "bg-red-400 text-black",
      duration: 2000,
    });
    setUser(null);
    setTasks([]);
  };

  return (
    <>
      {/* MOBILE MENU  */}
      <div className="lg:hidden">
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
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
            <h1 className="text-xl font-bold text-gray-900">
              Nior Task Manager
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900">
                <HamburgerMenuIcon className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white border border-gray-200 shadow-lg rounded-xl p-2">
              <div className="px-3 py-2 border-b border-gray-100 mb-2">
                <p className="text-sm font-semibold text-gray-900">Menu</p>
                <p className="text-xs text-gray-500">{user?.name}</p>
              </div>
              <DropdownMenuItem asChild>
                <Button
                  variant={boardView == "list" ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 rounded-lg ${
                    boardView == "list"
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setBoardView("list")}>
                  <List className="h-4 w-4" />
                  List View
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  variant={boardView == "kanban" ? "default" : "ghost"}
                  onClick={() => setBoardView("kanban")}
                  className={`w-full justify-start gap-2 rounded-lg ${
                    boardView == "kanban"
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  <LayoutGrid className="h-4 w-4" />
                  Kanban View
                </Button>
              </DropdownMenuItem>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* DESKTOP SIDEBAR  */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200 shadow-sm">
          <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
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
              <h1 className="text-xl font-bold text-gray-900">
                Nior Task Manager
              </h1>
            </div>

            {/* User Info */}
            <div className="px-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
              <Button
                variant={boardView == "list" ? "default" : "ghost"}
                className={`w-full justify-start gap-3 rounded-xl h-12 ${
                  boardView == "list"
                    ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setBoardView("list")}>
                <List className="h-5 w-5" />
                List View
              </Button>
              <Button
                variant={boardView == "kanban" ? "default" : "ghost"}
                className={`w-full justify-start gap-3 rounded-xl h-12 ${
                  boardView == "kanban"
                    ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setBoardView("kanban")}>
                <LayoutGrid className="h-5 w-5" />
                Board View
              </Button>
            </nav>
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0 px-4 pb-4">
            <div className="flex justify-center">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full max-w-xs justify-center gap-3 rounded-xl h-12 text-red-600 hover:bg-red-50 hover:text-red-700">
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
