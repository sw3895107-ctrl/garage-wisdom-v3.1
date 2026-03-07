require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const DTC = require("./models/DTC");

const dtcRoutes = require("./routes/dtcRoutes");
const fixRoutes = require("./routes/fixRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("MongoDB Connected");

  // AUTO SEED DATABASE IF EMPTY
  const count = await DTC.countDocuments();

  if (count === 0) {
    console.log("Seeding database...");

    await DTC.insertMany([
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
        plainExplanation: "Engine running too lean (too much air, not enough fuel).",
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
        plainExplanation: "Catalytic converter not operating efficiently.",
        system: "Powertrain",
        severity: "Low to Medium",
        commonCauses: [
          "Failing catalytic converter",
          "Bad O2 sensor",
          "Exhaust leak"
        ]
      }
    ]);

    console.log("Database seeded");
  }

})
.catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Garage Wisdom API Running");
});

app.use("/api/dtc", dtcRoutes);
app.use("/api/fix", fixRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
