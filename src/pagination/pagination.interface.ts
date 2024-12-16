interface PaginationResponse<T> {
    items: T[],
    page: number,
    pageSize: number,
    totalPages: number,
    hasPrevious: boolean,
    hasNext: boolean
    totalItems: number
  }
  