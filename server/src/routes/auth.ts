import express from "express";
import AuthController from "../controller/AuthController";
import authenticateToken from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected routes
router.get("/verify", authenticateToken, AuthController.verify);
router.get("/profile", authenticateToken, AuthController.getProfile);
router.put("/profile", authenticateToken, AuthController.updateProfile);
router.put(
  "/change-password",
  authenticateToken,
  AuthController.changePassword
);

export default router;
