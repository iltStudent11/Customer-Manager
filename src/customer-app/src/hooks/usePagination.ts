import { useEffect, useMemo, useState } from 'react';

type UsePaginationOptions = {
  itemsPerPageOptions: readonly number[];
  initialRowsPerPage?: number;
};

export default function usePagination<TItem>(
  items: TItem[],
  { itemsPerPageOptions, initialRowsPerPage }: UsePaginationOptions
) {
  const defaultRowsPerPage = initialRowsPerPage ?? itemsPerPageOptions[0] ?? 10;
  const [rowsPerPage, setRowsPerPageState] = useState(defaultRowsPerPage);
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

  const setRowsPerPage = (rows: number) => {
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
