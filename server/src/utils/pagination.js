function parsePagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 50);
  const offset = (page - 1) * limit; // Offset = (Page - 1) x Limit
  return { page, limit, offset };
}

function buildMeta(totalRows, page, limit) {
  return {
    totalRows,
    totalPages: Math.ceil(totalRows / limit),
    currentPage: page,
    limit,
  };
}

module.exports = { parsePagination, buildMeta };
