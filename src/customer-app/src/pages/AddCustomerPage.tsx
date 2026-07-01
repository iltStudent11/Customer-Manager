import { useNavigate } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import { ADD_CUSTOMER, useCustomerContext } from '../context/CustomerContext';
import type { Customer, CustomerFormData } from '../types/customer';

export default function AddCustomerPage() {
  const navigate = useNavigate();
  const {
    state: { customers },
    dispatch,
  } = useCustomerContext();

  const handleSubmit = (data: CustomerFormData) => {
    const maxId = customers.reduce((highest, customer) => Math.max(highest, customer.id), 0);
    const newCustomer: Customer = {
      id: maxId + 1,
      ...data,
    };

    dispatch({
      type: ADD_CUSTOMER,
      payload: newCustomer,
    });

    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <section>
      <h1>Add Customer</h1>
      <CustomerForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </section>
  );
}
