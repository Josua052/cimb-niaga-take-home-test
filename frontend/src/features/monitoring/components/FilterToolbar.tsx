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
      className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5 p-4 sm:p-4.5 bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs"
    >
      {/* Search Input */}
      <div className="flex-1 w-full">
        <SearchBar
          value={filter.keyword}
          onChange={onKeywordChange}
          placeholder="Cari berdasarkan Call ID, CS, atau Nasabah..."
        />
      </div>

      {/* Filters & Actions Group */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
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
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>
    </div>
  );
}
