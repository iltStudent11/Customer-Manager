import { createContext, useContext, type ReactNode } from 'react';
import { useCustomerApi } from '../hooks/useCustomerApi';
import type { Customer, CustomerFormData } from '../types/customer';

type CustomerContextValue = {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (formData: CustomerFormData) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
};

const CustomerContext = createContext<CustomerContextValue | undefined>(undefined);

type CustomerProviderProps = {
  children: ReactNode;
};

export function CustomerProvider({ children }: CustomerProviderProps) {
  const api = useCustomerApi();

  return <CustomerContext.Provider value={api}>{children}</CustomerContext.Provider>;
}

export function useCustomerContext() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }

  return context;
}
