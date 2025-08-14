import mongoose, { Document, Schema } from "mongoose";

interface ITask extends Document {
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate?: Date;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      required: true,
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
      default: "Medium",
    },
    dueDate: {
      type: Date,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const TaskModel =
  mongoose.models?.Task || mongoose.model<ITask>("Task", TaskSchema);

export default TaskModel;
