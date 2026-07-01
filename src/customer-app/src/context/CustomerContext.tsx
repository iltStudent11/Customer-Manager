import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import type { Customer } from '../types/customer';

export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const SET_CUSTOMERS = 'SET_CUSTOMERS';

type CustomerAction =
  | { type: typeof ADD_CUSTOMER; payload: Customer }
  | { type: typeof UPDATE_CUSTOMER; payload: Customer }
  | { type: typeof DELETE_CUSTOMER; payload: number }
  | { type: typeof SET_CUSTOMERS; payload: Customer[] };

type CustomerState = {
  customers: Customer[];
};

const initialState: CustomerState = {
  customers: [],
};

function customerReducer(state: CustomerState, action: CustomerAction): CustomerState {
  switch (action.type) {
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter((customer) => customer.id !== action.payload),
      };
    case SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
      };
    default:
      return state;
  }
}

type CustomerContextValue = {
  state: CustomerState;
  dispatch: Dispatch<CustomerAction>;
};

const CustomerContext = createContext<CustomerContextValue | undefined>(undefined);

type CustomerProviderProps = {
  children: ReactNode;
};

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch('/api/customers');

        if (!response.ok) {
          throw new Error(`Failed to load customers: ${response.status}`);
        }

        const customers = (await response.json()) as Customer[];
        dispatch({
          type: SET_CUSTOMERS,
          payload: customers,
        });
      } catch (error) {
        console.error(error);
      }
    };

    void loadCustomers();
  }, []);

  return <CustomerContext.Provider value={{ state, dispatch }}>{children}</CustomerContext.Provider>;
}

export function useCustomerContext() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }

  return context;
}

export type { CustomerAction, CustomerState };
