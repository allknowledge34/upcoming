import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import Notification from "../models/notification.js";

const router = express.Router();

// GET ALL NOTIFICATIONS
router.get("/", protectRoute, async (req, res) => {
  try {
    const notifications = await Notification.find({ to: req.user._id })
      .sort({ createdAt: -1 })
      .populate("from", "username profileImage")
      .populate("book", "title image")
      .populate("comment", "content");

    res.json(notifications);
  } catch (error) {
    console.log("Notification fetch error", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE NOTIFICATION
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
