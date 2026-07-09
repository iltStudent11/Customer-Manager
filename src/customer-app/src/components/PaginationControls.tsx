type Props = {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  pageSizeOptions: readonly number[];
  onRowsPerPageChange: (rows: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  rowsPerPage,
  pageSizeOptions,
  onRowsPerPageChange,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="pagination-controls" aria-label="Pagination controls">
      <label className="pagination-size-label" htmlFor="rows-per-page">
        Rows per page
      </label>
      <select
        id="rows-per-page"
        className="pagination-size-select"
        value={rowsPerPage}
        onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
      >
        {pageSizeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button type="button" className="btn btn-secondary" onClick={onPrevious} disabled={currentPage === 1}>
        Previous
      </button>
      <span className="pagination-status">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
