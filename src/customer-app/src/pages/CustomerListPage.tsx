import CustomerList from '../components/CustomerList';
import { DELETE_CUSTOMER, useCustomerContext } from '../context/CustomerContext';

export default function CustomerListPage() {
  const {
    state: { customers },
    dispatch,
  } = useCustomerContext();

  const handleDelete = (id: number) => {
    dispatch({
      type: DELETE_CUSTOMER,
      payload: id,
    });
  };

  return (
    <section>
      <h1>Customer List</h1>
      <CustomerList customers={customers} onDelete={handleDelete} />
    </section>
  );
}
