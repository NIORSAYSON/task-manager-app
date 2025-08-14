"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useModalStore } from "@/store/modalStore";
import { Task } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTaskModal from "@/components/AddTaskModal";
import DeleteModal from "@/components/DeleteModal";
import { Toaster } from "@/components/ui/toaster";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Done":
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    case "In Progress":
      return <Clock className="h-6 w-6 text-blue-600" />;
    default:
      return <AlertCircle className="h-6 w-6 text-orange-600" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-800 border-green-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-orange-100 text-orange-800 border-orange-200";
  }
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tasks, updateTaskApi, setNewTask, setTaskToDelete } = useTaskStore();
  const { isAddModalOpen, setIsAddModalOpen, setIsDeleteModalOpen } =
    useModalStore();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const taskId = params.id as string;

  useEffect(() => {
    if (taskId && tasks.length > 0) {
      const foundTask = tasks.find((t) => t._id === taskId);
      if (foundTask) {
        setTask(foundTask);
      } else {
        toast({
          title: "Error",
          description: "Task not found",
          variant: "destructive",
        });
        router.push("/");
      }
      setLoading(false);
    }
  }, [taskId, tasks, router, toast]);

  const handleEditTask = () => {
    if (task) {
      setNewTask(task);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteTask = () => {
    if (task) {
      setTaskToDelete(task._id);
      setIsDeleteModalOpen(true);
    }
  };

  const handleToggleStatus = async () => {
    if (!task) return;

    let newStatus: Task["status"];
    switch (task.status) {
      case "To Do":
        newStatus = "In Progress";
        break;
      case "In Progress":
        newStatus = "Done";
        break;
      case "Done":
        newStatus = "To Do";
        break;
      default:
        newStatus = "To Do";
    }

    try {
      await updateTaskApi(task._id, { status: newStatus });
      setTask({ ...task, status: newStatus });
      toast({
        title: "Success",
        description: `Task status updated to ${newStatus}!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate: Date | undefined) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task?.status !== "Done";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Task not found
          </h1>
          <Button
            onClick={() => router.push("/")}
            className="bg-gray-900 hover:bg-gray-800">
            Go back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleEditTask}
                className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteTask}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Task Detail Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Task Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {getStatusIcon(task.status)}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {task.title}
                    </h1>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                          task.priority
                        )}`}>
                        {task.priority} Priority
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          task.status
                        )}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleToggleStatus}
                  className="bg-gray-900 hover:bg-gray-800 text-white">
                  {task.status === "To Do"
                    ? "Start Task"
                    : task.status === "In Progress"
                    ? "Complete Task"
                    : "Reopen Task"}
                </Button>
              </div>
            </div>

            {/* Task Content */}
            <div className="px-8 py-6">
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                {task.description ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {task.description}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-500 italic">
                      No description provided
                    </p>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Due Date
                </h2>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span
                    className={`text-lg ${
                      isOverdue(task.dueDate)
                        ? "text-red-600 font-semibold"
                        : "text-gray-700"
                    }`}>
                    {formatDate(task.dueDate)}
                  </span>
                  {isOverdue(task.dueDate) && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      Overdue
                    </span>
                  )}
                </div>
              </div>

              {/* Task Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleToggleStatus}
                    className="bg-blue-600 hover:bg-blue-700 text-white">
                    {task.status === "To Do"
                      ? "Start Working"
                      : task.status === "In Progress"
                      ? "Mark Complete"
                      : "Reopen Task"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleEditTask}
                    className="border-gray-300">
                    Edit Task Details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeleteTask}
                    className="border-red-200 text-red-600 hover:text-red-700 hover:border-red-300">
                    Delete Task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <DeleteModal />
      <Toaster />
    </>
  );
}
