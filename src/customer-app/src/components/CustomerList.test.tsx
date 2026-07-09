import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import CustomerList from './CustomerList';
import type { Customer } from '../types/customer';

const sampleCustomers: Customer[] = [
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

const buildCustomers = (count: number): Customer[] =>
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

const renderList = (items: Customer[], onDelete = vi.fn()) => {
  render(
    <MemoryRouter>
      <CustomerList customers={items} onDelete={onDelete} />
    </MemoryRouter>
  );

  return { onDelete };
};

describe('CustomerList', () => {
  it('shows the customers passed into the table', () => {
    renderList(sampleCustomers);

    expect(screen.getByText('Maria Garcia')).toBeInTheDocument();
    expect(screen.getByText('James Chen')).toBeInTheDocument();
  });

  it('shows the empty-state message when no customers exist', () => {
    renderList([]);

    expect(screen.getByText('No customers found.')).toBeInTheDocument();
  });

  it('calls onDelete with the selected customer id', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderList(sampleCustomers, vi.fn());

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('builds edit links for each customer row', () => {
    renderList(sampleCustomers);

    const editLinks = screen.getAllByRole('link', { name: 'Edit' });

    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute('href', '/edit/1');
    expect(editLinks[1]).toHaveAttribute('href', '/edit/2');
  });

  it('shows 10 rows per page by default and moves to the next page', async () => {
    const user = userEvent.setup();
    renderList(buildCustomers(12));

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

  it('updates pagination when rows per page changes', async () => {
    const user = userEvent.setup();
    renderList(buildCustomers(40));

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
