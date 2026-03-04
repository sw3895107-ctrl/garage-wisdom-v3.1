const router = require("express").Router();
const Fix = require("../models/Fix");

router.post("/", async (req, res) => {
  try {
    const newFix = new Fix(req.body);
    await newFix.save();
    res.json({ message: "Fix submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Submission failed" });
  }
});

router.patch("/:id/upvote", async (req, res) => {
  await Fix.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } });
  res.json({ message: "Upvoted" });
});

router.patch("/:id/downvote", async (req, res) => {
  await Fix.findByIdAndUpdate(req.params.id, { $inc: { downvotes: 1 } });
  res.json({ message: "Downvoted" });
});

module.exports = router;
