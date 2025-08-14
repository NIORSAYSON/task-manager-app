import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Trash2,
  Edit3,
} from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { useModalStore } from "@/store/modalStore";
import { Task } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

const columns = [
  {
    id: "todo",
    title: "To Do",
    status: "To Do" as Task["status"],
    icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "inprogress",
    title: "In Progress",
    status: "In Progress" as Task["status"],
    icon: <Clock className="h-5 w-5 text-blue-600" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "done",
    title: "Done",
    status: "Done" as Task["status"],
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
];

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

function Kanban() {
  const { tasks, updateTaskApi, setNewTask, resetNewTask, setTaskToDelete } =
    useTaskStore();
  const { setIsAddModalOpen, setIsDeleteModalOpen } = useModalStore();
  const { toast } = useToast();
  const router = useRouter();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      await updateTaskApi(draggedTask._id, { status: newStatus });
      toast({
        title: "Success",
        description: `Task moved to ${newStatus}!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setDraggedTask(null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString();
  };

  const openAddModal = (status: Task["status"]) => {
    resetNewTask();
    setNewTask({
      _id: "",
      title: "",
      description: "",
      status: status,
      priority: "Medium",
      dueDate: undefined,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setNewTask(task);
    setIsAddModalOpen(true);
  };

  const handleTaskClick = (taskId: string, e: React.MouseEvent) => {
    // Prevent navigation when clicking on action buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/task/${taskId}`);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.status
        );

        return (
          <div key={column.id} className="flex flex-col h-full">
            {/* Column Header */}
            <div
              className={`${column.bgColor} ${column.borderColor} border rounded-2xl p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {column.icon}
                  <h3 className="font-semibold text-gray-900">
                    {column.title}
                  </h3>
                </div>
                <span className="bg-white px-2 py-1 rounded-lg text-sm font-medium text-gray-600">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className="flex-1 min-h-[200px] space-y-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}>
              {/* Tasks */}
              {columnTasks.map((task) => (
                <div
                  key={task._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onClick={(e) => handleTaskClick(task._id, e)}
                  title="Click to view task details"
                  className={`bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 cursor-pointer ${
                    draggedTask?._id === task._id ? "opacity-50" : ""
                  }`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2 ml-2">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(
                          task.priority
                        )}`}>
                        {task.priority}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(task);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task._id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Task Button */}
              <button
                onClick={() => openAddModal(column.status)}
                className="w-full bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-4 text-gray-500 hover:text-gray-700 transition-all duration-200 group">
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Add Task</span>
                </div>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Kanban;
