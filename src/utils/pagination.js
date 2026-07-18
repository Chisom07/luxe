exports.paginate = (data, page = 1, limit = 10) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Number(limit) || 10);
  const start = (currentPage - 1) * pageSize;

  return {
    results: data.slice(start, start + pageSize),
    total: data.length,
    page: currentPage,
    totalPages: Math.max(1, Math.ceil(data.length / pageSize)),
  };
};
