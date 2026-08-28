import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/services/apiClient';
import {
  cleanParams,
  extractErrorMessage,
  fetchCallMonitoring,
} from './callMonitoringService';
import type { PagedResponse, CallMonitoringRecord } from '../types/monitoring.types';

describe('callMonitoringService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('cleanParams', () => {
    it('omits undefined, null, and empty string properties', () => {
      const input = {
        keyword: '',
        startPeriod: '2026-06-01',
        endPeriod: undefined,
        sentimentCategory: undefined,
        sortBy: 'callTimestamp',
        sortDir: 'desc' as const,
        page: 0,
        size: 5,
      };

      const result = cleanParams(input);

      expect(result).toEqual({
        startPeriod: '2026-06-01',
        sortBy: 'callTimestamp',
        sortDir: 'desc',
        page: 0,
        size: 5,
      });
      expect(result).not.toHaveProperty('keyword');
      expect(result).not.toHaveProperty('endPeriod');
      expect(result).not.toHaveProperty('sentimentCategory');
    });
  });

  describe('extractErrorMessage', () => {
    it('returns custom error message from backend response when available', () => {
      const mockAxiosError = {
        isAxiosError: true,
        response: {
          data: {
            status: 'BAD_REQUEST',
            message: 'startPeriod cannot be older than 3 months from today',
          },
        },
      };

      const message = extractErrorMessage(mockAxiosError);
      expect(message).toBe('startPeriod cannot be older than 3 months from today');
    });

    it('returns fallback generic message for unexpected non-axios error', () => {
      const genericError = new Error('Unknown error');
      const message = extractErrorMessage(genericError);
      expect(message).toBe('Terjadi kesalahan saat memuat data monitoring panggilan.');
    });
  });

  describe('fetchCallMonitoring', () => {
    it('successfully fetches paginated call monitoring data from API with AbortSignal', async () => {
      const mockData: PagedResponse<CallMonitoringRecord> = {
        data: [
          {
            no: 1,
            id: 101,
            callId: 'CALL-20260827-001',
            callTimestamp: '2026-08-27T10:00:00+07:00',
            csName: 'Budi Santoso',
            customerName: 'Ahmad Dahlan',
            sentimentScore: 85,
          },
        ],
        page: {
          currentPage: 0,
          totalPages: 1,
          totalElements: 1,
          size: 5,
        },
      };

      const controller = new AbortController();
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        data: mockData,
      });

      const response = await fetchCallMonitoring(
        {
          keyword: 'Budi',
          page: 0,
          size: 5,
        },
        controller.signal
      );

      expect(getSpy).toHaveBeenCalledWith('/call-monitoring', {
        params: {
          keyword: 'Budi',
          page: 0,
          size: 5,
        },
        signal: controller.signal,
      });
      expect(response).toEqual(mockData);
      expect(response.data).toHaveLength(1);
      expect(response.data[0].callId).toBe('CALL-20260827-001');
    });

    it('throws formatted error when API request fails', async () => {
      vi.spyOn(apiClient, 'get').mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            message: 'Both startPeriod and endPeriod must be provided together',
          },
        },
      });

      await expect(
        fetchCallMonitoring({
          startPeriod: '2026-07-01',
        })
      ).rejects.toThrow('Both startPeriod and endPeriod must be provided together');
    });
  });
});
