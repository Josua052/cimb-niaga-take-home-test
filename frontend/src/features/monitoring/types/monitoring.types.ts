/**
 * Sentiment category enumeration for filtering calls.
 */
export type SentimentCategory = 'BELOW_70' | 'AT_OR_ABOVE_70';

/**
 * Representation of a single call monitoring record from backend DTO.
 */
export interface CallMonitoringRecord {
  no: number;
  id: number;
  callId: string;
  callTimestamp: string;
  csName: string;
  customerName: string;
  sentimentScore: number;
}

/**
 * Pagination metadata returned from the backend.
 */
export interface PageInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
}

/**
 * Generic paged wrapper for backend API list responses.
 */
export interface PagedResponse<T> {
  data: T[];
  page: PageInfo;
}

/**
 * Query parameters for fetching call monitoring records.
 */
export interface CallMonitoringParams {
  keyword?: string;
  startPeriod?: string;
  endPeriod?: string;
  sentimentCategory?: SentimentCategory;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

/**
 * Standard structured API error response.
 */
export interface ApiError {
  status?: string;
  message: string;
  timestamp?: string;
}
