import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, type Mock } from 'vitest';
import CustomerList from './CustomerList';
import usePagination from '../hooks/usePagination';
import type { Customer } from '../types/customer';

vi.mock('../hooks/usePagination', () => ({
  default: vi.fn(),
}));

const mockedUsePagination = usePagination as unknown as Mock;

describe('CustomerList + usePagination boundary', () => {
  it('renders from hook output and forwards pagination control actions', async () => {
    const user = userEvent.setup();

    const goToPreviousPage = vi.fn();
    const goToNextPage = vi.fn();
    const setRowsPerPage = vi.fn();

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

    mockedUsePagination.mockReturnValue({
      currentPage: 2,
      totalPages: 3,
      rowsPerPage: 25,
      paginatedItems: [customers[1]],
      setRowsPerPage,
      goToPreviousPage,
      goToNextPage,
    });

    render(
      <MemoryRouter>
        <CustomerList customers={customers} onDelete={vi.fn()} />
      </MemoryRouter>
    );

    expect(mockedUsePagination).toHaveBeenCalledWith(customers, {
      itemsPerPageOptions: [10, 25, 50],
    });

    expect(screen.queryByText('Maria Garcia')).not.toBeInTheDocument();
    expect(screen.getByText('James Chen')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.selectOptions(screen.getByLabelText('Rows per page'), '50');

    expect(goToPreviousPage).toHaveBeenCalledTimes(1);
    expect(goToNextPage).toHaveBeenCalledTimes(1);
    expect(setRowsPerPage).toHaveBeenCalledWith(50 as 10 | 25 | 50);
  });
});
