import CustomerList from '../components/CustomerList';
import { useCustomerContext } from '../context/CustomerContext';

export default function CustomerListPage() {
  const { customers, loading, error, deleteCustomer } = useCustomerContext();

  const handleDelete = async (id: number) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this customer?');

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteCustomer(id);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p className="status-message">Loading customers...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  return (
    <section className="page">
      <h1 className="page-title">Customer List</h1>
      <CustomerList customers={customers} onDelete={handleDelete} />
    </section>
  );
}
