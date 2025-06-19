import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableItem } from './index';
import { Item } from '../../types/Item';

// Mock formatDate helper
vi.mock('../../helpers/dateFilter', () => ({
  formatDate: () => '15/10/2023',
}));

// Mock formatCurrency helper
vi.mock('../../helpers/formatters', () => ({
  formatCurrency: (value: number) => `R$ ${value.toFixed(2)}`,
}));

// Mock categories
vi.mock('../../data/categories', () => ({
  categories: {
    food: { title: 'Alimentação', color: '#FF6961', expense: true },
    salary: { title: 'Salário', color: '#4CAF50', expense: false },
  },
}));

describe('TableItem Component', () => {
  const mockExpenseItem: Item = {
    date: new Date(2023, 9, 15),
    category: 'food',
    title: 'Almoço',
    value: 45.5,
  };

  const mockIncomeItem: Item = {
    date: new Date(2023, 9, 20),
    category: 'salary',
    title: 'Salário',
    value: 3000,
  };

  const onDeleteMock = vi.fn();

  beforeEach(() => {
    onDeleteMock.mockClear();
  });

  it('renders expense item correctly', () => {
    render(<TableItem item={mockExpenseItem} onDelete={onDeleteMock} />);

    expect(screen.getByText('15/10/2023')).toBeInTheDocument();
    expect(screen.getByText('Alimentação')).toBeInTheDocument();
    expect(screen.getByText('Almoço')).toBeInTheDocument();
    expect(screen.getByText('R$ 45.50')).toBeInTheDocument();
  });

  it('renders income item correctly', () => {
    render(<TableItem item={mockIncomeItem} onDelete={onDeleteMock} />);

    expect(screen.getByText('15/10/2023')).toBeInTheDocument();
    expect(screen.getByText('Salário')).toBeInTheDocument();
    expect(screen.getByText('R$ 3000.00')).toBeInTheDocument();
  });

  it('shows confirmation dialog when delete button is clicked', () => {
    render(<TableItem item={mockExpenseItem} onDelete={onDeleteMock} />);

    // Initially, confirmation buttons should not be visible
    expect(screen.queryByText('Sim')).not.toBeInTheDocument();
    expect(screen.queryByText('Não')).not.toBeInTheDocument();

    // Click the delete button
    fireEvent.click(screen.getByLabelText('Excluir Almoço'));

    // Confirmation buttons should now be visible
    expect(screen.getByText('Sim')).toBeInTheDocument();
    expect(screen.getByText('Não')).toBeInTheDocument();
  });

  it('calls onDelete when confirmation is confirmed', async () => {
    vi.useFakeTimers();

    render(<TableItem item={mockExpenseItem} onDelete={onDeleteMock} />);

    // Click the delete button
    fireEvent.click(screen.getByLabelText('Excluir Almoço'));

    // Click the confirm button
    fireEvent.click(screen.getByText('Sim'));

    // Fast-forward timers
    vi.runAllTimers();

    // onDelete should have been called with the item
    expect(onDeleteMock).toHaveBeenCalledWith(mockExpenseItem);

    vi.useRealTimers();
  });

  it('does not call onDelete when confirmation is cancelled', () => {
    render(<TableItem item={mockExpenseItem} onDelete={onDeleteMock} />);

    // Click the delete button
    fireEvent.click(screen.getByLabelText('Excluir Almoço'));

    // Click the cancel button
    fireEvent.click(screen.getByText('Não'));

    // onDelete should not have been called
    expect(onDeleteMock).not.toHaveBeenCalled();

    // Confirmation buttons should be hidden again
    expect(screen.queryByText('Sim')).not.toBeInTheDocument();
    expect(screen.queryByText('Não')).not.toBeInTheDocument();
  });
});
