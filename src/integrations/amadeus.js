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



const express = require("express");
const app = express();
const port = 3000; // Or any port you prefer

// Import your existing functions (assuming they are in a file named 'apiClient.js')
const { searchFlights, searchHotels } = require("./skyscanner"); // Adjust the path if needed

// Middleware to parse JSON bodies (if you were sending data in the request body)
app.use(express.json());

// Route for searching flights
app.get("/flights/searchFlights", async (req, res) => {
  try {
    // You'll likely want to pass query parameters from Postman to your searchFlights function
    // For example, if Postman sends ?from=LAX&to=NYC&date=2026-08-01
    const flightParams = {
      countryCode: req.query.countryCode || "US",
      market: req.query.market || "US",
      currency: req.query.currency || "USD",
      adults: parseInt(req.query.adults) || 1,
      childrens: parseInt(req.query.childrens) || 0,
      infants: parseInt(req.query.infants) || 0,
      cabinClass: req.query.cabinClass || "economy",
      originSkyId: req.query.originSkyId || "LOND", // Example, you'd get this from req.query
      returnDate: req.query.returnDate || "2026-08-15",
      originEntityId: parseInt(req.query.originEntityId) || 127544008, // Example
      date: req.query.date || "2026-08-01",
      destinationEntityId: parseInt(req.query.destinationEntityId) || 27537542, // Example
      destinationSkyId: req.query.destinationSkyId || "NYCA", // Example
    };

    const flightData = await searchFlights(flightParams);
    res.json(flightData);
  } catch (error) {
    console.error("Error searching flights:", error);
    res.status(500).json({ message: "Error searching flights", error: error.message });
  }
});

// Route for searching hotels
app.get("/hotels/searchHotels", async (req, res) => {
  try {
    // Similar to flights, parse parameters from req.query
    const hotelParams = {
      checkOut: req.query.checkOut || "2026-08-05",
      entityId: parseInt(req.query.entityId) || 27539733, // Example
      adults: parseInt(req.query.adults) || 2,
      checkIn: req.query.checkIn || "2026-08-01",
      market: req.query.market || "US",
      rooms: parseInt(req.query.rooms) || 1,
      currency: req.query.currency || "USD"
    };

    const hotelData = await searchHotels(hotelParams);
    res.json(hotelData);
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({ message: "Error searching hotels", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});