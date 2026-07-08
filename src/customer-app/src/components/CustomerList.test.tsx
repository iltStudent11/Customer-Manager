import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import CustomerList from './CustomerList';
import type { Customer } from '../types/customer';

const customers: Customer[] = [
  {
    id: 1,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '1234567',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
  },
  {
    id: 2,
    name: 'James Chen',
    email: 'james.chen@example.com',
    phone: '7654321',
    address: '1600 Pennsylvania Ave',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
  },
];

const renderCustomerList = (items: Customer[], onDelete = vi.fn()) => {
  render(
    <MemoryRouter>
      <CustomerList customers={items} onDelete={onDelete} />
    </MemoryRouter>
  );

  return { onDelete };
};

describe('CustomerList', () => {
  it('renders all customer names', () => {
    renderCustomerList(customers);

    expect(screen.getByText('Maria Garcia')).toBeInTheDocument();
    expect(screen.getByText('James Chen')).toBeInTheDocument();
  });

  it('shows empty state when customer list is empty', () => {
    renderCustomerList([]);

    expect(screen.getByText('No customers found.')).toBeInTheDocument();
  });

  it('calls onDelete with the correct customer id', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderCustomerList(customers, vi.fn());

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('renders edit links with the correct route for each customer', () => {
    renderCustomerList(customers);

    const editLinks = screen.getAllByRole('link', { name: 'Edit' });

    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute('href', '/edit/1');
    expect(editLinks[1]).toHaveAttribute('href', '/edit/2');
  });
});
