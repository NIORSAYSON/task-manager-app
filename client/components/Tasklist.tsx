import React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { useModalStore } from "@/store/modalStore";
import { Task } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { EmptyTask } from "@/lib/constants";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Done":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "In Progress":
      return <Clock className="h-5 w-5 text-blue-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
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

function Tasklist() {
  const { tasks, updateTaskApi, setNewTask, resetNewTask, setTaskToDelete } =
    useTaskStore();
  const { setIsAddModalOpen, setIsDeleteModalOpen } = useModalStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === "Done" ? "To Do" : "Done";
    try {
      await updateTaskApi(task._id, { status: newStatus });
      toast({
        title: "Success",
        description: `Task marked as ${newStatus.toLowerCase()}!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setNewTask(task);
    setIsAddModalOpen(true);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString();
  };

  const handleTaskClick = (taskId: string, e: React.MouseEvent) => {
    // Prevent navigation when clicking on action buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/task/${taskId}`);
  };

  return (
    <div className="space-y-4">
      {/* Add Task Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          Tasks ({tasks.length})
        </h2>
        <Button
          onClick={() => {
            resetNewTask();
            setIsAddModalOpen(true);
          }}
          className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Task List */}
      {tasks.map((task) => (
        <div
          key={task._id}
          onClick={(e) => handleTaskClick(task._id, e)}
          title="Click to view task details"
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleComplete(task);
                }}
                className="flex-shrink-0">
                {getStatusIcon(task.status)}
              </button>
              <h3
                className={`text-lg font-semibold ${
                  task.status === "Done"
                    ? "text-gray-500 line-through"
                    : "text-gray-900"
                }`}>
                {task.title}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                  task.priority
                )}`}>
                {task.priority}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  task.status
                )}`}>
                {task.status}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTask(task);
                }}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task._id);
                }}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p
              className={`mb-4 ${
                task.status === "Done" ? "text-gray-400" : "text-gray-600"
              }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Due {formatDate(task.dueDate)}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tasks yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first task!
          </p>
          <Button
            onClick={() => {
              resetNewTask();
              setIsAddModalOpen(true);
            }}
            className="bg-gray-900 hover:bg-gray-800 text-white">
            Create Task
          </Button>
        </div>
      )}
    </div>
  );
}

export default Tasklist;
