import express from "express";
import TaskController from "../controller/TaskController";
import authenticateToken from "../middleware/auth";

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// Task CRUD operations
router.get("/", TaskController.getAllTasks);
router.get("/stats", TaskController.getTaskStats);
router.get("/status/:status", TaskController.getTasksByStatus);
router.get("/:id", TaskController.getTaskById);
router.post("/", TaskController.createTask);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

export default router;
