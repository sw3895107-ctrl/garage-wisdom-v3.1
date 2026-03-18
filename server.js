const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 10000;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your v2 frontend
app.use(express.static(path.join(__dirname, 'public')));

// ===== MONGODB CONNECTION =====
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://GWAdmin:Scott23@cluster0.pfib1ha.mongodb.net/garage_wisdom?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// ===== SIMPLE DATA MODEL (optional) =====
const QuerySchema = new mongoose.Schema({
  message: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});

const Query = mongoose.model('Query', QuerySchema);

// ===== AI ROUTE =====
app.post('/api/ai', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: 'No input provided' });
    }

    let msg = message.toLowerCase();
    let reply = "Scan it first. Could be multiple causes.";

    // Basic mechanic-style AI logic
    if (msg.includes('p0300')) {
      reply = "Random misfire. Check spark plugs, ignition coils, vacuum leaks, and fuel injectors.";
    } 
    else if (msg.includes('p0171')) {
      reply = "System too lean. Likely vacuum leak, dirty MAF sensor, or weak fuel pump.";
    } 
    else if (msg.includes('catalytic') || msg.includes('p0420')) {
      reply = "Catalytic efficiency low. Check O2 sensors before replacing the cat.";
    } 
    else if (msg.includes('no start')) {
      reply = "Check fuel pump, spark, and crank sensor. Start with fuel pressure.";
    } 
    else if (msg.includes('overheat')) {
      reply = "Check coolant level, thermostat, radiator, and water pump.";
    } 
    else if (msg.includes('battery')) {
      reply = "Check voltage (12.6V off). Could be alternator, bad ground, or dead battery.";
    }

    // Save to MongoDB
    const newQuery = new Query({ message, reply });
    await newQuery.save();

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Server error' });
  }
});

// ===== OPTIONAL: GET HISTORY =====
app.get('/api/history', async (req, res) => {
  try {
    const history = await Query.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ===== ROOT ROUTE =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
