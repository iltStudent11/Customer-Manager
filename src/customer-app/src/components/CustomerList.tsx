import { Link } from 'react-router-dom';
import type { Customer } from '../types/customer';

type Props = {
  customers: Customer[];
  onDelete: (id: number) => void;
};

export default function CustomerList({ customers, onDelete }: Props) {
  // Empty state so the table isn't shown with no rows.
  if (customers.length === 0) {
    return <p className="status-message">No customers found.</p>;
  }

  return (
    // Semantic table markup for accessible tabular data.
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
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.phone}</td>
            <td>{customer.city}</td>
            <td className="actions-cell">
              {/* Edit opens form pre-filled for this customer id. */}
              <Link to={`/edit/${customer.id}`} className="btn btn-link">
                Edit
              </Link>
              {/* Delete delegates behavior to parent page handler. */}
              <button type="button" className="btn btn-danger" onClick={() => onDelete(customer.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}
