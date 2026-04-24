// const applyFilters = (flights, filter) => {
//   switch (filter) {
//     case "cheapest":
//       return flights.sort((a, b) => a.price - b.price);
//     case "fastest":
//       return flights.sort(
//         (a, b) => a.durationMinutes - b.durationMinutes
//       );
//     case "best":
//       return flights.sort(
//         (a, b) =>
//           a.price + a.durationMinutes * 0.5 -
//           (b.price + b.durationMinutes * 0.5)
//       );
//     default:
//       return flights;
//   }
// };

// const paginate = (data, page = 1, limit = 5) => {
//   page = Number(page);
//   limit = Number(limit);

//   const start = (page - 1) * limit;

//   return {
//     results: data.slice(start, start + limit),
//     total: data.length,
//     page,
//     totalPages: Math.ceil(data.length / limit),
//   };
// };

// module.exports = { applyFilters, paginate };


exports.applyFilters = (data, query) => {
    let result = data;

    if (query.stops) 
        result = result.filter(f => f.stops == query.stops);

    if (query.airline)
        result = result.filter(f => 
            f.airline.toLowerCase().includes(query.airline.toLowerCase())
        );

    return result;
};