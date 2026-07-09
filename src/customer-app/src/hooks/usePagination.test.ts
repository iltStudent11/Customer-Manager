import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import usePagination from './usePagination';

describe('usePagination', () => {
  it('uses the first page size option by default and returns first page items', () => {
    const items = Array.from({ length: 12 }, (_, index) => index + 1);

    const { result } = renderHook(() =>
      usePagination(items, {
        itemsPerPageOptions: [10, 25, 50] as const,
      })
    );

    expect(result.current.rowsPerPage).toBe(10);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.paginatedItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('moves between pages and respects previous/next boundaries', () => {
    const items = Array.from({ length: 12 }, (_, index) => index + 1);

    const { result } = renderHook(() =>
      usePagination(items, {
        itemsPerPageOptions: [10, 25, 50] as const,
      })
    );

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems).toEqual([11, 12]);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('updates rows per page and resets current page to 1', () => {
    const items = Array.from({ length: 40 }, (_, index) => index + 1);

    const { result } = renderHook(() =>
      usePagination(items, {
        itemsPerPageOptions: [10, 25, 50] as const,
      })
    );

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.setRowsPerPage(25);
    });

    expect(result.current.rowsPerPage).toBe(25);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.paginatedItems).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 1)
    );
  });

  it('adjusts current page when the item list shrinks below current page range', () => {
    const initialItems = Array.from({ length: 20 }, (_, index) => index + 1);
    const smallerItems = Array.from({ length: 5 }, (_, index) => index + 1);

    const { result, rerender } = renderHook(
      ({ items }) =>
        usePagination(items, {
          itemsPerPageOptions: [10, 25, 50] as const,
        }),
      {
        initialProps: { items: initialItems },
      }
    );

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);

    rerender({ items: smallerItems });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedItems).toEqual([1, 2, 3, 4, 5]);
  });
});
