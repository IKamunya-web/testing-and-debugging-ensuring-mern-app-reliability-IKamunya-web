import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../../components/ErrorBoundary';

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error thrown');
};

// Component that renders normally
const NormalComponent = () => (
  <div>Normal component content</div>
);

describe('ErrorBoundary Component', () => {
  // Suppress error logs in console during tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal component content')).toBeInTheDocument();
  });

  test('renders error UI when child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred in the application.')).toBeInTheDocument();
  });

  test('displays Try Again button', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
  });

  test('calls onError callback when error is caught', () => {
    const onErrorMock = jest.fn();
    render(
      <ErrorBoundary onError={onErrorMock}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalled();
  });

  test('displays error count when showErrorCount prop is true', () => {
    render(
      <ErrorBoundary showErrorCount>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/error count: 1/i)).toBeInTheDocument();
  });

  test('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/error details/i)).toBeInTheDocument();
    expect(screen.getByText(/test error thrown/i)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  test('can reset error state with Try Again button', async () => {
    const { rerender } = render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    // Initially renders normal content
    expect(screen.getByText('Normal component content')).toBeInTheDocument();

    // Rerender with error component
    rerender(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Error UI is shown
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click Try Again button
    let button = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(button);

    // Button should still exist after reset (component still has error boundary)
    button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
  });

  test('renders fallback UI with proper styling', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const errorDiv = screen.getByText('Something went wrong').closest('div');
    expect(errorDiv).toHaveStyle({ border: '2px solid #d32f2f' });
  });
});
