import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_SIZE } from '@/constants/monitoring';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/**
 * Reusable pagination component with Previous/Next controls and page indicators.
 */
export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize = PAGE_SIZE,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const isFirstPage = currentPage === 0;
  const isLastPage = totalPages === 0 || currentPage >= totalPages - 1;
  const displayCurrentPage = totalPages === 0 ? 0 : currentPage + 1;
  const displayTotalPages = totalPages;

  const startRecord = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endRecord = totalElements !== undefined ? Math.min((currentPage + 1) * pageSize, totalElements) : 0;

  const handlePrevious = () => {
    if (!isFirstPage && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      data-testid="pagination-container"
      aria-label="Navigasi Halaman"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 bg-white"
    >
      {/* Total records summary */}
      <div className="text-xs text-gray-500 order-2 sm:order-1">
        {totalElements !== undefined ? (
          <span>
            Menampilkan <span className="font-semibold text-gray-700">{totalElements === 0 ? 0 : startRecord}</span>
            {' - '}
            <span className="font-semibold text-gray-700">{endRecord}</span> dari{' '}
            <span className="font-semibold text-gray-700">{totalElements}</span> total data
          </span>
        ) : (
          <span>Halaman {displayCurrentPage} dari {displayTotalPages}</span>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstPage || isLoading}
          aria-label="Halaman Sebelumnya"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Page indicator info */}
        <div className="text-xs font-medium text-gray-700 px-1" data-testid="page-indicator">
          Halaman <span className="font-bold text-gray-900">{displayCurrentPage}</span> dari{' '}
          <span className="font-bold text-gray-900">{displayTotalPages}</span>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isLastPage || isLoading}
          aria-label="Halaman Berikutnya"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors shadow-2xs cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
