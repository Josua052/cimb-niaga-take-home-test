import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PAGE_SIZE } from '@/constants/monitoring';
import { fetchCallMonitoring } from '../services/callMonitoringService';
import type {
  CallMonitoringRecord,
  PageInfo,
  SentimentCategory,
} from '../types/monitoring.types';

export interface MonitoringFilterState {
  keyword: string;
  startPeriod: string;
  endPeriod: string;
  sentimentCategory?: SentimentCategory;
}

export interface MonitoringSortState {
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export interface UseCallMonitoringReturn {
  records: CallMonitoringRecord[];
  pageInfo: PageInfo | null;
  isLoading: boolean;
  error: string | null;
  filter: MonitoringFilterState;
  sort: MonitoringSortState;
  currentPage: number;
  handleKeywordChange: (keyword: string) => void;
  handlePeriodChange: (startPeriod?: string, endPeriod?: string) => void;
  handleSentimentChange: (category?: SentimentCategory) => void;
  handleSort: (column: string) => void;
  handlePageChange: (newPage: number) => void;
  handleResetFilters: () => void;
  refetch: () => void;
}

const DEBOUNCE_DELAY_MS = 300;

/**
 * Custom hook managing Call Monitoring state, debounced filtering, sorting, and HTTP cancellation.
 */
export function useCallMonitoring(): UseCallMonitoringReturn {
  const [records, setRecords] = useState<CallMonitoringRecord[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filter, setFilter] = useState<MonitoringFilterState>({
    keyword: '',
    startPeriod: '',
    endPeriod: '',
    sentimentCategory: undefined,
  });
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');

  const [sort, setSort] = useState<MonitoringSortState>({
    sortBy: 'callTimestamp',
    sortDir: 'desc',
  });

  const [refetchKey, setRefetchKey] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(filter.keyword);
    }, DEBOUNCE_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [filter.keyword]);

  const executeFetch = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchCallMonitoring(
          {
            keyword: debouncedKeyword || undefined,
            startPeriod: filter.startPeriod || undefined,
            endPeriod: filter.endPeriod || undefined,
            sentimentCategory: filter.sentimentCategory || undefined,
            sortBy: sort.sortBy,
            sortDir: sort.sortDir,
            page: currentPage,
            size: PAGE_SIZE,
          },
          signal
        );

        setRecords(response.data);
        setPageInfo(response.page);
      } catch (err) {
        if (axios.isCancel(err) || (err instanceof Error && err.name === 'CanceledError')) {
          return;
        }
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data.';
        setError(message);
        setRecords([]);
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [debouncedKeyword, filter.startPeriod, filter.endPeriod, filter.sentimentCategory, sort, currentPage]
  );

  useEffect(() => {
    const controller = new AbortController();

    executeFetch(controller.signal);

    return () => {
      controller.abort();
    };
  }, [executeFetch, refetchKey]);

  const handleKeywordChange = useCallback((keyword: string) => {
    setFilter((prev) => ({ ...prev, keyword }));
    setCurrentPage(0);
  }, []);

  const handlePeriodChange = useCallback((startPeriod?: string, endPeriod?: string) => {
    setFilter((prev) => ({
      ...prev,
      startPeriod: startPeriod || '',
      endPeriod: endPeriod || '',
    }));
    setCurrentPage(0);
  }, []);

  const handleSentimentChange = useCallback((category?: SentimentCategory) => {
    setFilter((prev) => ({ ...prev, sentimentCategory: category }));
    setCurrentPage(0);
  }, []);

  const handleSort = useCallback((column: string) => {
    setSort((prev) => {
      if (prev.sortBy === column) {
        return {
          sortBy: column,
          sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        sortBy: column,
        sortDir: 'asc',
      };
    });
    setCurrentPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilter({
      keyword: '',
      startPeriod: '',
      endPeriod: '',
      sentimentCategory: undefined,
    });
    setCurrentPage(0);
  }, []);

  const refetch = useCallback(() => {
    setRefetchKey((prev) => prev + 1);
  }, []);

  return {
    records,
    pageInfo,
    isLoading,
    error,
    filter,
    sort,
    currentPage,
    handleKeywordChange,
    handlePeriodChange,
    handleSentimentChange,
    handleSort,
    handlePageChange,
    handleResetFilters,
    refetch,
  };
}
