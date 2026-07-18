exports.applySort = (data, sortBy) => {
  if (!Array.isArray(data) || !sortBy) return data;

  const sorted = [...data];

  if (sortBy === "price") {
    return sorted.sort((a, b) => (a.priceNGN || 0) - (b.priceNGN || 0));
  }

  if (sortBy === "duration") {
    return sorted.sort(
      (a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0)
    );
  }

  if (sortBy === "rating") {
    return sorted.sort((a, b) => {
      const ratingA = Number(a.rating) || 0;
      const ratingB = Number(b.rating) || 0;
      return ratingB - ratingA;
    });
  }

  return data;
};
