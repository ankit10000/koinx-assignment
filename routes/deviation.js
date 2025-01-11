const express = require("express");
const Crypto = require("../models/crypto");

const router = express.Router();

router.get("/deviation", async (req, res) => {
    const { coin } = req.query;

    if (!coin) return res.status(400).json({ error: "Coin is required" });

    try {
        const prices = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100).select("price");
        if (prices.length < 2) return res.status(400).json({ error: "Not enough data for deviation calculation" });

        const priceValues = prices.map(record => record.price);
        const mean = priceValues.reduce((acc, val) => acc + val, 0) / priceValues.length;
        const deviation = Math.sqrt(priceValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / priceValues.length);

        res.json({ deviation: deviation.toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
