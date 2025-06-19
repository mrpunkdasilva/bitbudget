import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { transactionAPI } from '../../services/api';
import { Item } from '../../types/Item';
import './styles.scss';

interface SummaryMetric {
  label: string;
  value: string;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  icon: string;
}

export const FinancialSummary: React.FC = () => {
  const [metrics, setMetrics] = useState<SummaryMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');
  const { token } = useAuth();

  useEffect(() => {
    const calculateMetrics = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        // Get current and previous period data
        let currentTransactions: Item[] = [];
        let previousTransactions: Item[] = [];

        if (selectedPeriod === 'week') {
          // Get transactions from this week and last week
          const transactions = await transactionAPI.getTransactions(
            token,
            currentMonth,
            currentYear
          );

          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

          currentTransactions = transactions.filter(t => new Date(t.date) >= oneWeekAgo);
          previousTransactions = transactions.filter(
            t => new Date(t.date) >= twoWeeksAgo && new Date(t.date) < oneWeekAgo
          );
        } else {
          // Current month vs previous month
          const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

          [currentTransactions, previousTransactions] = await Promise.all([
            transactionAPI.getTransactions(token, currentMonth, currentYear),
            transactionAPI.getTransactions(token, lastMonth, lastMonthYear),
          ]);
        }

        const calculatedMetrics = calculateFinancialMetrics(
          currentTransactions,
          previousTransactions
        );
        setMetrics(calculatedMetrics);
      } catch (error) {
        console.error('Failed to calculate metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateMetrics();
  }, [token, selectedPeriod]);

  const calculateFinancialMetrics = (current: Item[], previous: Item[]): SummaryMetric[] => {
    // Current period calculations
    const currentIncome = current
      .filter(t => !t.category.isExpense)
      .reduce((sum, t) => sum + parseFloat(t.amount?.toString() || '0'), 0);

    const currentExpenses = current
      .filter(t => t.category.isExpense)
      .reduce((sum, t) => sum + parseFloat(t.amount?.toString() || '0'), 0);

    const currentBalance = currentIncome - currentExpenses;
    const currentSavingsRate = currentIncome > 0 ? (currentBalance / currentIncome) * 100 : 0;

    // Previous period calculations
    const previousIncome = previous
      .filter(t => !t.category.isExpense)
      .reduce((sum, t) => sum + parseFloat(t.amount?.toString() || '0'), 0);

    const previousExpenses = previous
      .filter(t => t.category.isExpense)
      .reduce((sum, t) => sum + parseFloat(t.amount?.toString() || '0'), 0);

    const previousBalance = previousIncome - previousExpenses;

    // Calculate changes
    const incomeChange =
      previousIncome > 0 ? ((currentIncome - previousIncome) / previousIncome) * 100 : 0;
    const expenseChange =
      previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;
    const balanceChange = currentBalance - previousBalance;

    return [
      {
        label: 'Receita',
        value: `R$ ${currentIncome.toFixed(2)}`,
        change: {
          value: `${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}%`,
          type: incomeChange > 0 ? 'positive' : incomeChange < 0 ? 'negative' : 'neutral',
        },
        icon: '💰',
      },
      {
        label: 'Gastos',
        value: `R$ ${currentExpenses.toFixed(2)}`,
        change: {
          value: `${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}%`,
          type: expenseChange < 0 ? 'positive' : expenseChange > 0 ? 'negative' : 'neutral',
        },
        icon: '💸',
      },
      {
        label: 'Saldo',
        value: `R$ ${currentBalance.toFixed(2)}`,
        change: {
          value: `${balanceChange >= 0 ? '+' : ''}R$ ${balanceChange.toFixed(2)}`,
          type: balanceChange > 0 ? 'positive' : balanceChange < 0 ? 'negative' : 'neutral',
        },
        icon: currentBalance >= 0 ? '📈' : '📉',
      },
      {
        label: 'Taxa de Poupança',
        value: `${currentSavingsRate.toFixed(1)}%`,
        icon: currentSavingsRate > 20 ? '🎯' : currentSavingsRate > 10 ? '⚡' : '⚠️',
      },
    ];
  };

  const formatPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week':
        return 'Esta Semana';
      case 'month':
        return 'Este Mês';
      default:
        return 'Este Período';
    }
  };

  if (isLoading) {
    return (
      <div className="financial-summary">
        <div className="financial-summary__header">
          <h3>📊 Resumo Financeiro</h3>
        </div>
        <div className="financial-summary__loading">
          <div className="loading-spinner"></div>
          <p>Calculando métricas...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="financial-summary">
        <div className="financial-summary__header">
          <h3>📊 Resumo Financeiro</h3>
          <p>Faça login para ver seu resumo financeiro personalizado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-summary">
      <div className="financial-summary__header">
        <h3>📊 Resumo Financeiro</h3>
        <div className="period-selector">
          <button
            className={selectedPeriod === 'week' ? 'active' : ''}
            onClick={() => setSelectedPeriod('week')}
          >
            Semana
          </button>
          <button
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => setSelectedPeriod('month')}
          >
            Mês
          </button>
        </div>
      </div>

      <div className="financial-summary__subtitle">
        <p>{formatPeriodLabel()} vs período anterior</p>
      </div>

      <div className="financial-summary__grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-card__header">
              <span className="metric-card__icon">{metric.icon}</span>
              <span className="metric-card__label">{metric.label}</span>
            </div>

            <div className="metric-card__value">{metric.value}</div>

            {metric.change && (
              <div className={`metric-card__change metric-card__change--${metric.change.type}`}>
                {metric.change.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
