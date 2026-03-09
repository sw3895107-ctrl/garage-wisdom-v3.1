const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Schema & Model
const CodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  fix: { type: String, required: true },
  story: { type: String }
});

const Code = mongoose.model('Code', CodeSchema);

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Routes
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

app.get('/api/codes/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().trim();
    const data = await Code.findOne({ code });
    if (!data) return res.status(404).json({ error: "Code not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// AI-powered diagnostic endpoint
app.post('/api/ai-diagnose', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Code required" });

    const data = await Code.findOne({ code: code.toUpperCase().trim() });
    if (!data) return res.status(404).json({ error: "Code not found" });

    const prompt = `Explain this automotive code in simple terms and give a step-by-step fix: ${data.code} - ${data.description}`;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 300
    });

    res.json({ code: data.code, ai_response: completion.data.choices[0].text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI diagnostic failed" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
