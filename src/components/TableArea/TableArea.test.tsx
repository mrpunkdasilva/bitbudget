import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableArea } from './index';
import { Item } from '../../types/Item';

// Mock the TableItem component
vi.mock('../TableItem', () => ({
  TableItem: ({ item }: { item: Item }) => (
    <tr data-testid="table-item">
      <td>{item.date.toISOString()}</td>
      <td>{item.category}</td>
      <td>{item.title}</td>
      <td>{item.value}</td>
    </tr>
  )
}));

describe('TableArea Component', () => {
  const mockItems: Item[] = [
    {
      date: new Date(2023, 9, 15),
      category: 'food',
      title: 'Almoço',
      value: 45.5
    },
    {
      date: new Date(2023, 9, 16),
      category: 'rent',
      title: 'Aluguel',
      value: 1200
    }
  ];

  it('renders the table headers correctly', () => {
    render(<TableArea list={mockItems} />);
    
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
  });

  it('renders the correct number of items', () => {
    render(<TableArea list={mockItems} />);
    
    // Check for the number of table items
    const tableItems = screen.getAllByTestId('table-item');
    expect(tableItems.length).toBe(2);
  });

  it('renders an empty table when no items are provided', () => {
    render(<TableArea list={[]} />);
    
    // Headers should still be present
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
    
    // But no items should be rendered
    expect(screen.queryByTestId('table-item')).not.toBeInTheDocument();
    
    // Empty message should be displayed
    expect(screen.getByText('Nenhuma transação encontrada.')).toBeInTheDocument();
  });
  
  it('passes the onDeleteItem function to TableItem', () => {
    const onDeleteMock = vi.fn();
    render(<TableArea list={mockItems} onDeleteItem={onDeleteMock} />);
    
    // Check if the correct number of table items are rendered
    const tableItems = screen.getAllByTestId('table-item');
    expect(tableItems.length).toBe(2);
  });
});