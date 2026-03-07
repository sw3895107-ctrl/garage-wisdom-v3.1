//////////////////////////
// server.js - Garage Wisdom Backend
//////////////////////////

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Environment variables
require('dotenv').config(); // Use a .env file to store MONGO_URI

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://GWAdmin:Scott23@cluster0.pfib1ha.mongodb.net/garage_wisdom";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// MongoDB Schema & Model
const CodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  fix: { type: String, required: true },
  story: { type: String }
});

const Code = mongoose.model('Code', CodeSchema);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Garage Wisdom API is running');
});

// Get single code
app.get('/api/codes/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().trim();
    const data = await Code.findOne({ code });
    if(!data) return res.status(404).json({ error: "Code not found" });
    res.json(data);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Optional: get all codes
app.get('/api/codes', async (req, res) => {
  try {
    const data = await Code.find().sort({ code: 1 });
    res.json(data);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
