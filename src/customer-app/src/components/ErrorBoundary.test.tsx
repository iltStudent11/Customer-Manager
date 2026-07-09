import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

function ThrowingComponent(): ReactElement {
  throw new Error('Boom from test');
}

function HealthyComponent() {
  return <p>Recovered content</p>;
}

describe('ErrorBoundary', () => {
  it('shows the fallback UI when a child throws during render', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText(/Error details: Boom from test/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('tries to render children again after clicking Try Again', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    rerender(
      <ErrorBoundary>
        <HealthyComponent />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(screen.getByText('Recovered content')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
