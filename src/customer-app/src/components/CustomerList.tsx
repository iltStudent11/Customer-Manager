import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import type { Customer } from '../types/customer';
import PaginationControls from './PaginationControls';
import usePagination from '../hooks/usePagination';

type Props = {
  customers: Customer[];
  onDelete: (id: number) => void;
};

type SortColumn = 'name' | 'email' | 'phone' | 'city';
type SortDirection = 'asc' | 'desc';

export default function CustomerList({ customers, onDelete }: Props) {
  const pageSizeOptions = [10, 25, 50] as const;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch.length === 0) {
      return customers;
    }

    return customers.filter((customer) => {
      const normalizedName = customer.name.toLowerCase();
      const normalizedEmail = customer.email.toLowerCase();
      const normalizedCity = customer.city.toLowerCase();
      const normalizedPhone = customer.phone;

      return (
        normalizedName.includes(normalizedSearch) ||
        normalizedEmail.includes(normalizedSearch) ||
        normalizedPhone.includes(normalizedSearch) ||
        normalizedCity.includes(normalizedSearch)
      );
    });
  }, [customers, searchTerm]);

  const sortedCustomers = useMemo(() => {
    if (!sortColumn) {
      return filteredCustomers;
    }

    const sorted = [...filteredCustomers].sort((left, right) => {
      const leftValue = left[sortColumn];
      const rightValue = right[sortColumn];
      const comparison = leftValue.localeCompare(rightValue, undefined, {
        sensitivity: 'base',
        numeric: sortColumn === 'phone',
      });

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredCustomers, sortColumn, sortDirection]);

  const {
    currentPage,
    totalPages,
    rowsPerPage,
    paginatedItems: paginatedCustomers,
    setRowsPerPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(sortedCustomers, {
    itemsPerPageOptions: pageSizeOptions,
  });

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 7 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : value;
  };

  if (customers.length === 0) {
    return <p className="status-message">No customers found.</p>;
  }

  const toggleSort = (column: SortColumn) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection('asc');
      return;
    }

    setSortDirection((previousDirection) => (previousDirection === 'asc' ? 'desc' : 'asc'));
  };

  const getSortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) {
      return '↕';
    }

    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <>
      <div className="list-filters" aria-label="Customer search and filters">
        <div className="list-filter-row">
          <label htmlFor="customer-search" className="list-filter-label">
            Search
          </label>
          <input
            id="customer-search"
            type="search"
            className="list-filter-input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search all columns"
          />
        </div>
      </div>
      {sortedCustomers.length === 0 ? <p className="status-message">No customers found.</p> : null}
      {sortedCustomers.length > 0 ? (
        <>
          <div className="table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>
                    <button type="button" className="sortable-header" onClick={() => toggleSort('name')}>
                      Name {getSortIndicator('name')}
                    </button>
                  </th>
                  <th>
                    <button type="button" className="sortable-header" onClick={() => toggleSort('email')}>
                      Email {getSortIndicator('email')}
                    </button>
                  </th>
                  <th>
                    <button type="button" className="sortable-header" onClick={() => toggleSort('phone')}>
                      Phone {getSortIndicator('phone')}
                    </button>
                  </th>
                  <th>
                    <button type="button" className="sortable-header" onClick={() => toggleSort('city')}>
                      City {getSortIndicator('city')}
                    </button>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{formatPhoneNumber(customer.phone)}</td>
                    <td>{customer.city}</td>
                    <td className="actions-cell">
                      <Link to={`/edit/${customer.id}`} className="btn btn-link">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => onDelete(customer.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            pageSizeOptions={pageSizeOptions}
            onRowsPerPageChange={setRowsPerPage}
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
          />
        </>
      ) : null}
    </>
  );
}
