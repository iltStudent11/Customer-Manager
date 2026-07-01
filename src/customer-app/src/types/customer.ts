// Full customer object as it exists in API/database records.
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

// Form payload for create/update (id is generated or already known separately).
export type CustomerFormData = Omit<Customer, 'id'>;
