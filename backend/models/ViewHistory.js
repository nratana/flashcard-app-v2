const mongoose = require("mongoose");

const viewHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flashcardId: { type: mongoose.Schema.Types.ObjectId, ref: "Flashcard", required: true },
  question: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ViewHistory", viewHistorySchema);
