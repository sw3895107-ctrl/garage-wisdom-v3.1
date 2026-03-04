const mongoose = require("mongoose");

const dtcSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: String,
  plainExplanation: String,
  system: String,
  severity: String,
  commonCauses: [String]
}, { timestamps: true });

module.exports = mongoose.model("DTC", dtcSchema);
