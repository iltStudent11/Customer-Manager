import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CustomerForm from './CustomerForm';
import type { CustomerFormData } from '../types/customer';

describe('CustomerForm', () => {
  it('shows required validation errors when submitting an empty form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CustomerForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Add Customer' }));

    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Phone is required.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CustomerForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Name'), 'Alex Monroe');
    await user.type(screen.getByLabelText('Email'), 'alex.monroe@example.com');
    await user.type(screen.getByLabelText('Phone'), '1234567');
    await user.type(screen.getByLabelText('Address'), '101 Main Street');
    await user.type(screen.getByLabelText('City'), 'Dover');
    await user.type(screen.getByLabelText('State'), 'NH');
    await user.type(screen.getByLabelText('ZIP'), '03820');

    await user.click(screen.getByRole('button', { name: 'Add Customer' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alex Monroe',
      email: 'alex.monroe@example.com',
      phone: '123-4567',
      address: '101 Main Street',
      city: 'Dover',
      state: 'NH',
      zip: '03820',
    });
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<CustomerForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('pre-fills form values when initialData is provided', () => {
    const initialData: CustomerFormData = {
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '555-0101',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
    };

    render(<CustomerForm initialData={initialData} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toHaveValue('Maria Garcia');
    expect(screen.getByLabelText('Email')).toHaveValue('maria.garcia@example.com');
    expect(screen.getByLabelText('Phone')).toHaveValue('555-0101');
    expect(screen.getByLabelText('Address')).toHaveValue('742 Evergreen Terrace');
    expect(screen.getByLabelText('City')).toHaveValue('Springfield');
    expect(screen.getByLabelText('State')).toHaveValue('IL');
    expect(screen.getByLabelText('ZIP')).toHaveValue('62704');
  });
});
