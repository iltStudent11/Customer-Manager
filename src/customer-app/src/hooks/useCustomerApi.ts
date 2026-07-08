import { useCallback, useEffect, useState } from 'react';
import type { Customer, CustomerFormData } from '../types/customer';

const CUSTOMER_API_BASE = '/api/customers';

type UseCustomerApiResult = {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (formData: CustomerFormData) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useCustomerApi(): UseCustomerApiResult {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    const response = await fetch(CUSTOMER_API_BASE);

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.status}`);
    }

    const data = (await response.json()) as Customer[];
    setCustomers(data);
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await loadCustomers();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, 'Failed to fetch customers'));
      throw caughtError;
    } finally {
      setLoading(false);
    }
  }, [loadCustomers]);

  useEffect(() => {
    void fetchCustomers().catch(() => undefined);
  }, [fetchCustomers]);

  const runMutation = useCallback(
    async (
      request: () => Promise<Response>,
      failedActionMessage: string
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await request();

        if (!response.ok) {
          throw new Error(`${failedActionMessage}: ${response.status}`);
        }

        await loadCustomers();
      } catch (caughtError) {
        setError(getErrorMessage(caughtError, failedActionMessage));
        throw caughtError;
      } finally {
        setLoading(false);
      }
    },
    [loadCustomers]
  );

  const addCustomer = useCallback(
    async (formData: CustomerFormData) => {
      await runMutation(
        () =>
          fetch(CUSTOMER_API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          }),
        'Failed to add customer'
      );
    },
    [runMutation]
  );

  const updateCustomer = useCallback(
    async (customer: Customer) => {
      await runMutation(
        () =>
          fetch(`${CUSTOMER_API_BASE}/${customer.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer),
          }),
        'Failed to update customer'
      );
    },
    [runMutation]
  );

  const deleteCustomer = useCallback(
    async (id: number) => {
      await runMutation(
        () =>
          fetch(`${CUSTOMER_API_BASE}/${id}`, {
            method: 'DELETE',
          }),
        'Failed to delete customer'
      );
    },
    [runMutation]
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
