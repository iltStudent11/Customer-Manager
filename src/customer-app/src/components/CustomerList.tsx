import { Link } from 'react-router-dom';
import type { Customer } from '../types/customer';
import PaginationControls from './PaginationControls';
import usePagination from '../hooks/usePagination';

type Props = {
  customers: Customer[];
  onDelete: (id: number) => void;
};

export default function CustomerList({ customers, onDelete }: Props) {
  const pageSizeOptions = [10, 25, 50] as const;
  const {
    currentPage,
    totalPages,
    rowsPerPage,
    paginatedItems: paginatedCustomers,
    setRowsPerPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(customers, {
    itemsPerPageOptions: pageSizeOptions,
  });

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 7 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : value;
  };

  if (customers.length === 0) {
    return <p className="status-message">No customers found.</p>;
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
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
                  <button type="button" className="btn btn-danger" onClick={() => onDelete(customer.id)}>
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
  );
}
