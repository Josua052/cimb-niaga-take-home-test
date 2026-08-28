import { Activity } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FilterToolbar } from '@/features/monitoring/components/FilterToolbar';
import { CallMonitoringTable } from '@/features/monitoring/components/CallMonitoringTable';
import { Pagination } from '@/components/Pagination';
import { useCallMonitoring } from '@/features/monitoring/hooks/useCallMonitoring';
import { PAGE_SIZE } from '@/constants/monitoring';

/**
 * Call Monitoring Page integrating search filters, data table, and pagination controls.
 */
export function MonitoringPage() {
  const {
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
  } = useCallMonitoring();

  const isAnyFilterActive = Boolean(
    filter.keyword ||
    filter.startPeriod ||
    filter.endPeriod ||
    filter.sentimentCategory
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Title & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Supervisor Dashboard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Monitoring Sentimen Panggilan
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pantau performa layanan dan kepuasan nasabah dari seluruh interaksi Customer Service.
            </p>
          </div>
        </div>

        {/* Monitoring Card Container */}
        <section
          data-testid="monitoring-content-container"
          className="bg-white rounded-xl border border-gray-200 shadow-2xs p-4 sm:p-6 space-y-5"
        >
          {/* Section Header */}
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-semibold text-gray-800">
              Daftar Rekaman Monitoring
            </h3>
            <p className="text-xs text-gray-500">
              Data panggilan nasabah diperbarui dari database PostgreSQL dengan filter dan pengurutan dinamis.
            </p>
          </div>

          {/* Filter Toolbar (Search, Period, Sentiment, Reset) */}
          <FilterToolbar
            filter={filter}
            onKeywordChange={handleKeywordChange}
            onPeriodChange={handlePeriodChange}
            onSentimentChange={handleSentimentChange}
            onResetAll={handleResetFilters}
          />

          {/* Call Monitoring Table (3-State Handling & Sorting) */}
          <CallMonitoringTable
            records={records}
            isLoading={isLoading}
            error={error}
            sort={sort}
            onSort={handleSort}
            onRetry={refetch}
            hasActiveFilter={isAnyFilterActive}
          />

          {/* Pagination Controls */}
          {pageInfo && pageInfo.totalPages > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <Pagination
                currentPage={currentPage}
                totalPages={pageInfo.totalPages}
                totalElements={pageInfo.totalElements}
                pageSize={pageInfo.size || PAGE_SIZE}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
