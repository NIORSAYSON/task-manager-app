import { Request, Response } from "express";
import mongoose from "mongoose";
import UserModel from "../model/User";
import TaskModel from "../model/Task";

class DebugController {
  // Check database connection status
  static async getDatabaseStatus(req: Request, res: Response) {
    try {
      const dbState = mongoose.connection.readyState;
      const states = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
      };

      const collections = mongoose.connection.db
        ? await mongoose.connection.db.listCollections().toArray()
        : [];

      res.json({
        success: true,
        database: {
          state: states[dbState as keyof typeof states],
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name,
          collections: collections,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Database status check failed",
        error: error.message,
      });
    }
  }

  // Get all users (without passwords)
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.find({}, { password: 0 }).sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        count: users.length,
        users: users,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      });
    }
  }

  // Get all tasks
  static async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await TaskModel.find({})
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: tasks.length,
        tasks: tasks,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch tasks",
        error: error.message,
      });
    }
  }

  // Clear all data (use with extreme caution!)
  static async clearAllData(req: Request, res: Response) {
    try {
      const userCount = await UserModel.countDocuments();
      const taskCount = await TaskModel.countDocuments();

      await UserModel.deleteMany({});
      await TaskModel.deleteMany({});

      res.json({
        success: true,
        message: "All data cleared successfully",
        deletedCounts: {
          users: userCount,
          tasks: taskCount,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to clear data",
        error: error.message,
      });
    }
  }

  // Get system info
  static async getSystemInfo(req: Request, res: Response) {
    try {
      const userCount = await UserModel.countDocuments();
      const taskCount = await TaskModel.countDocuments();

      const tasksByStatus = await TaskModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const tasksByPriority = await TaskModel.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]);

      res.json({
        success: true,
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          memory: process.memoryUsage(),
          uptime: process.uptime(),
        },
        database: {
          totalUsers: userCount,
          totalTasks: taskCount,
          tasksByStatus,
          tasksByPriority,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          port: process.env.PORT,
          jwtSecret: process.env.JWT_SECRET ? "Set" : "Not Set",
          mongoUri: process.env.MONGODB_URI ? "Set" : "Not Set",
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to get system info",
        error: error.message,
      });
    }
  }

  // Test endpoint
  static async testEndpoint(req: Request, res: Response) {
    res.json({
      success: true,
      message: "Debug endpoint is working!",
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      headers: {
        userAgent: req.get("User-Agent"),
        contentType: req.get("Content-Type"),
        authorization: req.get("Authorization") ? "Present" : "Not Present",
      },
    });
  }
}

export default DebugController;
