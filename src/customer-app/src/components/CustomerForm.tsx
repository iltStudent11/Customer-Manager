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

const emptyErrors: Record<keyof CustomerFormData, string> = {
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
  const [errors, setErrors] = useState<Record<keyof CustomerFormData, string>>(emptyErrors);

  useEffect(() => {
    setFormData(initialData ?? emptyFormData);
  }, [initialData]);

  const isEditMode = Boolean(initialData);

  const handleFieldChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validate = () => {
    const nextErrors: Record<keyof CustomerFormData, string> = { ...emptyErrors };

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone is required.';
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => error === '');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={(event) => handleFieldChange('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className={`form-input ${errors.name ? 'invalid' : ''}`.trim()}
          />
          {errors.name ? <p className="field-error">{errors.name}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(event) => handleFieldChange('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className={`form-input ${errors.email ? 'invalid' : ''}`.trim()}
          />
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(event) => handleFieldChange('phone', event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            className={`form-input ${errors.phone ? 'invalid' : ''}`.trim()}
          />
          {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            value={formData.address}
            onChange={(event) => handleFieldChange('address', event.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={formData.city}
            onChange={(event) => handleFieldChange('city', event.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="state">State</label>
          <input
            id="state"
            name="state"
            value={formData.state}
            onChange={(event) => handleFieldChange('state', event.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="zip">ZIP</label>
          <input
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={(event) => handleFieldChange('zip', event.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Update Customer' : 'Add Customer'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
