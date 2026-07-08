import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AddCustomerPage from './pages/AddCustomerPage';
import CustomerListPage from './pages/CustomerListPage';
import EditCustomerPage from './pages/EditCustomerPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CustomerListPage />} />
        <Route path="/add" element={<AddCustomerPage />} />
        <Route path="/edit/:id" element={<EditCustomerPage />} />
      </Route>
    </Routes>
  );
}
