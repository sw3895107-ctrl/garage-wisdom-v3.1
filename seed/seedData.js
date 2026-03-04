require("dotenv").config();
const mongoose = require("mongoose");
const DTC = require("../models/DTC");

mongoose.connect(process.env.MONGO_URI);

const seedCodes = [
  {
    code: "P0301",
    title: "Cylinder 1 Misfire Detected",
    plainExplanation: "Engine computer detected repeated misfires on cylinder 1.",
    system: "Powertrain",
    severity: "Medium",
    commonCauses: [
      "Bad spark plug",
      "Faulty ignition coil",
      "Fuel injector issue",
      "Low compression"
    ]
  },
  {
    code: "P0171",
    title: "System Too Lean (Bank 1)",
    plainExplanation: "Engine is running too lean — too much air, not enough fuel.",
    system: "Powertrain",
    severity: "Medium",
    commonCauses: [
      "Vacuum leak",
      "Dirty MAF sensor",
      "Weak fuel pump",
      "Clogged fuel filter"
    ]
  },
  {
    code: "P0420",
    title: "Catalyst System Efficiency Below Threshold",
    plainExplanation: "Catalytic converter is not operating efficiently.",
    system: "Powertrain",
    severity: "Low to Medium",
    commonCauses: [
      "Failing catalytic converter",
      "O2 sensor issue",
      "Exhaust leak"
    ]
  }
];

async function seed() {
  await DTC.deleteMany({});
  await DTC.insertMany(seedCodes);
  console.log("Seed complete");
  process.exit();
}

seed();
