const cron = require("node-cron");
const axios = require("axios");
const Crypto = require("../models/crypto");

cron.schedule("0 */2 * * *", async () => {
    console.log("Fetching data from CoinGecko API...");

    try {
        const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
            params: {
                ids: "bitcoin,matic-network,ethereum",
                vs_currencies: "usd",
                include_market_cap: "true",
                include_24hr_change: "true",
            },
            headers: {
                "x-cg-api-key": process.env.COINGECKO_API_KEY, 
            },
        });

        const coins = [
            { coin: "bitcoin", data: data.bitcoin },
            { coin: "matic-network", data: data["matic-network"] },
            { coin: "ethereum", data: data.ethereum },
        ];

        for (const coin of coins) {
            await Crypto.findOneAndUpdate(
                { coin: coin.coin }, 
                {
                    $set: {
                        price: coin.data.usd,
                        marketCap: coin.data.usd_market_cap,
                        change24h: coin.data.usd_24h_change,
                        timestamp: new Date(),
                    },
                },
                { upsert: true }
            );
        }

        console.log("Data fetched and stored successfully!");
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
});