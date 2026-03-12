const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 10000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Example Schema
const QuestionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model("Question", QuestionSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Garage Wisdom API Running");
});

app.get("/questions", async (req, res) => {
  const data = await Question.find();
  res.json(data);
});

app.post("/questions", async (req, res) => {
  const newQuestion = new Question({
    question: req.body.question,
    answer: req.body.answer
  });

  const saved = await newQuestion.save();
  res.json(saved);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
