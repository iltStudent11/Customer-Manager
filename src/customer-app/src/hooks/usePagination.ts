import { useEffect, useMemo, useState } from 'react';

type UsePaginationOptions<TPageSize extends number> = {
  itemsPerPageOptions: readonly TPageSize[];
  initialRowsPerPage?: TPageSize;
};

export default function usePagination<TItem, TPageSize extends number>(
  items: TItem[],
  { itemsPerPageOptions, initialRowsPerPage }: UsePaginationOptions<TPageSize>
) {
  const defaultRowsPerPage = initialRowsPerPage ?? itemsPerPageOptions[0] ?? (10 as TPageSize);
  const [rowsPerPage, setRowsPerPageState] = useState<TPageSize>(defaultRowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return items.slice(start, start + rowsPerPage);
  }, [items, currentPage, rowsPerPage]);

  const setRowsPerPage = (rows: TPageSize) => {
    setRowsPerPageState(rows);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  return {
    currentPage,
    totalPages,
    rowsPerPage,
    paginatedItems,
    setRowsPerPage,
    goToPreviousPage,
    goToNextPage,
  };
}
