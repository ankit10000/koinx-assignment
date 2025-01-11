const cron = require("node-cron");
const axios = require("axios");
const Crypto = require("../models/Crypto");

const fetchCryptoData = async () => {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          ids: "bitcoin,ethereum,matic-network",
        },
      }
    );

    const cryptoData = data.map((coin) => ({
      coin: coin.id,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
    }));

    await Crypto.insertMany(cryptoData);
    console.log("Crypto data updated successfully!");
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
  }
};

cron.schedule("0 */2 * * *", fetchCryptoData);

module.exports = fetchCryptoData;
