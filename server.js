const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// AI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

// Root
app.get("/", (req, res) => res.send("Garage Wisdom API running"));

// Get one code
app.get("/api/codes/:code", async (req, res) => {
  try {
    const codeParam = req.params.code.toUpperCase().trim();
    const data = await Code.findOne({ code: codeParam });
    if (!data) return res.status(404).json({ error: "Code not found" });
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

// Add code
app.post("/api/codes", async (req, res) => {
  try {
    const newCode = new Code(req.body);
    await newCode.save();
    res.json(newCode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// AI diagnostic
app.get("/api/ai-diagnose/:code", async (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  try {
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an experienced automotive technician." },
        { role: "user", content: `Explain the OBD2 trouble code ${code}. Include causes, diagnostic steps, and common repairs.` }
      ]
    });
    res.json({ code, ai_diagnosis: ai.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI diagnostic failed" });
  }
});

/* -----------------------------
   Start Server
------------------------------*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
