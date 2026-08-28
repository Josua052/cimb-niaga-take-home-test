import { useMemo, type ChangeEvent } from 'react';
import { Calendar, RotateCcw } from 'lucide-react';
import { MAX_PERIOD_MONTHS } from '@/constants/monitoring';
import { formatDateToLocalISO } from '@/utils/format';

interface PeriodFilterProps {
  startPeriod: string;
  endPeriod: string;
  onChange: (startPeriod?: string, endPeriod?: string) => void;
}

/**
 * Calculates date string (YYYY-MM-DD) for 3 months prior to reference date in local timezone.
 */
export function getThreeMonthsAgoDate(referenceDate: Date = new Date()): string {
  const d = new Date(referenceDate);
  d.setMonth(d.getMonth() - MAX_PERIOD_MONTHS);
  return formatDateToLocalISO(d);
}

/**
 * Calculates today's date string (YYYY-MM-DD) in local timezone.
 */
export function getTodayDate(referenceDate: Date = new Date()): string {
  return formatDateToLocalISO(referenceDate);
}

/**
 * Period date filter component bounded to the last 3 months with timezone safety.
 */
export function PeriodFilter({
  startPeriod,
  endPeriod,
  onChange,
}: PeriodFilterProps) {
  const minDate = useMemo(() => getThreeMonthsAgoDate(), []);
  const maxDate = useMemo(() => getTodayDate(), []);

  const handleStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val || undefined, endPeriod || undefined);
  };

  const handleEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(startPeriod || undefined, val || undefined);
  };

  const handleResetPeriod = () => {
    onChange(undefined, undefined);
  };

  const hasPeriod = Boolean(startPeriod || endPeriod);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <input
            type="date"
            value={startPeriod}
            min={minDate}
            max={endPeriod || maxDate}
            onChange={handleStartChange}
            aria-label="Tanggal Mulai Periode"
            className="text-xs text-gray-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-red-500 rounded px-1 py-0.5"
          />
          <span className="text-gray-400 font-medium">-</span>
          <input
            type="date"
            value={endPeriod}
            min={startPeriod || minDate}
            max={maxDate}
            onChange={handleEndChange}
            aria-label="Tanggal Akhir Periode"
            className="text-xs text-gray-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-red-500 rounded px-1 py-0.5"
          />
        </div>
      </div>

      {hasPeriod && (
        <button
          type="button"
          onClick={handleResetPeriod}
          aria-label="Reset Periode Tanggal"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Hapus filter periode"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
