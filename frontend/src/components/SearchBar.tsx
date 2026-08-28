import type { ChangeEvent } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Reusable controlled search input with clear button and accessible label.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Cari berdasarkan Call ID, CS, Nasabah...',
  className,
}: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn('relative flex-1 min-w-[220px]', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Pencarian kata kunci"
        className="w-full pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors shadow-2xs"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Hapus teks pencarian"
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
