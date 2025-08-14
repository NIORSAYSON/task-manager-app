import { Request, Response } from "express";
import TaskModel from "../model/Task";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

class TaskController {
  // Get all tasks for the authenticated user
  static async getAllTasks(req: AuthRequest, res: Response) {
    try {
      console.log("📋 Fetching tasks for user:", req.user?.email);

      const tasks = await TaskModel.find({ userId: req.user?.userId }).sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        count: tasks.length,
        tasks: tasks,
      });
    } catch (error: any) {
      console.error("💥 Get tasks error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Get a single task by ID
  static async getTaskById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const task = await TaskModel.findOne({
        _id: id,
        userId: req.user?.userId,
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      res.json({
        success: true,
        task: task,
      });
    } catch (error: any) {
      console.error("💥 Get task error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Create a new task
  static async createTask(req: AuthRequest, res: Response) {
    try {
      console.log("✨ Creating new task for user:", req.user?.email);

      const { title, description, status, priority, dueDate } = req.body;

      // Validation
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      const newTask = new TaskModel({
        title,
        description,
        status: status || "To Do",
        priority: priority || "Medium",
        dueDate,
        userId: req.user?.userId,
      });

      await newTask.save();
      console.log("✅ Task created successfully:", newTask._id);

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        task: newTask,
      });
    } catch (error: any) {
      console.error("💥 Create task error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Update an existing task
  static async updateTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, status, priority, dueDate } = req.body;

      console.log("📝 Updating task:", id, "for user:", req.user?.email);

      const task = await TaskModel.findOneAndUpdate(
        { _id: id, userId: req.user?.userId },
        { title, description, status, priority, dueDate },
        { new: true, runValidators: true }
      );

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      console.log("✅ Task updated successfully:", task._id);

      res.json({
        success: true,
        message: "Task updated successfully",
        task: task,
      });
    } catch (error: any) {
      console.error("💥 Update task error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Delete a task
  static async deleteTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      console.log("🗑️ Deleting task:", id, "for user:", req.user?.email);

      const task = await TaskModel.findOneAndDelete({
        _id: id,
        userId: req.user?.userId,
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      console.log("✅ Task deleted successfully:", task._id);

      res.json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error: any) {
      console.error("💥 Delete task error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Get tasks by status
  static async getTasksByStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.params;

      const tasks = await TaskModel.find({
        userId: req.user?.userId,
        status: status,
      }).sort({ createdAt: -1 });

      res.json({
        success: true,
        status: status,
        count: tasks.length,
        tasks: tasks,
      });
    } catch (error: any) {
      console.error("💥 Get tasks by status error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Get task statistics
  static async getTaskStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      const stats = await TaskModel.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const priorityStats = await TaskModel.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 },
          },
        },
      ]);

      const totalTasks = await TaskModel.countDocuments({ userId: userId });

      res.json({
        success: true,
        totalTasks: totalTasks,
        statusStats: stats,
        priorityStats: priorityStats,
      });
    } catch (error: any) {
      console.error("💥 Get task stats error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}

export default TaskController;
