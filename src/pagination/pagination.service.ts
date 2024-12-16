export class PaginationService<T> {
  async getPaginationData(
    page: number,
    pageSize: number,
    items: T[],
    totalItems: number,
  ): Promise<PaginationResponse<T>> {
    const totalPages = Math.ceil(totalItems / pageSize);

    const hasPrevious = page > 1;
    const hasNext = page < totalPages;

    const resp = {
      items: items,
      page: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalItems: totalItems,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    };
    return resp;
  }
}
