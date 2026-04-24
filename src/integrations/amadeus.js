// // src/integrations/amadeus.js

// const axios = require("axios");

// let accessToken = null;
// let tokenExpiry = null;

// const getAccessToken = async () => {
//   try {
//     // reuse token if still valid
//     if (accessToken && tokenExpiry > Date.now()) {
//       return accessToken;
//     }

//     const response = await axios.post(
//       "https://test.api.amadeus.com/v1/security/oauth2/token",
//       new URLSearchParams({
//         grant_type: "client_credentials",
//         client_id: process.env.AMADEUS_API_KEY,
//         client_secret: process.env.AMADEUS_API_SECRET,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     accessToken = response.data.access_token;
//     tokenExpiry = Date.now() + response.data.expires_in * 1000;

//     return accessToken;
//   } catch (error) {
//     console.error("Amadeus Auth Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// const searchFlights = async (params) => {
//   try {
//     const token = await getAccessToken();

//     const response = await axios.get(
//       "https://test.api.amadeus.com/v2/shopping/flight-offers",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           originLocationCode: params.from,
//           destinationLocationCode: params.to,
//           departureDate: params.date,
//           adults: params.passengers || 1,
//         },
//       }
//     );

//     return response.data.data;
//   } catch (error) {
//     console.error("Flight search error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// module.exports = { searchFlights };


