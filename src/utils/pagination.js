exports.paginate = (data, page = 1, limit = 5) => {
    const start = (page - 1) * limit;
    return {
        results: data.slice(start, start + limit),
        total: data.length,
        page,
        totalPages: Math.ceil(data.length / limit),
    };
};