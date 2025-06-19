import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Item } from '../../types/Item';
import { Category } from '../../types/Category';

// Registrando os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

type Props = {
  income: number;
  expense: number;
  list: Item[];
  categories: Record<string, Category>;
};

export const ChartArea = ({ income, expense, list, categories }: Props) => {
  const [categoryExpenses, setCategoryExpenses] = useState<Record<string, number>>({});

  // Calcular despesas por categoria
  useEffect(() => {
    const expensesByCategory: Record<string, number> = {};

    // Inicializar todas as categorias com 0
    for (let key in categories) {
      if (categories[key].expense) {
        expensesByCategory[key] = 0;
      }
    }

    // Somar despesas por categoria
    list.forEach(item => {
      if (categories[item.category].expense) {
        expensesByCategory[item.category] += item.value;
      }
    });

    setCategoryExpenses(expensesByCategory);
  }, [list, categories]);

  // Dados para o gráfico de barras (Receitas vs Despesas)
  const barChartData = {
    labels: ['Receitas vs Despesas'],
    datasets: [
      {
        label: 'Receitas',
        data: [income],
        backgroundColor: 'rgba(0, 200, 83, 0.7)',
        borderColor: 'rgba(0, 150, 60, 1)',
        borderWidth: 2,
      },
      {
        label: 'Despesas',
        data: [expense],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(200, 50, 80, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Opções para o gráfico de barras
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: "'Press Start 2P', cursive",
            size: 10,
          },
          boxWidth: 15,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Receitas vs Despesas',
        color: '#333',
        font: {
          family: "'Press Start 2P', cursive",
          size: 14,
          weight: 'bold' as 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(138, 43, 226, 0.1)',
          borderDash: [5, 5],
        },
        ticks: {
          font: {
            family: "'Press Start 2P', cursive",
            size: 8,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Press Start 2P', cursive",
            size: 8,
          },
        },
      },
    },
  };

  // Dados para o gráfico de pizza (Despesas por categoria)
  const pieChartData = {
    labels: Object.keys(categoryExpenses).map(cat => categories[cat].title),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(138, 43, 226, 0.8)',
          'rgba(0, 200, 83, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(138, 43, 226, 1)',
          'rgba(0, 200, 83, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Opções para o gráfico de pizza
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: "'Press Start 2P', cursive",
            size: 8,
          },
          boxWidth: 15,
          padding: 10,
        },
      },
      title: {
        display: true,
        text: 'Despesas por Categoria',
        color: '#333',
        font: {
          family: "'Press Start 2P', cursive",
          size: 14,
          weight: 'bold' as 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-area">
      <div className="chart-area__title">Análise Financeira</div>

      <div className="chart-area__container">
        <div className="chart-area__chart">
          <Bar data={barChartData} options={barChartOptions} />
        </div>

        <div className="chart-area__chart">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
};
