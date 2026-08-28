import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterToolbar } from './FilterToolbar';
import { SearchBar } from '@/components/SearchBar';
import { PeriodFilter, getThreeMonthsAgoDate, getTodayDate } from './PeriodFilter';
import { SentimentFilter } from './SentimentFilter';
import { SENTIMENT_CATEGORY } from '@/constants/monitoring';

describe('FilterToolbar and Filter Components', () => {
  describe('SearchBar Component', () => {
    it('renders input with placeholder and handles text input', () => {
      const onChange = vi.fn();
      render(<SearchBar value="Budi" onChange={onChange} placeholder="Cari..." />);

      const input = screen.getByRole('textbox', { name: /Pencarian kata kunci/i });
      expect(input).toHaveValue('Budi');

      fireEvent.change(input, { target: { value: 'Siti' } });
      expect(onChange).toHaveBeenCalledWith('Siti');
    });

    it('clears text when clear button is clicked', () => {
      const onChange = vi.fn();
      render(<SearchBar value="Budi" onChange={onChange} />);

      const clearButton = screen.getByRole('button', { name: /Hapus teks pencarian/i });
      fireEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  describe('PeriodFilter Component', () => {
    it('calculates 3-month bounded dates properly without timezone drift', () => {
      const refDate = new Date('2026-08-28T00:00:00Z');
      const minDate = getThreeMonthsAgoDate(refDate);
      const todayDate = getTodayDate(refDate);

      expect(minDate).toBe('2026-05-28');
      expect(todayDate).toBe('2026-08-28');
    });

    it('renders start and end date inputs with correct bounds and triggers onChange', () => {
      const onChange = vi.fn();
      render(
        <PeriodFilter
          startPeriod="2026-06-01"
          endPeriod="2026-06-30"
          onChange={onChange}
        />
      );

      const startInput = screen.getByLabelText(/Tanggal Mulai Periode/i);
      const endInput = screen.getByLabelText(/Tanggal Akhir Periode/i);

      expect(startInput).toHaveValue('2026-06-01');
      expect(endInput).toHaveValue('2026-06-30');

      fireEvent.change(startInput, { target: { value: '2026-06-05' } });
      expect(onChange).toHaveBeenCalledWith('2026-06-05', '2026-06-30');

      const resetButton = screen.getByRole('button', { name: /Reset Periode Tanggal/i });
      fireEvent.click(resetButton);
      expect(onChange).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('SentimentFilter Component', () => {
    it('renders options and triggers onChange when option changes', () => {
      const onChange = vi.fn();
      render(<SentimentFilter value={undefined} onChange={onChange} />);

      const select = screen.getByRole('combobox', { name: /Filter Kategori Sentimen/i });
      expect(select).toHaveValue('');

      fireEvent.change(select, { target: { value: SENTIMENT_CATEGORY.BELOW_70 } });
      expect(onChange).toHaveBeenCalledWith(SENTIMENT_CATEGORY.BELOW_70);

      fireEvent.change(select, { target: { value: '' } });
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('FilterToolbar Integration', () => {
    it('renders all filters and shows reset button only when a filter is active', () => {
      const onKeywordChange = vi.fn();
      const onPeriodChange = vi.fn();
      const onSentimentChange = vi.fn();
      const onResetAll = vi.fn();

      const { rerender } = render(
        <FilterToolbar
          filter={{
            keyword: '',
            startPeriod: '',
            endPeriod: '',
            sentimentCategory: undefined,
          }}
          onKeywordChange={onKeywordChange}
          onPeriodChange={onPeriodChange}
          onSentimentChange={onSentimentChange}
          onResetAll={onResetAll}
        />
      );

      expect(screen.queryByRole('button', { name: /Reset Semua Filter/i })).not.toBeInTheDocument();

      rerender(
        <FilterToolbar
          filter={{
            keyword: 'Budi',
            startPeriod: '',
            endPeriod: '',
            sentimentCategory: undefined,
          }}
          onKeywordChange={onKeywordChange}
          onPeriodChange={onPeriodChange}
          onSentimentChange={onSentimentChange}
          onResetAll={onResetAll}
        />
      );

      const resetBtn = screen.getByRole('button', { name: /Reset Semua Filter/i });
      expect(resetBtn).toBeInTheDocument();

      fireEvent.click(resetBtn);
      expect(onResetAll).toHaveBeenCalledTimes(1);
    });
  });
});
