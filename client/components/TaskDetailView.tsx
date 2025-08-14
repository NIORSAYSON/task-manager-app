import React from "react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import { useModalStore } from "@/store/modalStore";
import { Task } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskDetailViewProps {
  task: Task;
  showActions?: boolean;
  showNavigateButton?: boolean;
}

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

function TaskDetailView({
  task,
  showActions = true,
  showNavigateButton = false,
}: TaskDetailViewProps) {
  const router = useRouter();
  const { updateTaskApi, setNewTask, setTaskToDelete } = useTaskStore();
  const { setIsAddModalOpen, setIsDeleteModalOpen } = useModalStore();
  const { toast } = useToast();

  const handleEditTask = () => {
    setNewTask(task);
    setIsAddModalOpen(true);
  };

  const handleDeleteTask = () => {
    setTaskToDelete(task._id);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async () => {
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

  const handleNavigateToTask = () => {
    router.push(`/task/${task._id}`);
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
    return new Date(dueDate) < new Date() && task.status !== "Done";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Task Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(task.status)}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {task.title}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                    task.priority
                  )}`}>
                  {task.priority}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    task.status
                  )}`}>
                  {task.status}
                </span>
              </div>
            </div>
          </div>
          {showNavigateButton && (
            <Button
              variant="outline"
              onClick={handleNavigateToTask}
              className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              View Details
            </Button>
          )}
        </div>
      </div>

      {/* Task Content */}
      <div className="px-6 py-4">
        {/* Description */}
        {task.description && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          </div>
        )}

        {/* Due Date */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Due Date</h3>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span
              className={`text-sm ${
                isOverdue(task.dueDate)
                  ? "text-red-600 font-semibold"
                  : "text-gray-600"
              }`}>
              {formatDate(task.dueDate)}
            </span>
            {isOverdue(task.dueDate) && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            <Button
              size="sm"
              onClick={handleToggleStatus}
              className="bg-blue-600 hover:bg-blue-700 text-white">
              {task.status === "To Do"
                ? "Start"
                : task.status === "In Progress"
                ? "Complete"
                : "Reopen"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleEditTask}
              className="border-gray-300">
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteTask}
              className="border-red-200 text-red-600 hover:text-red-700 hover:border-red-300">
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetailView;
