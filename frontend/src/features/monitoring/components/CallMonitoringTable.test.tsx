import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CallMonitoringTable } from './CallMonitoringTable';
import { SentimentBadge } from './SentimentBadge';
import type { CallMonitoringRecord } from '../types/monitoring.types';

describe('CallMonitoringTable & SentimentBadge', () => {
  const mockRecords: CallMonitoringRecord[] = [
    {
      no: 1,
      id: 101,
      callId: 'CALL-20260828-001',
      callTimestamp: '2026-08-28T09:30:00+07:00',
      csName: 'Siti Aminah',
      customerName: 'Budi Santoso',
      sentimentScore: 85,
    },
    {
      no: 2,
      id: 102,
      callId: 'CALL-20260828-002',
      callTimestamp: '2026-08-28T10:00:00+07:00',
      csName: 'Ahmad Fauzi',
      customerName: 'Dewi Lestari',
      sentimentScore: 62,
    },
  ];

  describe('SentimentBadge', () => {
    it('renders green badge for score >= 70', () => {
      render(<SentimentBadge score={85} />);
      const badge = screen.getByTestId('sentiment-badge');

      expect(badge).toHaveTextContent('85%');
      expect(badge).toHaveClass('text-emerald-700');
    });

    it('renders red badge for score < 70', () => {
      render(<SentimentBadge score={62} />);
      const badge = screen.getByTestId('sentiment-badge');

      expect(badge).toHaveTextContent('62%');
      expect(badge).toHaveClass('text-red-700');
    });
  });

  describe('CallMonitoringTable', () => {
    it('renders table headers and data rows with proper formatting', () => {
      render(
        <CallMonitoringTable
          records={mockRecords}
          isLoading={false}
          error={null}
          sort={{ sortBy: 'callTimestamp', sortDir: 'desc' }}
          onSort={vi.fn()}
          onRetry={vi.fn()}
        />
      );

      expect(screen.getByText('No.')).toBeInTheDocument();
      expect(screen.getByText('Call ID')).toBeInTheDocument();
      expect(screen.getByText('Call Timestamp')).toBeInTheDocument();
      expect(screen.getByText('CS Name')).toBeInTheDocument();
      expect(screen.getByText('Nama Nasabah')).toBeInTheDocument();
      expect(screen.getByText('Sentiment Score Nasabah')).toBeInTheDocument();

      const rows = screen.getAllByTestId('monitoring-row');
      expect(rows).toHaveLength(2);

      expect(screen.getByText('CALL-20260828-001')).toBeInTheDocument();
      expect(screen.getByText('Siti Aminah')).toBeInTheDocument();
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('62%')).toBeInTheDocument();
    });

    it('renders 5 skeleton rows in loading state', () => {
      render(
        <CallMonitoringTable
          records={[]}
          isLoading={true}
          error={null}
          sort={{ sortBy: 'callTimestamp', sortDir: 'desc' }}
          onSort={vi.fn()}
          onRetry={vi.fn()}
        />
      );

      const skeletons = screen.getAllByTestId('skeleton-row');
      expect(skeletons).toHaveLength(5);
    });

    it('renders error message and triggers onRetry button', () => {
      const onRetry = vi.fn();
      render(
        <CallMonitoringTable
          records={[]}
          isLoading={false}
          error="Gagal terhubung ke database backend"
          sort={{ sortBy: 'callTimestamp', sortDir: 'desc' }}
          onSort={vi.fn()}
          onRetry={onRetry}
        />
      );

      expect(screen.getByTestId('table-error-state')).toBeInTheDocument();
      expect(screen.getByText('Gagal terhubung ke database backend')).toBeInTheDocument();

      const retryBtn = screen.getByRole('button', { name: /Coba Lagi/i });
      fireEvent.click(retryBtn);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('renders empty state message with active filter', () => {
      render(
        <CallMonitoringTable
          records={[]}
          isLoading={false}
          error={null}
          sort={{ sortBy: 'callTimestamp', sortDir: 'desc' }}
          onSort={vi.fn()}
          onRetry={vi.fn()}
          hasActiveFilter={true}
        />
      );

      expect(screen.getByTestId('table-empty-state')).toBeInTheDocument();
      expect(
        screen.getByText('Tidak ada data yang cocok dengan filter yang dipilih.')
      ).toBeInTheDocument();
    });

    it('renders empty state message without active filter', () => {
      render(
        <CallMonitoringTable
          records={[]}
          isLoading={false}
          error={null}
          sort={{ sortBy: 'callTimestamp', sortDir: 'desc' }}
          onSort={vi.fn()}
          onRetry={vi.fn()}
          hasActiveFilter={false}
        />
      );

      expect(screen.getByTestId('table-empty-state')).toBeInTheDocument();
      expect(screen.getByText('Belum ada data monitoring.')).toBeInTheDocument();
    });

    it('handles column sorting click and renders sort indicator correctly', () => {
      const onSort = vi.fn();
      const { rerender } = render(
        <CallMonitoringTable
          records={mockRecords}
          isLoading={false}
          error={null}
          sort={{ sortBy: 'customerName', sortDir: 'asc' }}
          onSort={onSort}
          onRetry={vi.fn()}
        />
      );

      const customerHeader = screen.getByRole('button', {
        name: /Urutkan berdasarkan Nama Nasabah/i,
      });
      fireEvent.click(customerHeader);
      expect(onSort).toHaveBeenCalledWith('customerName');

      expect(screen.getByTestId('sort-asc')).toBeInTheDocument();

      rerender(
        <CallMonitoringTable
          records={mockRecords}
          isLoading={false}
          error={null}
          sort={{ sortBy: 'customerName', sortDir: 'desc' }}
          onSort={onSort}
          onRetry={vi.fn()}
        />
      );

      expect(screen.getByTestId('sort-desc')).toBeInTheDocument();
    });
  });
});
