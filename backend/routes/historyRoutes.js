const express = require("express");
const ViewHistory = require("../models/ViewHistory");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET own view history
router.get("/", auth, async (req, res) => {
  try {
    const history = await ViewHistory.find({ userId: req.user.id })
      .sort({ viewedAt: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// DELETE own history
router.delete("/", auth, async (req, res) => {
  try {
    await ViewHistory.deleteMany({ userId: req.user.id });
    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

// ADMIN - get all users' view history
router.get("/all", auth, adminOnly, async (req, res) => {
  try {
    const history = await ViewHistory.find()
      .populate("userId", "name email")
      .sort({ viewedAt: -1 })
      .limit(100);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all history" });
  }
});

// ADMIN - delete specific history entry
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await ViewHistory.findByIdAndDelete(req.params.id);
    res.json({ message: "History entry deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete history entry" });
  }
});

module.exports = router;
