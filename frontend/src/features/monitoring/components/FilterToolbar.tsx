import { RotateCcw } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { PeriodFilter } from './PeriodFilter';
import { SentimentFilter } from './SentimentFilter';
import type { MonitoringFilterState } from '../hooks/useCallMonitoring';
import type { SentimentCategory } from '@/constants/monitoring';

interface FilterToolbarProps {
  filter: MonitoringFilterState;
  onKeywordChange: (keyword: string) => void;
  onPeriodChange: (startPeriod?: string, endPeriod?: string) => void;
  onSentimentChange: (category?: SentimentCategory) => void;
  onResetAll: () => void;
}

/**
 * Composite toolbar unifying keyword search, date range filter, and sentiment dropdown.
 */
export function FilterToolbar({
  filter,
  onKeywordChange,
  onPeriodChange,
  onSentimentChange,
  onResetAll,
}: FilterToolbarProps) {
  const isAnyFilterActive = Boolean(
    filter.keyword ||
    filter.startPeriod ||
    filter.endPeriod ||
    filter.sentimentCategory
  );

  return (
    <div
      data-testid="filter-toolbar"
      className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 bg-gray-50/80 rounded-xl border border-gray-200"
    >
      {/* Search Input */}
      <div className="flex-1">
        <SearchBar
          value={filter.keyword}
          onChange={onKeywordChange}
          placeholder="Cari berdasarkan Call ID, CS, atau Nasabah..."
        />
      </div>

      {/* Filters Group */}
      <div className="flex flex-wrap items-center gap-3">
        <PeriodFilter
          startPeriod={filter.startPeriod}
          endPeriod={filter.endPeriod}
          onChange={onPeriodChange}
        />

        <SentimentFilter
          value={filter.sentimentCategory}
          onChange={onSentimentChange}
        />

        {/* Global Atomic Reset Button */}
        {isAnyFilterActive && (
          <button
            type="button"
            onClick={onResetAll}
            aria-label="Reset Semua Filter"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>
    </div>
  );
}
