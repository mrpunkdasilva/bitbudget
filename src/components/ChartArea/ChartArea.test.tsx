import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartArea } from './index';
import { Item } from '../../types/Item';
import { categories } from '../../data/categories';

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  CategoryScale: class {},
  LinearScale: class {},
  BarElement: class {},
  Title: class {},
  Tooltip: class {},
  Legend: class {},
  ArcElement: class {}
}));

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>
}));

describe('ChartArea Component', () => {
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
    },
    {
      date: new Date(2023, 9, 20),
      category: 'salary',
      title: 'Salário',
      value: 3000
    }
  ];

  it('renders the chart area with title', () => {
    render(
      <ChartArea 
        income={3000} 
        expense={1245.5} 
        list={mockItems} 
        categories={categories} 
      />
    );
    
    expect(screen.getByText('Análise Financeira')).toBeInTheDocument();
  });

  it('renders both bar and pie charts', () => {
    render(
      <ChartArea 
        income={3000} 
        expense={1245.5} 
        list={mockItems} 
        categories={categories} 
      />
    );
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders charts even with no data', () => {
    render(
      <ChartArea 
        income={0} 
        expense={0} 
        list={[]} 
        categories={categories} 
      />
    );
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });
});