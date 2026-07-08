import { useNavigate } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import { useCustomerContext } from '../context/CustomerContext';
import type { CustomerFormData } from '../types/customer';

export default function AddCustomerPage() {
  const navigate = useNavigate();
  const { addCustomer, loading, error } = useCustomerContext();

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await addCustomer(data);
      navigate('/');
    } catch {}
  };

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
