const mongoose = require("mongoose");

const fixSchema = new mongoose.Schema({
  dtcCode: { type: String, required: true },
  vehicle: {
    year: Number,
    make: String,
    model: String,
    engine: String
  },
  mileage: Number,
  whatWorked: String,
  whatDidNotWork: String,
  cost: Number,
  difficulty: String,
  verified: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Fix", fixSchema);
