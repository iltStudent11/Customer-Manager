import { useEffect, useState } from 'react';
import type { CustomerFormData } from '../types/customer';

type Props = {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void | Promise<void>;
  onCancel: () => void;
};

const emptyFormData: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

export default function CustomerForm({ initialData, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<CustomerFormData>(initialData ?? emptyFormData);

  useEffect(() => {
    setFormData(initialData ?? emptyFormData);
  }, [initialData]);

  const isEditMode = Boolean(initialData);

  const handleFieldChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={(event) => handleFieldChange('name', event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(event) => handleFieldChange('email', event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={(event) => handleFieldChange('phone', event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          value={formData.address}
          onChange={(event) => handleFieldChange('address', event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          value={formData.city}
          onChange={(event) => handleFieldChange('city', event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="state">State</label>
        <input
          id="state"
          name="state"
          value={formData.state}
          onChange={(event) => handleFieldChange('state', event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="zip">ZIP</label>
        <input
          id="zip"
          name="zip"
          value={formData.zip}
          onChange={(event) => handleFieldChange('zip', event.target.value)}
        />
      </div>

      <div>
        <button type="submit">{isEditMode ? 'Update Customer' : 'Add Customer'}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
