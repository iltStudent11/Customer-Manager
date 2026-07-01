import { useNavigate, useParams } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import { UPDATE_CUSTOMER, useCustomerContext } from '../context/CustomerContext';
import type { Customer, CustomerFormData } from '../types/customer';

export default function EditCustomerPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    state: { customers },
    dispatch,
  } = useCustomerContext();

  const customerId = Number(id);
  const customer = customers.find((item) => item.id === customerId);

  if (!customer) {
    return (
      <section>
        <h1>Customer not found</h1>
        <button type="button" onClick={() => navigate('/')}>
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

  const handleSubmit = (data: CustomerFormData) => {
    const updatedCustomer: Customer = {
      id: customer.id,
      ...data,
    };

    dispatch({
      type: UPDATE_CUSTOMER,
      payload: updatedCustomer,
    });

    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <section>
      <h1>Edit Customer</h1>
      <CustomerForm initialData={initialData} onSubmit={handleSubmit} onCancel={handleCancel} />
    </section>
  );
}
