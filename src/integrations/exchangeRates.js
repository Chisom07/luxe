// // // src/integrations/exchangeRates.js
// // const axios = require("axios");

// // const getExchangeRate = async (from = "USD", to = "NGN") => {
// //   try {
// //     const response = await axios.get(
// //       `https://api.exchangerate-api.com/v4/latest/${from}`
// //     );
// //     return response.data.rates[to];
// //   } catch (error) {
// //     console.error("Exchange rate error:", error.message);
// //     return 1500; // fallback rate
// //   }
// // };

// // module.exports = { getExchangeRate };


// const axios = require("axios");

// const convertCurrency = async (amount, from = "USD", to = "USD") => {
//   if (from === to) return amount;

//   const res = await axios.get(
//     `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${from}`
//   );

//   const rate = res.data.conversion_rates[to];
//   return amount * rate;
// };

// module.exports = { convertCurrency };


const axios = require("axios");

exports.getRates = async () => {
    const res = await axios.get(process.env.EXCHANGE_API_KEY);
    return res.data.rates;
};