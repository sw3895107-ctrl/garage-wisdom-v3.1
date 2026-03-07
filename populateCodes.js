const mongoose = require('mongoose');
require('dotenv').config();

const CodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  fix: { type: String, required: true },
  story: { type: String }
});

const Code = mongoose.model('Code', CodeSchema);

// Paste the full 150+ codes array here
const codes = [
  { code: "P0171", description: "System Too Lean Bank 1", fix: "Clean MAF sensor or repair vacuum leak", story: "Customer replaced O2 sensors and spent $400. Real problem was a cracked intake hose behind throttle body causing vacuum leak." },
  { code: "P0174", description: "System Too Lean Bank 2", fix: "Check for vacuum leaks or faulty O2 sensors", story: "Bank 2 running lean due to leaking intake gasket; replacing gasket fixed CEL." },
  { code: "P0300", description: "Random/Multiple Cylinder Misfire Detected", fix: "Replace ignition coils or spark plugs; inspect fuel injectors", story: "Vehicle misfiring under load. Replaced spark plugs, but problem remained. Faulty ignition coil found." },
  // … continue for all 150+ codes
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("MongoDB connected, inserting codes...");
  for (const code of codes) {
    await Code.updateOne(
      { code: code.code },
      { $set: code },
      { upsert: true }
    );
  }
  console.log("All codes inserted successfully!");
  mongoose.disconnect();
}).catch(err => console.error(err));
