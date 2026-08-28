import { apiClient } from '@/services/apiClient';
import axios from 'axios';
import type {
  CallMonitoringParams,
  CallMonitoringRecord,
  PagedResponse,
  ApiError,
} from '../types/monitoring.types';

/**
 * Cleans query parameters by removing undefined, null, or empty string values.
 */
export function cleanParams(params: CallMonitoringParams): Record<string, string | number> {
  const cleaned: Record<string, string | number> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  });

  return cleaned;
}

/**
 * Extracts a normalized error message from API or network failures.
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.message) {
      return data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'Terjadi kesalahan saat memuat data monitoring panggilan.';
}

/**
 * Fetches paginated call monitoring records from the backend API.
 */
export async function fetchCallMonitoring(
  params: CallMonitoringParams = {}
): Promise<PagedResponse<CallMonitoringRecord>> {
  try {
    const sanitizedParams = cleanParams(params);
    const response = await apiClient.get<PagedResponse<CallMonitoringRecord>>(
      '/call-monitoring',
      {
        params: sanitizedParams,
      }
    );
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}
