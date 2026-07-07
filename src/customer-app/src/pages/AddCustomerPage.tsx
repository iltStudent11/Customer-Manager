import { useNavigate } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import { useCustomerContext } from '../context/CustomerContext';
import type { CustomerFormData } from '../types/customer';

export default function AddCustomerPage() {
  // Used to redirect after save/cancel.
  const navigate = useNavigate();
  // Context gives API-backed create function and status state.
  const { addCustomer, loading, error } = useCustomerContext();

  // Saves the new customer to API, then returns to list page.
  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await addCustomer(data);
      navigate('/');
    } catch {
      return;
    }
  };

  // User can leave without saving.
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <section className="page">
      <h1 className="page-title">Add Customer</h1>
      {loading ? <p className="status-message">Saving customer...</p> : null}
      {error ? <p className="status-message error">{error}</p> : null}
      <CustomerForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </section>
  );
}
