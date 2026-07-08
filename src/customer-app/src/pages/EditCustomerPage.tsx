import { useNavigate, useParams } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import { useCustomerContext } from '../context/CustomerContext';
import type { CustomerFormData } from '../types/customer';

export default function EditCustomerPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { customers, loading, error, updateCustomer } = useCustomerContext();

  if (loading) {
    return <p className="status-message">Loading customer...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  const customerId = Number(id);
  const customer = customers.find((item) => item.id === customerId);

  if (!customer) {
    return (
      <section className="page">
        <h1 className="page-title">Customer not found</h1>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Customers
        </button>
      </section>
    );
  }

  const initialData: CustomerFormData = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    zip: customer.zip,
  };

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await updateCustomer({
        id: customer.id,
        ...data,
      });
      navigate('/');
    } catch {}
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <section className="page">
      <h1 className="page-title">Edit Customer</h1>
      <CustomerForm initialData={initialData} onSubmit={handleSubmit} onCancel={handleCancel} />
    </section>
  );
}
