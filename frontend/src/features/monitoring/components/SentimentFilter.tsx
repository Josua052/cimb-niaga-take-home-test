import type { ChangeEvent } from 'react';
import { SENTIMENT_CATEGORY, type SentimentCategory } from '@/constants/monitoring';

interface SentimentFilterProps {
  value?: SentimentCategory;
  onChange: (category?: SentimentCategory) => void;
}

/**
 * Dropdown select component for filtering customer sentiment categories.
 */
export function SentimentFilter({ value, onChange }: SentimentFilterProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SentimentCategory | '';
    onChange(val ? val : undefined);
  };

  return (
    <div className="w-full sm:w-auto min-w-[160px]">
      <select
        value={value || ''}
        onChange={handleChange}
        aria-label="Filter Kategori Sentimen"
        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-2xs cursor-pointer font-medium"
      >
        <option value="">Semua Sentimen</option>
        <option value={SENTIMENT_CATEGORY.BELOW_70}>Di bawah 70%</option>
        <option value={SENTIMENT_CATEGORY.AT_OR_ABOVE_70}>70% atau lebih</option>
      </select>
    </div>
  );
}
