import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test crash in child component');
};

describe('App & ErrorBoundary Component', () => {
  it('renders application with MonitoringPage', () => {
    render(<App />);
    expect(screen.getByText('Monitoring Sentimen Panggilan')).toBeInTheDocument();
  });

  it('catches runtime rendering errors and displays fallback UI', () => {
    // Suppress console.error in test output for intentional thrown error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Terjadi Kesalahan Sistem')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Muat Ulang Halaman/i })).toBeInTheDocument();

    spy.mockRestore();
  });
});
