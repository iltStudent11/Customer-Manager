import { useCallback, useEffect, useState } from 'react';
import type { Customer, CustomerFormData } from '../types/customer';

// All customer requests go through this proxied base URL.
const CUSTOMER_API_BASE = '/api/customers';

// Shape returned by the hook so consuming code has strong typing.
type UseCustomerApiResult = {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (formData: CustomerFormData) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
};

export function useCustomerApi(): UseCustomerApiResult {
  // Local hook state: server data + request status flags.
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loads full customer list from the API.
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(CUSTOMER_API_BASE);

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }

      const data = (await response.json()) as Customer[];
      setCustomers(data);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to fetch customers';
      setError(message);
      throw caughtError;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch when the hook first mounts.
  useEffect(() => {
    void fetchCustomers().catch(() => undefined);
  }, [fetchCustomers]);

  // Creates a customer, then refreshes list so UI stays in sync with server.
  const addCustomer = useCallback(
    async (formData: CustomerFormData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(CUSTOMER_API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Failed to add customer: ${response.status}`);
        }

        await fetchCustomers();
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : 'Failed to add customer';
        setError(message);
        throw caughtError;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  // Updates a customer, then re-fetches list.
  const updateCustomer = useCallback(
    async (customer: Customer) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${CUSTOMER_API_BASE}/${customer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer),
        });

        if (!response.ok) {
          throw new Error(`Failed to update customer: ${response.status}`);
        }

        await fetchCustomers();
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : 'Failed to update customer';
        setError(message);
        throw caughtError;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  // Deletes a customer, then re-fetches list.
  const deleteCustomer = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${CUSTOMER_API_BASE}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Failed to delete customer: ${response.status}`);
        }

        await fetchCustomers();
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : 'Failed to delete customer';
        setError(message);
        throw caughtError;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
