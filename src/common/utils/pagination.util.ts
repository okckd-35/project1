export function paginate(data: any[], page: number, limit: number) {
    const total = data.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
  
    const paginatedData = data.slice(startIndex, endIndex);
  
    return {
      data: paginatedData,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    };
  }
  