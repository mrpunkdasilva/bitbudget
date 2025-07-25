import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterArea } from './index';

// Mock the categories data
vi.mock('../../data/categories', () => ({
  categories: {
    food: { title: 'Alimentação', color: '#FF6961', expense: true },
    rent: { title: 'Aluguel', color: '#8884FF', expense: true },
    salary: { title: 'Salário', color: '#4CAF50', expense: false },
  },
}));

describe('FilterArea Component', () => {
  const onFilterChangeMock = vi.fn();

  beforeEach(() => {
    onFilterChangeMock.mockClear();
  });

  it('renders with collapsed state initially', () => {
    render(<FilterArea onFilterChange={onFilterChangeMock} />);

    // Title should be visible
    expect(screen.getByText('Filtrar Transações')).toBeInTheDocument();

    // Toggle button should be visible
    expect(screen.getByText('Mostrar Filtros')).toBeInTheDocument();

    // Filter fields should not be visible
    expect(screen.queryByText('Buscar por texto')).not.toBeInTheDocument();
  });

  it('expands when toggle button is clicked', () => {
    render(<FilterArea onFilterChange={onFilterChangeMock} />);

    // Click the toggle button
    fireEvent.click(screen.getByText('Mostrar Filtros'));

    // Filter fields should now be visible
    expect(screen.getByText('Buscar por texto')).toBeInTheDocument();
    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Valor Mínimo')).toBeInTheDocument();
    expect(screen.getByText('Valor Máximo')).toBeInTheDocument();
    expect(screen.getByText('Data Inicial')).toBeInTheDocument();
    expect(screen.getByText('Data Final')).toBeInTheDocument();

    // Button text should change
    expect(screen.getByText('Ocultar Filtros')).toBeInTheDocument();
  });

  it('calls onFilterChange when filters are updated', () => {
    render(<FilterArea onFilterChange={onFilterChangeMock} />);

    // Expand the filter area
    fireEvent.click(screen.getByText('Mostrar Filtros'));

    // Initial call with default values
    expect(onFilterChangeMock).toHaveBeenCalledWith({
      searchText: '',
      category: '',
      minValue: null,
      maxValue: null,
      startDate: null,
      endDate: null,
    });

    // Update search text
    fireEvent.change(screen.getByPlaceholderText('Buscar por título...'), {
      target: { value: 'Aluguel' },
    });

    // Check if onFilterChange was called with updated values
    expect(onFilterChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        searchText: 'Aluguel',
        category: '',
        minValue: null,
        maxValue: null,
        startDate: null,
        endDate: null,
      })
    );
  });

  it('clears all filters when clear button is clicked', () => {
    render(<FilterArea onFilterChange={onFilterChangeMock} />);

    // Expand the filter area
    fireEvent.click(screen.getByText('Mostrar Filtros'));

    // Set some filter values
    fireEvent.change(screen.getByPlaceholderText('Buscar por título...'), {
      target: { value: 'Aluguel' },
    });

    fireEvent.change(screen.getByPlaceholderText('R$ 0,00'), {
      target: { value: '100' },
    });

    // Clear the filters
    fireEvent.click(screen.getByText('Limpar Filtros'));

    // Check if all inputs are cleared
    expect(screen.getByPlaceholderText('Buscar por título...')).toHaveValue('');
    expect(screen.getByPlaceholderText('R$ 0,00')).toHaveValue('');

    // Check if onFilterChange was called with default values
    expect(onFilterChangeMock).toHaveBeenCalledWith({
      searchText: '',
      category: '',
      minValue: null,
      maxValue: null,
      startDate: null,
      endDate: null,
    });
  });
});
