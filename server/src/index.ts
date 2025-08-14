import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./model/db";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import debugRoutes from "./routes/debug";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/debug", debugRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Task Manager API is running!",
    endpoints: {
      auth: "/auth",
      tasks: "/api/tasks",
      debug: "/debug",
    },
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   Auth: http://localhost:${PORT}/auth`);
  console.log(`   Tasks: http://localhost:${PORT}/api/tasks`);
  console.log(`   Debug: http://localhost:${PORT}/debug`);
});

export default app;
