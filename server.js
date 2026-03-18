import express from "express";  // since Node 22+ ES module
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Sample data
const fixes = [
  { code: "P0300", text: "Random misfire - check spark plugs, coils" },
  { code: "P0171", text: "System too lean - vacuum leak or MAF sensor" }
];

// Search route
app.post("/api/search", (req, res) => {
  const { query } = req.body;
  const results = fixes.filter(f =>
    f.code.toLowerCase().includes(query.toLowerCase()) ||
    f.text.toLowerCase().includes(query.toLowerCase())
  );
  res.json(results);
});

// AI route
app.post("/api/ai", (req, res) => {
  const { message } = req.body;
  const reply = `AI: Based on "${message}", check spark, fuel, and air.`;
  res.json({ reply });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
