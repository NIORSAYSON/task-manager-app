import express from "express";
import DebugController from "../controller/DebugController";

const router = express.Router();

// Debug routes (use only in development)
router.get("/test", DebugController.testEndpoint);
router.get("/status", DebugController.getDatabaseStatus);
router.get("/users", DebugController.getAllUsers);
router.get("/tasks", DebugController.getAllTasks);
router.get("/system", DebugController.getSystemInfo);
router.delete("/clear-all", DebugController.clearAllData);

export default router;
