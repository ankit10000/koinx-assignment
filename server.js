const express = require("express");
const mongoose = require("mongoose");
const statsRoute = require("./routes/stats");
const deviationRoute = require("./routes/deviation");
const fetchCryptoData = require("./jobs/fetchCryptoData");

const app = express();
require("dotenv").config();

app.use(express.json());

app.use("/api", statsRoute);
app.use("/api", deviationRoute);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

fetchCryptoData();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
