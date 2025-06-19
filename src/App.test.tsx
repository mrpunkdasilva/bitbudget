import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock the NotificationManager context
vi.mock('./components/NotificationManager', () => ({
  useNotification: () => ({
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    addNotification: vi.fn(),
    NotificationContainer: () => null,
  }),
}));

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>,
}));

describe('App', () => {
  it('renders the financial system header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Sistema Financeiro/i);
    expect(headerElement).toBeInTheDocument();
  });

  it('renders all main components', () => {
    render(<App />);

    // Check for main components
    expect(screen.getByText('BitBudget')).toBeInTheDocument();
    expect(screen.getByText('Análise Financeira')).toBeInTheDocument();
    expect(screen.getByText('Filtrar Transações')).toBeInTheDocument();
    expect(screen.getAllByText('Data')[0]).toBeInTheDocument(); // TableArea header
    expect(screen.getByText('Adicionar')).toBeInTheDocument(); // InputArea button
  });

  it('shows and hides filters when toggle button is clicked', () => {
    render(<App />);

    // Initially, filter fields should not be visible
    expect(screen.queryByText('Buscar por texto')).not.toBeInTheDocument();

    // Click the toggle button
    fireEvent.click(screen.getByText('Mostrar Filtros'));

    // Filter fields should now be visible
    expect(screen.getByText('Buscar por texto')).toBeInTheDocument();
    expect(screen.getAllByText('Categoria')[1]).toBeInTheDocument(); // First one is in the InputArea

    // Click the toggle button again
    fireEvent.click(screen.getByText('Ocultar Filtros'));

    // Filter fields should be hidden again
    expect(screen.queryByText('Buscar por texto')).not.toBeInTheDocument();
  });

  it('renders the export area', () => {
    render(<App />);

    expect(screen.getByText('Exportar Dados')).toBeInTheDocument();
    expect(screen.getByText(/Exportar \d+ Transações/)).toBeInTheDocument();
  });
});
