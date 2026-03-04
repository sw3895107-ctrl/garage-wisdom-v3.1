const router = require("express").Router();
const DTC = require("../models/DTC");
const Fix = require("../models/Fix");

router.get("/:code", async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const dtc = await DTC.findOne({ code });

    if (!dtc) {
      return res.status(404).json({ message: "Code not found" });
    }

    const fixes = await Fix.find({ dtcCode: code })
      .sort({ upvotes: -1 });

    res.json({ dtc, fixes });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
