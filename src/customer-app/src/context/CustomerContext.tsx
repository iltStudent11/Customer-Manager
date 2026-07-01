import { createContext, useContext, type ReactNode } from 'react';
import { useCustomerApi } from '../hooks/useCustomerApi';
import type { Customer, CustomerFormData } from '../types/customer';

// Describes everything the context shares with consumers.
type CustomerContextValue = {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (formData: CustomerFormData) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
};

// Starts as undefined so we can throw a helpful error if used outside provider.
const CustomerContext = createContext<CustomerContextValue | undefined>(undefined);

type CustomerProviderProps = {
  children: ReactNode;
};

export function CustomerProvider({ children }: CustomerProviderProps) {
  // All API/state logic lives in one custom hook.
  const api = useCustomerApi();

  return <CustomerContext.Provider value={api}>{children}</CustomerContext.Provider>;
}

export function useCustomerContext() {
  // Consumer helper so components don't call useContext directly.
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }

  return context;
}
