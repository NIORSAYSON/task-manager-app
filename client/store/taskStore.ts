import { EmptyTask } from "@/lib/constants";
import { Task } from "@/types/types";
import { create } from "zustand";

export type State = {
  tasks: Task[];
  newTask: Task;
  taskToDelete: string;
  loading: boolean;
  error: string | null;
};

export type Actions = {
  setNewTask: (task: Task) => void;
  resetNewTask: () => void;
  setTaskToDelete: (_id: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // API actions
  fetchTasks: () => Promise<void>;
  createTask: (taskData: Omit<Task, "_id">) => Promise<void>;
  updateTaskApi: (taskId: string, taskData: Partial<Task>) => Promise<void>;
  deleteTaskApi: (taskId: string) => Promise<void>;
};

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token || ""}`,
  };
};

const handleApiError = (error: any) => {
  console.error("API Error:", error);
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return "Unable to connect to server. Please try again later.";
  }
  return error.message || "An unexpected error occurred.";
};

export const useTaskStore = create<State & Actions>((set, get) => ({
  tasks: [],
  newTask: EmptyTask,
  taskToDelete: "",
  loading: false,
  error: null,

  // Local state setters
  setTasks: (tasks: Task[]) => set({ tasks }),
  setNewTask: (task: Task) => set({ newTask: task }),
  resetNewTask: () => set({ newTask: EmptyTask }),
  setTaskToDelete: (_id: string) => set({ taskToDelete: _id }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  // Local state mutations
  addTask: (task: Task) => {
    set((state) => ({ tasks: [...state.tasks, { ...task }] }));
  },
  deleteTask: (_id: string) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task._id !== _id) })),
  updateTask: (task: Task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === task._id ? task : t)),
    }));
  },

  // API actions
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        set({ tasks: result.tasks || [], loading: false });
      } else {
        throw new Error(result.message || "Failed to fetch tasks");
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  createTask: async (taskData: Omit<Task, "_id">) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(taskData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        // Add the new task to the local state
        set((state) => ({
          tasks: [...state.tasks, result.task],
          loading: false,
          newTask: EmptyTask, // Reset the new task form
        }));
      } else {
        throw new Error(result.message || "Failed to create task");
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateTaskApi: async (taskId: string, taskData: Partial<Task>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(taskData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        // Update the task in local state
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === taskId ? result.task : t)),
          loading: false,
          newTask: EmptyTask, // Reset the new task form after successful update
        }));
      } else {
        throw new Error(result.message || "Failed to update task");
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteTaskApi: async (taskId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        // Remove the task from local state
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== taskId),
          loading: false,
          taskToDelete: "", // Reset the delete confirmation
        }));
      } else {
        throw new Error(result.message || "Failed to delete task");
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
