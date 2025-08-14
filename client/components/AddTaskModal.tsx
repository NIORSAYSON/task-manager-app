"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { EmptyTask } from "@/lib/constants";
import { useTaskStore } from "@/store/taskStore";
import { TaskPriority, TaskStatus } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
}

const AddTaskModal = ({
  isOpen,
  onClose,
  defaultStatus,
}: AddTaskModalProps) => {
  const { newTask, setNewTask, createTask, updateTaskApi, resetNewTask } =
    useTaskStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    resetNewTask();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (newTask._id) {
        // Update existing task
        await updateTaskApi(newTask._id, {
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          priority: newTask.priority,
          dueDate: newTask.dueDate,
        });
        toast({
          title: "Success",
          description: "Task updated successfully!",
        });
      } else {
        // Create new task
        const taskData = {
          title: newTask.title,
          description: newTask.description,
          status: defaultStatus || newTask.status,
          priority: newTask.priority,
          dueDate: newTask.dueDate,
        };

        await createTask(taskData);
        toast({
          title: "Success",
          description: "Task created successfully!",
        });
      }
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200"
      onClick={handleClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {newTask._id ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-200">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-gray-900">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-900">
              Description
            </Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 placeholder:text-gray-400"
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-semibold text-gray-900">
                Status
              </Label>
              <Select
                value={defaultStatus || newTask.status}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, status: value as TaskStatus })
                }
                disabled={!!defaultStatus}>
                <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900">
                  <SelectValue
                    placeholder="Select status"
                    className="text-gray-900"
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 bg-white shadow-lg">
                  <SelectItem
                    value="To Do"
                    className="rounded-lg text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      To Do
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="In Progress"
                    className="rounded-lg text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="Done" className="rounded-lg text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Done
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="text-sm font-semibold text-gray-900">
                Priority
              </Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value as TaskPriority })
                }>
                <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900">
                  <SelectValue
                    placeholder="Select priority"
                    className="text-gray-900"
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 bg-white shadow-lg">
                  <SelectItem value="Low" className="rounded-lg text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="Medium"
                    className="rounded-lg text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="High" className="rounded-lg text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 w-1/2">
            <Label
              htmlFor="dueDate"
              className="text-sm font-semibold text-gray-900">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={
                newTask.dueDate ? format(newTask.dueDate, "yyyy-MM-dd") : ""
              }
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  dueDate: e.target.value
                    ? new Date(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 px-6 py-3 border-gray-200 text-gray-50 hover:bg-gray-900 rounded-xl transition-all duration-200">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : newTask._id ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
