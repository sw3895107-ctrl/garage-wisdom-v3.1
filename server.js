const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static("public"));

/* -----------------------------
   MongoDB Connection
------------------------------*/
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

/* -----------------------------
   Schema & Model
------------------------------*/
const CodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  fix: { type: String, required: true },
  story: { type: String }
});

const Code = mongoose.model("Code", CodeSchema);

/* -----------------------------
   Routes
------------------------------*/

// Root route
app.get("/", (req, res) => {
  res.send("Garage Wisdom API running");
});

// Get one code
app.get("/api/codes/:code", async (req, res) => {
  try {
    const codeParam = req.params.code.toUpperCase().trim();
    const data = await Code.findOne({ code: codeParam });

    if (!data) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all codes
app.get("/api/codes", async (req, res) => {
  try {
    const data = await Code.find().sort({ code: 1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new code (optional but useful)
app.post("/api/codes", async (req, res) => {
  try {
    const newCode = new Code(req.body);
    await newCode.save();
    res.json(newCode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* -----------------------------
   Start Server
------------------------------*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
