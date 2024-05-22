type Pagination = {
  currentPage: number;
  limit: number;
  skip: number;
  prevPage: number | null;
  nextPage: number | null;
  numberOfPages: number;
  total: number;
  hasNextPage: boolean | null;
  hasPreviousPage: boolean | null;
};

export default Pagination;
