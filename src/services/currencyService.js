// const { convertCurrency } = require("../integrations/exchangeRatesAPI");

// const convert = async (amount, from, to) => {
//   return convertCurrency(amount, from, to);
// };

// module.exports = { convert };


const axios = require("axios");
const cache = require("../cache/cacheService");
const { getRates } = require("../integrations/exchangeRates");

let cachedRates = null;
let lastFetch = 0;

exports.convertToNGN = async (usd) => {
    const now = Date.now();

    if (!cachedRates || now - lastFetch > 10 * 60 * 1000) {
        cachedRates = await getRates();
        lastFetch = now;
    }

    return usd * cachedRates.NGN;
};