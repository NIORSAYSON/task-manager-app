import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserModel from "../model/User";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

class AuthController {
  // Register a new user
  static async register(req: Request, res: Response) {
    try {
      console.log("📝 Registration attempt:", req.body.email);

      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        console.log("❌ User already exists:", email);
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      console.log("✅ User created successfully:", email);

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "7d" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        jwtToken: token,
        email: newUser.email,
        name: newUser.name,
      });
    } catch (error: any) {
      console.error("💥 Registration error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
    try {
      console.log("🔐 Login attempt:", req.body.email);

      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        console.log("❌ User not found:", email);
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("❌ Invalid password for:", email);
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "7d" }
      );

      console.log("✅ Login successful:", email);

      res.json({
        success: true,
        message: "Login successful",
        jwtToken: token,
        email: user.email,
        name: user.name,
      });
    } catch (error: any) {
      console.error("💥 Login error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Verify JWT token
  static async verify(req: AuthRequest, res: Response) {
    try {
      console.log("🔍 Token verification for user:", req.user?.email);

      const user = await UserModel.findById(req.user?.userId).select(
        "-password"
      );
      if (!user) {
        console.log("❌ User not found during verification:", req.user?.userId);
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      console.log("✅ Token verified successfully for:", user.email);

      res.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      });
    } catch (error: any) {
      console.error("💥 Token verification error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Get user profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.findById(req.user?.userId).select(
        "-password"
      );
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      console.error("💥 Get profile error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Update user profile
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name } = req.body;

      const user = await UserModel.findByIdAndUpdate(
        req.user?.userId,
        { name },
        { new: true, select: "-password" }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      console.error("💥 Update profile error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  // Change password
  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      const user = await UserModel.findById(req.user?.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await UserModel.findByIdAndUpdate(req.user?.userId, {
        password: hashedNewPassword,
      });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: any) {
      console.error("💥 Change password error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}

export default AuthController;
