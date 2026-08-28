import { cn } from '@/utils/cn';
import { ArrowUp, ArrowDown, ArrowUpDown, AlertCircle, RefreshCw, Inbox } from 'lucide-react';
import { PAGE_SIZE } from '@/constants/monitoring';
import { formatTimestamp } from '@/utils/format';
import { SentimentBadge } from './SentimentBadge';
import type { CallMonitoringRecord } from '../types/monitoring.types';
import type { MonitoringSortState } from '../hooks/useCallMonitoring';

interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
  align?: 'left' | 'center' | 'right';
}

const COLUMNS: ColumnDef[] = [
  { key: 'no', label: 'No.', sortable: false, align: 'center' },
  { key: 'callId', label: 'Call ID', sortable: true, align: 'left' },
  { key: 'callTimestamp', label: 'Call Timestamp', sortable: true, align: 'left' },
  { key: 'csName', label: 'CS Name', sortable: true, align: 'left' },
  { key: 'customerName', label: 'Nama Nasabah', sortable: true, align: 'left' },
  { key: 'sentimentScore', label: 'Sentiment Score Nasabah', sortable: true, align: 'center' },
];

interface CallMonitoringTableProps {
  records: CallMonitoringRecord[];
  isLoading: boolean;
  error: string | null;
  sort: MonitoringSortState;
  onSort: (column: string) => void;
  onRetry: () => void;
  hasActiveFilter?: boolean;
}

/**
 * Interactive table displaying call records with sorting, skeleton loading, and empty states.
 */
export function CallMonitoringTable({
  records,
  isLoading,
  error,
  sort,
  onSort,
  onRetry,
  hasActiveFilter = false,
}: CallMonitoringTableProps) {
  const renderSortIcon = (columnKey: string) => {
    if (sort.sortBy === columnKey) {
      return sort.sortDir === 'asc' ? (
        <ArrowUp className="w-3.5 h-3.5 text-red-600 shrink-0" data-testid="sort-asc" />
      ) : (
        <ArrowDown className="w-3.5 h-3.5 text-red-600 shrink-0" data-testid="sort-desc" />
      );
    }
    return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 shrink-0" data-testid="sort-neutral" />;
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" data-testid="call-monitoring-table">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-600",
                    {
                      'text-center': col.align === 'center',
                      'text-right': col.align === 'right',
                      'text-left': col.align === 'left' || !col.align,
                    }
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className="group inline-flex items-center justify-inherit gap-1.5 hover:text-gray-900 focus:outline-none focus:text-gray-900 font-semibold cursor-pointer"
                      aria-label={`Urutkan berdasarkan ${col.label}`}
                    >
                      <span>{col.label}</span>
                      {renderSortIcon(col.key)}
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {isLoading ? (
              // 1. Loading State: 5 Skeleton Rows
              Array.from({ length: PAGE_SIZE }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} data-testid="skeleton-row" className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="h-4 w-6 bg-gray-200 rounded mx-auto" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="h-6 w-14 bg-gray-200 rounded-full mx-auto" />
                  </td>
                </tr>
              ))
            ) : error ? (
              // 2. Error State
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center" data-testid="table-error-state">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Gagal Memuat Data</p>
                    <p className="text-xs text-gray-500 mb-4">{error}</p>
                    <button
                      type="button"
                      onClick={onRetry}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Coba Lagi</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              // 3. Empty State
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center" data-testid="table-empty-state">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      {hasActiveFilter
                        ? 'Tidak ada data yang cocok dengan filter yang dipilih.'
                        : 'Belum ada data monitoring.'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {hasActiveFilter
                        ? 'Coba sesuaikan kata kunci atau rentang periode tanggal Anda.'
                        : 'Data panggilan akan otomatis ditampilkan saat tersedia di sistem.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              records.map((record) => (
                <tr
                  key={record.id}
                  data-testid="monitoring-row"
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-4 py-3.5 text-center text-xs text-gray-500 font-medium">
                    {record.no}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-gray-900">
                    {record.callId}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                    {formatTimestamp(record.callTimestamp)}
                  </td>
                  <td className="px-4 py-3.5 text-xs font-medium text-gray-800">
                    {record.csName}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-800">
                    {record.customerName}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <SentimentBadge score={record.sentimentScore} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
