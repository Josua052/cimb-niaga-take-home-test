import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonitoringPage } from './MonitoringPage';

describe('MonitoringPage & Layout', () => {
  it('renders sidebar navigation with active Call Monitoring menu', () => {
    render(<MonitoringPage />);

    expect(screen.getByText('CIMB NIAGA')).toBeInTheDocument();
    expect(screen.getByText('Supervisor Portal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Call Monitoring/i })).toBeInTheDocument();
  });

  it('renders top navbar header with supervisor information', () => {
    render(<MonitoringPage />);

    expect(screen.getByText('PostgreSQL Active')).toBeInTheDocument();
    expect(screen.getByText('Supervisor')).toBeInTheDocument();
    expect(screen.getByText('Call Center Unit')).toBeInTheDocument();
  });

  it('renders page header title and content container', () => {
    render(<MonitoringPage />);

    expect(screen.getByText('Monitoring Sentimen Panggilan')).toBeInTheDocument();
    expect(screen.getByTestId('monitoring-content-container')).toBeInTheDocument();
  });

  it('toggles mobile sidebar drawer when hamburger button and close button are clicked', () => {
    render(<MonitoringPage />);

    const menuButton = screen.getByRole('button', { name: /Buka menu navigasi/i });
    const sidebar = screen.getByTestId('sidebar-container');

    expect(sidebar).toHaveClass('-translate-x-full');

    fireEvent.click(menuButton);
    expect(sidebar).toHaveClass('translate-x-0');

    const backdrop = screen.getByTestId('sidebar-backdrop');
    fireEvent.click(backdrop);
    expect(sidebar).toHaveClass('-translate-x-full');
  });
});
