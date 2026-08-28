import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MonitoringPage } from './MonitoringPage';
import * as service from '@/features/monitoring/services/callMonitoringService';
import type { PagedResponse, CallMonitoringRecord } from '@/features/monitoring/types/monitoring.types';

describe('MonitoringPage & End-to-End Component Assembly', () => {
  const mockPage1: PagedResponse<CallMonitoringRecord> = {
    data: [
      {
        no: 1,
        id: 1,
        callId: 'CALL-20260828-001',
        callTimestamp: '2026-08-28T09:00:00+07:00',
        csName: 'Siti Aminah',
        customerName: 'Budi Santoso',
        sentimentScore: 88,
      },
      {
        no: 2,
        id: 2,
        callId: 'CALL-20260828-002',
        callTimestamp: '2026-08-28T09:30:00+07:00',
        csName: 'Ahmad Fauzi',
        customerName: 'Dewi Lestari',
        sentimentScore: 65,
      },
    ],
    page: {
      currentPage: 0,
      totalPages: 2,
      totalElements: 7,
      size: 5,
    },
  };

  const mockPage2: PagedResponse<CallMonitoringRecord> = {
    data: [
      {
        no: 6,
        id: 6,
        callId: 'CALL-20260828-006',
        callTimestamp: '2026-08-28T11:00:00+07:00',
        csName: 'Rian Pratama',
        customerName: 'Maya Indah',
        sentimentScore: 92,
      },
    ],
    page: {
      currentPage: 1,
      totalPages: 2,
      totalElements: 7,
      size: 5,
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders layout shell, header, supervisor profile, and active sidebar item', async () => {
    vi.spyOn(service, 'fetchCallMonitoring').mockResolvedValue(mockPage1);

    render(<MonitoringPage />);

    expect(screen.getByText('CIMB NIAGA')).toBeInTheDocument();
    expect(screen.getAllByText('Call Monitoring').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('PostgreSQL Active')).toBeInTheDocument();
    expect(screen.getByText('Supervisor')).toBeInTheDocument();
    expect(screen.getByText('Monitoring Sentimen Panggilan')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('CALL-20260828-001')).toBeInTheDocument();
    });
  });

  it('toggles mobile sidebar drawer when menu and close buttons are clicked', async () => {
    vi.spyOn(service, 'fetchCallMonitoring').mockResolvedValue(mockPage1);

    render(<MonitoringPage />);

    await waitFor(() => {
      expect(screen.getByText('CALL-20260828-001')).toBeInTheDocument();
    });

    const menuButton = screen.getByRole('button', { name: /Buka menu navigasi/i });
    const sidebarContainer = screen.getByTestId('sidebar-container');

    expect(sidebarContainer).toHaveClass('-translate-x-full');

    fireEvent.click(menuButton);
    expect(sidebarContainer).toHaveClass('translate-x-0');

    const backdrop = screen.getByTestId('sidebar-backdrop');
    fireEvent.click(backdrop);
    expect(sidebarContainer).toHaveClass('-translate-x-full');
  });

  it('assembles FilterToolbar, Table, and Pagination with full data flow', async () => {
    const fetchSpy = vi
      .spyOn(service, 'fetchCallMonitoring')
      .mockResolvedValueOnce(mockPage1)
      .mockResolvedValueOnce(mockPage2);

    render(<MonitoringPage />);

    // Verify initial data load
    await waitFor(() => {
      expect(screen.getByText('CALL-20260828-001')).toBeInTheDocument();
      expect(screen.getByText('CALL-20260828-002')).toBeInTheDocument();
      expect(screen.getByText('88%')).toBeInTheDocument();
      expect(screen.getByText('65%')).toBeInTheDocument();
      expect(screen.getByTestId('page-indicator')).toHaveTextContent('Halaman 1 dari 2');
    });

    // Navigate to page 2 via Pagination Next button
    const nextBtn = screen.getByRole('button', { name: /Halaman Berikutnya/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1 }),
        expect.any(AbortSignal)
      );
      expect(screen.getByText('CALL-20260828-006')).toBeInTheDocument();
      expect(screen.getByText('Maya Indah')).toBeInTheDocument();
      expect(screen.getByTestId('page-indicator')).toHaveTextContent('Halaman 2 dari 2');
    });
  });

  it('handles search input change and resets to page 1', async () => {
    const fetchSpy = vi
      .spyOn(service, 'fetchCallMonitoring')
      .mockResolvedValue(mockPage1);

    render(<MonitoringPage />);

    await waitFor(() => {
      expect(screen.getByText('CALL-20260828-001')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /Pencarian kata kunci/i });
    fireEvent.change(searchInput, { target: { value: 'Budi' } });

    await waitFor(
      () => {
        expect(fetchSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({ keyword: 'Budi', page: 0 }),
          expect.any(AbortSignal)
        );
      },
      { timeout: 1000 }
    );
  });

  it('handles column sorting click in table header', async () => {
    const fetchSpy = vi
      .spyOn(service, 'fetchCallMonitoring')
      .mockResolvedValue(mockPage1);

    render(<MonitoringPage />);

    await waitFor(() => {
      expect(screen.getByText('CALL-20260828-001')).toBeInTheDocument();
    });

    const csNameHeader = screen.getByRole('button', { name: /Urutkan berdasarkan CS Name/i });
    fireEvent.click(csNameHeader);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ sortBy: 'csName', sortDir: 'asc', page: 0 }),
        expect.any(AbortSignal)
      );
    });
  });

  it('displays error state in table and recovers on retry click', async () => {
    const fetchSpy = vi
      .spyOn(service, 'fetchCallMonitoring')
      .mockRejectedValueOnce(new Error('Koneksi database terputus'))
      .mockResolvedValueOnce(mockPage1);

    render(<MonitoringPage />);

    await waitFor(() => {
      expect(screen.getByTestId('table-error-state')).toBeInTheDocument();
      expect(screen.getByText('Koneksi database terputus')).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole('button', { name: /Coba Lagi/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(screen.getByText('CALL-20260828-001')).toBeInTheDocument();
    });
  });
});
