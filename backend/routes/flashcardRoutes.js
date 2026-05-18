const express = require("express");
const Flashcard = require("../models/Flashcard");
const ViewHistory = require("../models/ViewHistory");
const { auth } = require("../middleware/auth");

const router = express.Router();

// GET all flashcards for logged in user
router.get("/", auth, async (req, res) => {
  try {
    const cards = await Flashcard.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});

// CREATE a new flashcard
router.post("/", auth, async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }
    const card = new Flashcard({ question, answer, userId: req.user.id });
    const saved = await card.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create flashcard" });
  }
});

// UPDATE a flashcard
router.put("/:id", auth, async (req, res) => {
  try {
    const card = await Flashcard.findOne({ _id: req.params.id, userId: req.user.id });
    if (!card) return res.status(404).json({ error: "Flashcard not found" });
    Object.assign(card, req.body);
    const updated = await card.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update flashcard" });
  }
});

// DELETE a flashcard
router.delete("/:id", auth, async (req, res) => {
  try {
    const card = await Flashcard.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!card) return res.status(404).json({ error: "Flashcard not found" });
    res.json({ message: "Flashcard deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete flashcard" });
  }
});

// RECORD view history when user flips a card
router.post("/:id/view", auth, async (req, res) => {
  try {
    const card = await Flashcard.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Flashcard not found" });
    const history = new ViewHistory({
      userId: req.user.id,
      flashcardId: card._id,
      question: card.question,
    });
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to record view" });
  }
});

module.exports = router;
