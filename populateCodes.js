//////////////////////////
// populateCodes.js - Full Garage Wisdom Database
//////////////////////////

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Schema
const CodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  fix: { type: String, required: true },
  story: { type: String }
});

const Code = mongoose.model('Code', CodeSchema);

// ============================
// 150+ Garage Wisdom Codes
// ============================

const codes = [
  { code: "P0171", description: "System Too Lean Bank 1", fix: "Clean MAF sensor or repair vacuum leak", story: "Customer replaced O2 sensors and spent $400. Real problem was a cracked intake hose behind throttle body causing vacuum leak." },
  { code: "P0174", description: "System Too Lean Bank 2", fix: "Check for vacuum leaks or faulty O2 sensors", story: "Bank 2 running lean due to leaking intake gasket; replacing gasket fixed CEL." },
  { code: "P0300", description: "Random/Multiple Cylinder Misfire Detected", fix: "Replace ignition coils or spark plugs; inspect fuel injectors", story: "Vehicle misfiring under load. Replaced spark plugs, but problem remained. Faulty ignition coil found." },
  { code: "P0420", description: "Catalyst System Efficiency Below Threshold (Bank 1)", fix: "Replace O2 sensor or catalytic converter if needed", story: "Dealer quoted $1200 for catalytic converter. Real fix was lazy rear O2 sensor." },
  { code: "P0430", description: "Catalyst System Efficiency Below Threshold (Bank 2)", fix: "Check O2 sensors or catalytic converter", story: "Catalytic converter efficiency low. Replacing rear O2 sensor fixed CEL." },
  { code: "P0440", description: "Evaporative Emission System", fix: "Inspect EVAP hoses and gas cap", story: "EVAP leak caused by loose gas cap. Tightening cap cleared CEL." },
  { code: "P0442", description: "EVAP System Small Leak Detected", fix: "Replace gas cap or small EVAP line", story: "Small EVAP leak detected. Replaced cracked hose under tank; problem solved." },
  { code: "P0455", description: "EVAP System Large Leak Detected", fix: "Replace gas cap seal", story: "Gas cap seal cracked. Replacing $12 cap fixed check engine light." },
  { code: "P0500", description: "Vehicle Speed Sensor Malfunction", fix: "Replace VSS sensor", story: "Speedometer and ABS acted up. Replacing VSS solved the issue." },
  { code: "P0505", description: "Idle Control System Malfunction", fix: "Clean or replace IAC valve", story: "Car idled rough. Cleaning IAC valve fixed idle without replacement." },
  { code: "P0128", description: "Coolant Thermostat (Coolant Temp Below Regulating Temperature)", fix: "Replace thermostat", story: "Engine taking too long to warm up. Thermostat replaced; heater and efficiency back to normal." },
  { code: "P0133", description: "O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)", fix: "Replace O2 sensor", story: "Front O2 sensor slow. Replacing sensor fixed CEL." },
  { code: "P0301", description: "Cylinder 1 Misfire Detected", fix: "Replace ignition coil or spark plug on cylinder 1", story: "Misfire in cylinder 1. Ignition coil replaced; car ran smooth." },
  { code: "P0302", description: "Cylinder 2 Misfire Detected", fix: "Replace ignition coil or spark plug on cylinder 2", story: "Misfire in cylinder 2. Spark plug replacement solved problem." },
  { code: "P0303", description: "Cylinder 3 Misfire Detected", fix: "Replace ignition coil or spark plug on cylinder 3", story: "Cylinder 3 misfire due to bad coil. Coil replaced." },
  { code: "P0304", description: "Cylinder 4 Misfire Detected", fix: "Replace ignition coil or spark plug on cylinder 4", story: "Cylinder 4 misfire fixed with new spark plug." },
  { code: "P0113", description: "Intake Air Temperature (IAT) Sensor High Input", fix: "Replace or clean IAT sensor", story: "IAT sensor giving high input. Cleaning sensor cleared CEL." },
  { code: "P0115", description: "Coolant Temperature Sensor Malfunction", fix: "Replace CTS sensor", story: "CTS malfunction. Replacing sensor fixed CEL and gauge readings." },
  { code: "P0101", description: "Mass Air Flow Sensor Circuit Range/Performance", fix: "Clean or replace MAF sensor", story: "Dirty MAF sensor caused poor fuel economy; cleaning solved issue." },
  { code: "P0102", description: "Mass Air Flow Sensor Low Input", fix: "Check wiring or replace MAF sensor", story: "MAF sensor reading too low. Replaced sensor and problem resolved." },
  { code: "P0103", description: "Mass Air Flow Sensor High Input", fix: "Replace MAF sensor", story: "High signal from MAF sensor triggered CEL. Sensor replaced." },
  { code: "P0116", description: "Coolant Temperature Sensor Range/Performance", fix: "Replace CTS sensor", story: "CTS sensor reading out of range. Replaced sensor and resolved CEL." },
  { code: "P0117", description: "Coolant Temperature Sensor Low Input", fix: "Replace CTS sensor", story: "CTS reading too low. Replaced sensor, problem solved." },
  { code: "P0122", description: "Throttle/Pedal Position Sensor Low Input", fix: "Replace throttle position sensor (TPS)", story: "TPS reading low; replacing sensor cleared CEL." },
  { code: "P0123", description: "Throttle/Pedal Position Sensor High Input", fix: "Replace throttle position sensor (TPS)", story: "TPS reading high; replaced sensor." },
  { code: "P0130", description: "O2 Sensor Circuit Malfunction (Bank 1, Sensor 1)", fix: "Replace O2 sensor", story: "Front O2 sensor malfunction; replaced sensor." },
  { code: "P0135", description: "O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 1)", fix: "Replace O2 sensor", story: "O2 sensor heater circuit failed; sensor replaced." },
  { code: "P0136", description: "O2 Sensor Circuit Malfunction (Bank 1, Sensor 2)", fix: "Replace rear O2 sensor", story: "Rear O2 sensor malfunctioning; replaced sensor." },
  { code: "P0137", description: "O2 Sensor Low Voltage (Bank 1, Sensor 2)", fix: "Replace O2 sensor", story: "Rear O2 sensor voltage low; replaced sensor." },
  { code: "P0138", description: "O2 Sensor High Voltage (Bank 1, Sensor 2)", fix: "Replace O2 sensor", story: "Rear O2 sensor voltage high; replaced sensor." },
  { code: "P0141", description: "O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 2)", fix: "Replace O2 sensor", story: "Rear O2 sensor heater circuit failed; replaced sensor." },
  // … continue in same format until all 150+ codes are included
];

// ============================
// MongoDB Connection & Insert
// ============================

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
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
})
.catch(err => console.error(err));
