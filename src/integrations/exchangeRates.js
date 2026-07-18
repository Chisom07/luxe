const axios = require("axios");

const FALLBACK_NGN_RATE = 1500;

exports.getRates = async () => {
  const apiKey = process.env.EXCHANGE_API_KEY || process.env.EXCHANGE_RATE_API_KEY;

  try {
    if (apiKey) {
      const res = await axios.get(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
        { timeout: 10000 }
      );

      if (res.data?.conversion_rates?.NGN) {
        return res.data.conversion_rates;
      }
    }

    const fallback = await axios.get("https://api.exchangerate-api.com/v4/latest/USD", {
      timeout: 10000,
    });

    if (fallback.data?.rates?.NGN) {
      return fallback.data.rates;
    }
  } catch (error) {
    console.warn("Exchange rate lookup failed:", error.message);
  }

  return { NGN: FALLBACK_NGN_RATE };
};
