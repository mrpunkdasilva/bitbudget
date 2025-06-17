import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportArea } from './index';
import { Item } from '../../types/Item';

// Mock the NotificationManager context
vi.mock('../NotificationManager', () => ({
  useNotification: () => ({
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    addNotification: vi.fn(),
    NotificationContainer: () => null
  })
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('ExportArea Component', () => {
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

  // Mock document.createElement, appendChild, and removeChild
  const mockLink = {
    href: '',
    download: '',
    click: vi.fn()
  };

  beforeEach(() => {
    vi.spyOn(document, 'createElement').mockImplementation(() => mockLink as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
  });

  it('renders the export area with title', () => {
    render(<ExportArea list={mockItems} />);
    
    expect(screen.getByText('Exportar Dados')).toBeInTheDocument();
  });

  it('shows the correct number of transactions to export', () => {
    render(<ExportArea list={mockItems} />);
    
    expect(screen.getByText('Exportar 2 Transações')).toBeInTheDocument();
  });

  it('disables the export button when there are no items', () => {
    render(<ExportArea list={[]} />);
    
    const exportButton = screen.getByText('Exportar 0 Transações');
    expect(exportButton).toBeDisabled();
    expect(exportButton).toHaveAttribute('title', 'Não há dados para exportar');
  });

  it('allows switching between CSV and JSON formats', () => {
    render(<ExportArea list={mockItems} />);
    
    // Default should be CSV
    const csvRadio = screen.getByLabelText('CSV (Excel)');
    const jsonRadio = screen.getByLabelText('JSON');
    
    expect(csvRadio).toBeChecked();
    expect(jsonRadio).not.toBeChecked();
    
    // Switch to JSON
    fireEvent.click(jsonRadio);
    
    expect(csvRadio).not.toBeChecked();
    expect(jsonRadio).toBeChecked();
  });

  it('exports data when the export button is clicked', () => {
    render(<ExportArea list={mockItems} />);
    
    // Click the export button
    fireEvent.click(screen.getByText('Exportar 2 Transações'));
    
    // Check if the link was created and clicked
    expect(mockLink.click).toHaveBeenCalled();
    expect(mockLink.download).toBe('bitbudget-transacoes.csv');
    
    // Switch to JSON and export again
    fireEvent.click(screen.getByLabelText('JSON'));
    fireEvent.click(screen.getByText('Exportar 2 Transações'));
    
    expect(mockLink.download).toBe('bitbudget-transacoes.json');
  });
});