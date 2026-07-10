import { useCallback, useEffect, useState } from 'react';
import type { Customer, CustomerFormData } from '../types/customer';

const CUSTOMER_API_BASE = '/api/customers';
const LOCAL_STORAGE_KEY = 'customer-manager-customers';

const FALLBACK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '555-0101',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
  },
  {
    id: 2,
    name: 'James Chen',
    email: 'james.chen@example.com',
    phone: '555-0102',
    address: '1600 Pennsylvania Ave',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    email: 'aisha.patel@example.com',
    phone: '555-0103',
    address: '350 Fifth Avenue',
    city: 'New York',
    state: 'NY',
    zip: '10118',
  },
  {
    id: 4,
    name: 'Carlos Rivera',
    email: 'carlos.rivera@example.com',
    phone: '555-0104',
    address: '233 S Wacker Dr',
    city: 'Chicago',
    state: 'IL',
    zip: '60606',
  },
  {
    id: 5,
    name: "Sarah O'Brien",
    email: 'sarah.obrien@example.com',
    phone: '555-0105',
    address: '1 Beacon St',
    city: 'Boston',
    state: 'MA',
    zip: '02108',
  },
];

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

const getStoredCustomers = () => {
  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(FALLBACK_CUSTOMERS));
    return FALLBACK_CUSTOMERS;
  }

  try {
    return JSON.parse(raw) as Customer[];
  } catch {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(FALLBACK_CUSTOMERS));
    return FALLBACK_CUSTOMERS;
  }
};

const saveStoredCustomers = (customers: Customer[]) => {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customers));
};

let inFlightCustomerLoad: Promise<Customer[]> | null = null;

const fetchCustomersFromApi = async () => {
  if (!inFlightCustomerLoad) {
    inFlightCustomerLoad = (async () => {
      const response = await fetch(CUSTOMER_API_BASE);

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }

      return (await response.json()) as Customer[];
    })().finally(() => {
      inFlightCustomerLoad = null;
    });
  }

  return inFlightCustomerLoad;
};

export function useCustomerApi(): UseCustomerApiResult {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useLocalStore, setUseLocalStore] = useState(false);

  const loadCustomers = useCallback(async () => {
    if (useLocalStore) {
      setCustomers(getStoredCustomers());
      return;
    }

    const data = await fetchCustomersFromApi();
    setCustomers(data);
  }, [useLocalStore]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await loadCustomers();
    } catch (caughtError) {
      if (!useLocalStore) {
        setUseLocalStore(true);
        setCustomers(getStoredCustomers());
        return;
      }

      setError(getErrorMessage(caughtError, 'Failed to fetch customers'));
      throw caughtError;
    } finally {
      setLoading(false);
    }
  }, [loadCustomers, useLocalStore]);

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
      if (useLocalStore) {
        setLoading(true);
        setError(null);

        try {
          const currentCustomers = getStoredCustomers();
          const nextId = currentCustomers.reduce((maxId, customer) => Math.max(maxId, customer.id), 0) + 1;
          const nextCustomers = [...currentCustomers, { id: nextId, ...formData }];
          saveStoredCustomers(nextCustomers);
          setCustomers(nextCustomers);
        } catch (caughtError) {
          setError(getErrorMessage(caughtError, 'Failed to add customer'));
          throw caughtError;
        } finally {
          setLoading(false);
        }

        return;
      }

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
    [runMutation, useLocalStore]
  );

  const updateCustomer = useCallback(
    async (customer: Customer) => {
      if (useLocalStore) {
        setLoading(true);
        setError(null);

        try {
          const currentCustomers = getStoredCustomers();
          const nextCustomers = currentCustomers.map((currentCustomer) =>
            currentCustomer.id === customer.id ? customer : currentCustomer
          );
          saveStoredCustomers(nextCustomers);
          setCustomers(nextCustomers);
        } catch (caughtError) {
          setError(getErrorMessage(caughtError, 'Failed to update customer'));
          throw caughtError;
        } finally {
          setLoading(false);
        }

        return;
      }

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
    [runMutation, useLocalStore]
  );

  const deleteCustomer = useCallback(
    async (id: number) => {
      if (useLocalStore) {
        setLoading(true);
        setError(null);

        try {
          const currentCustomers = getStoredCustomers();
          const nextCustomers = currentCustomers.filter((customer) => customer.id !== id);
          saveStoredCustomers(nextCustomers);
          setCustomers(nextCustomers);
        } catch (caughtError) {
          setError(getErrorMessage(caughtError, 'Failed to delete customer'));
          throw caughtError;
        } finally {
          setLoading(false);
        }

        return;
      }

      await runMutation(
        () =>
          fetch(`${CUSTOMER_API_BASE}/${id}`, {
            method: 'DELETE',
          }),
        'Failed to delete customer'
      );
    },
    [runMutation, useLocalStore]
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
