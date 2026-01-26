import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import Notification from "../models/notification.js";

const router = express.Router();

// GET NOTIFICATIONS (PAGINATED + SAFE)
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;

    const notifications = await Notification.find({
      to: req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("from", "username profileImage")
      .populate("book", "title image")
      .populate("comment", "content");

    res.json(notifications);
  } catch (error) {
    console.log("Notification fetch error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// DELETE NOTIFICATION (OWNER ONLY)
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      to: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("Delete error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
