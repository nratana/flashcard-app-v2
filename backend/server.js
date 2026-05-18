require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// routes
app.use("/api/users", userRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/history", historyRoutes);

// basic route to check server
app.get("/", (req, res) => {
  res.json({ message: "Flashcard API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
