import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCallMonitoring } from './useCallMonitoring';
import * as service from '../services/callMonitoringService';
import type { PagedResponse, CallMonitoringRecord } from '../types/monitoring.types';

describe('useCallMonitoring Hook', () => {
  const mockSuccessResponse: PagedResponse<CallMonitoringRecord> = {
    data: [
      {
        no: 1,
        id: 1,
        callId: 'CALL-001',
        callTimestamp: '2026-08-28T09:00:00+07:00',
        csName: 'Siti Aminah',
        customerName: 'Budi Santoso',
        sentimentScore: 88,
      },
    ],
    page: {
      currentPage: 0,
      totalPages: 2,
      totalElements: 10,
      size: 5,
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches call monitoring data on initial mount with AbortSignal', async () => {
    const fetchSpy = vi
      .spyOn(service, 'fetchCallMonitoring')
      .mockResolvedValueOnce(mockSuccessResponse);

    const { result } = renderHook(() => useCallMonitoring());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      {
        keyword: undefined,
        startPeriod: undefined,
        endPeriod: undefined,
        sentimentCategory: undefined,
        sortBy: 'callTimestamp',
        sortDir: 'desc',
        page: 0,
        size: 5,
      },
      expect.any(AbortSignal)
    );
    expect(result.current.records).toEqual(mockSuccessResponse.data);
    expect(result.current.pageInfo).toEqual(mockSuccessResponse.page);
    expect(result.current.error).toBeNull();
  });

  it('debounces keyword change by 300ms before triggering API fetch and resets page', async () => {
    const fetchSpy = vi
      .spyOn(service, 'fetchCallMonitoring')
      .mockResolvedValue(mockSuccessResponse);

    const { result } = renderHook(() => useCallMonitoring());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handlePageChange(1);
    });

    await waitFor(() => {
      expect(result.current.currentPage).toBe(1);
    });

    act(() => {
      result.current.handleKeywordChange('Budi');
    });

    // Immediate state reflection for controlled input and page reset
    expect(result.current.currentPage).toBe(0);
    expect(result.current.filter.keyword).toBe('Budi');

    // Wait for debounce timer (300ms) to trigger API call
    await waitFor(
      () => {
        expect(fetchSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({
            keyword: 'Budi',
            page: 0,
          }),
          expect.any(AbortSignal)
        );
      },
      { timeout: 1000 }
    );
  });

  it('resets currentPage to 0 when period filter changes', async () => {
    vi.spyOn(service, 'fetchCallMonitoring').mockResolvedValue(mockSuccessResponse);

    const { result } = renderHook(() => useCallMonitoring());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handlePageChange(1);
    });

    await waitFor(() => {
      expect(result.current.currentPage).toBe(1);
    });

    act(() => {
      result.current.handlePeriodChange('2026-06-01', '2026-06-30');
    });

    await waitFor(() => {
      expect(result.current.currentPage).toBe(0);
      expect(result.current.filter.startPeriod).toBe('2026-06-01');
      expect(result.current.filter.endPeriod).toBe('2026-06-30');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('resets currentPage to 0 when sentiment category changes', async () => {
    vi.spyOn(service, 'fetchCallMonitoring').mockResolvedValue(mockSuccessResponse);

    const { result } = renderHook(() => useCallMonitoring());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleSentimentChange('BELOW_70');
    });

    await waitFor(() => {
      expect(result.current.currentPage).toBe(0);
      expect(result.current.filter.sentimentCategory).toBe('BELOW_70');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('toggles sort direction when sorting on the same column and resets page', async () => {
    vi.spyOn(service, 'fetchCallMonitoring').mockResolvedValue(mockSuccessResponse);

    const { result } = renderHook(() => useCallMonitoring());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sort).toEqual({ sortBy: 'callTimestamp', sortDir: 'desc' });

    act(() => {
      result.current.handleSort('callTimestamp');
    });

    await waitFor(() => {
      expect(result.current.sort).toEqual({ sortBy: 'callTimestamp', sortDir: 'asc' });
      expect(result.current.currentPage).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleSort('customerName');
    });

    await waitFor(() => {
      expect(result.current.sort).toEqual({ sortBy: 'customerName', sortDir: 'asc' });
      expect(result.current.currentPage).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('preserves filters and sort when changing page', async () => {
    vi.spyOn(service, 'fetchCallMonitoring').mockResolvedValue(mockSuccessResponse);

    const { result } = renderHook(() => useCallMonitoring());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handlePeriodChange('2026-06-01', '2026-06-30');
      result.current.handleSort('sentimentScore');
    });

    await waitFor(() => {
      expect(result.current.filter.startPeriod).toBe('2026-06-01');
      expect(result.current.sort.sortBy).toBe('sentimentScore');
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handlePageChange(2);
    });

    await waitFor(() => {
      expect(result.current.currentPage).toBe(2);
      expect(result.current.filter.startPeriod).toBe('2026-06-01');
      expect(result.current.sort.sortBy).toBe('sentimentScore');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('handles error state when service fetch fails and provides refetch functionality', async () => {
    vi.spyOn(service, 'fetchCallMonitoring')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockSuccessResponse);

    const { result } = renderHook(() => useCallMonitoring());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.records).toEqual([]);

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.records).toEqual(mockSuccessResponse.data);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
