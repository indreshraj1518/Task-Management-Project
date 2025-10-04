// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, default: "pending" },
  priority: { type: String, default: "low" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 👈 assigned user
});

export default mongoose.model("Task", taskSchema);
