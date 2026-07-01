import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AddCustomerPage from './pages/AddCustomerPage';
import CustomerListPage from './pages/CustomerListPage';
import EditCustomerPage from './pages/EditCustomerPage';

export default function App() {
  return (
    // Top-level route table for the app.
    <Routes>
      {/* Layout wraps all pages so they share the same header/nav/container. */}
      <Route element={<Layout />}>
        <Route path="/" element={<CustomerListPage />} />
        <Route path="/add" element={<AddCustomerPage />} />
        <Route path="/edit/:id" element={<EditCustomerPage />} />
      </Route>
    </Routes>
  );
}
