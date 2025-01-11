const express = require("express");
const Crypto = require("../models/Crypto");
const calculateStandardDeviation = require("../utils/standardDeviation");

const router = express.Router();

router.get("/deviation", async (req, res) => {
  const { coin } = req.query;

  if (!coin) return res.status(400).json({ error: "Coin is required" });

  try {
    const records = await Crypto.find({ coin })
      .sort({ timestamp: -1 })
      .limit(100);

    if (records.length < 2)
      return res
        .status(400)
        .json({ error: "Not enough data" });

    const prices = records.map((record) => record.price);
    const deviation = calculateStandardDeviation(prices);

    res.json({ deviation });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
