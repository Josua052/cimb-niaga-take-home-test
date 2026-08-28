import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  it('renders page information with 1-indexed display and record summary', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalElements={25}
        pageSize={5}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByTestId('page-indicator')).toHaveTextContent('Halaman 2 dari 5');
    expect(screen.getByText(/Menampilkan/i)).toHaveTextContent('Menampilkan 6 - 10 dari 25 total data');
  });

  it('disables Previous button on first page (currentPage = 0)', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={0}
        totalPages={5}
        totalElements={25}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /Halaman Sebelumnya/i });
    const nextButton = screen.getByRole('button', { name: /Halaman Berikutnya/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(prevButton);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('disables Next button on last page (currentPage = totalPages - 1)', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={4}
        totalPages={5}
        totalElements={25}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /Halaman Sebelumnya/i });
    const nextButton = screen.getByRole('button', { name: /Halaman Berikutnya/i });

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();

    fireEvent.click(nextButton);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('disables both controls when totalPages is 0 or 1', () => {
    render(
      <Pagination
        currentPage={0}
        totalPages={1}
        totalElements={3}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Halaman Sebelumnya/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Halaman Berikutnya/i })).toBeDisabled();
  });

  it('disables both controls when isLoading is true', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        totalElements={25}
        isLoading={true}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Halaman Sebelumnya/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Halaman Berikutnya/i })).toBeDisabled();
  });

  it('calls onPageChange with decremented page when Previous is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        totalElements={25}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /Halaman Sebelumnya/i });
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with incremented page when Next is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        totalElements={25}
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getByRole('button', { name: /Halaman Berikutnya/i });
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
