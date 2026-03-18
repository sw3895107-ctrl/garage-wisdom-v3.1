const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 10000;

// ===== INIT OPENAI =====
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== MONGODB =====
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// ===== SCHEMA =====
const QuerySchema = new mongoose.Schema({
  message: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});
const Query = mongoose.model('Query', QuerySchema);

// ===== REAL AI ROUTE =====
app.post('/api/ai', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: 'No input provided' });
    }

    // 🔥 REAL AI CALL
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a blunt, experienced mechanic. Give practical, no-BS diagnostic advice. Focus on saving money and real fixes, not dealership upsells."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    // Save to DB
    const newQuery = new Query({ message, reply });
    await newQuery.save();

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'AI error' });
  }
});

// ===== HISTORY =====
app.get('/api/history', async (req, res) => {
  const history = await Query.find().sort({ createdAt: -1 }).limit(10);
  res.json(history);
});

// ===== FRONTEND =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
