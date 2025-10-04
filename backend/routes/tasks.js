// routes/tasks.js (ESM style)
import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /tasks → list tasks (admin: all, user: assigned)
router.get("/", protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo", "username email");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate(
        "assignedTo",
        "username email"
      );
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /tasks/:id → single task
router.get("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "username email"
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    // RBAC: normal user can only see assigned tasks
    if (
      req.user.role !== "admin" &&
      task.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /tasks → admin only
router.post("/", protect, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized" });

  const { title, description, dueDate, priority, assignedTo } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /tasks/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role !== "admin" &&
      task.assignedTo.toString() !== req.user._id.toString()
    )
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, dueDate, status, priority, assignedTo } =
      req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.dueDate = dueDate ?? task.dueDate;

    if (req.user.role === "admin") {
      task.status = status ?? task.status;
      task.priority = priority ?? task.priority;
      task.assignedTo = assignedTo ?? task.assignedTo;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /tasks/:id → admin only
router.delete("/:id", protect, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized" });

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
