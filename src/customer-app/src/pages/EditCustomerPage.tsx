import { useParams } from 'react-router-dom';

export default function EditCustomerPage() {
  const { id } = useParams();

  return <h1>Edit Customer {id}</h1>;
}
