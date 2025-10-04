import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET all users (admin only)
router.get("/", protect, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized" });

  const users = await User.find().select("-password");
  res.json(users);
});

// DELETE user (admin only)
router.delete("/:id", protect, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized" });

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

export default router;
