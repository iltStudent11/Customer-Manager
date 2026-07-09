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

const createCustomers = (count: number): Customer[] =>
  Array.from({ length: count }, (_, index) => {
    const number = index + 1;

    return {
      id: number,
      name: `Customer ${number}`,
      email: `customer${number}@example.com`,
      phone: `555${String(number).padStart(4, '0')}`,
      address: `${number} Main St`,
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
    };
  });

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

  it('paginates customers with 10 rows per page by default', async () => {
    const user = userEvent.setup();
    renderCustomerList(createCustomers(12));

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    expect(screen.getByText('Customer 10')).toBeInTheDocument();
    expect(screen.queryByText('Customer 11')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByText('Customer 11')).toBeInTheDocument();
  });

  it('allows changing rows per page to 25 and 50', async () => {
    const user = userEvent.setup();
    renderCustomerList(createCustomers(40));

    expect(screen.getByText('Page 1 of 4')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Rows per page'), '25');

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Customer 25')).toBeInTheDocument();
    expect(screen.queryByText('Customer 26')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Rows per page'), '50');

    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByText('Customer 40')).toBeInTheDocument();
  });
});
