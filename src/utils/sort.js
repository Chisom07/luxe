// // // utils/sort.js

// // const sortFlights = (flights, sortBy) => {
// //   switch (sortBy) {
// //     case "price_asc":
// //       return flights.sort((a, b) => a.priceUSD - b.priceUSD);

// //     case "price_desc":
// //       return flights.sort((a, b) => b.priceUSD - a.priceUSD);

// //     case "duration":
// //       return flights.sort((a, b) => a.duration - b.duration);

// //     default:
// //       return flights;
// //   }
// // };

// // module.exports = { sortFlights };



// const sortByPrice = (a, b) => a.price - b.price;
// module.exports = { sortByPrice };


exports.applySort = (data, sortBy) => {
    if (sortBy === "price")
        return data.sort((a, b) => a.priceNGN - b.priceNGN);

    if (sortBy === "duration")
        return data.sort((a, b) => a.duration - b.duration);
    

    return data;
};