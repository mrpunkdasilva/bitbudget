import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { transactionAPI } from '../../services/api';
import { Item } from '../../types/Item';
import './styles.scss';

interface InsightCardProps {
  icon: string;
  title: string;
  description: string;
  value?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'success' | 'warning' | 'danger' | 'info';
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  icon, 
  title, 
  description, 
  value, 
  trend = 'neutral',
  color = 'info' 
}) => (
  <div className={`insight-card insight-card--${color}`}>
    <div className="insight-card__icon">
      <span>{icon}</span>
    </div>
    <div className="insight-card__content">
      <h4 className="insight-card__title">{title}</h4>
      <p className="insight-card__description">{description}</p>
      {value && (
        <div className="insight-card__value">
          <span className="value">{value}</span>
          {trend !== 'neutral' && (
            <span className={`trend trend--${trend}`}>
              {trend === 'up' ? '↗' : '↘'}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);

export const SmartInsights: React.FC = () => {
  const [insights, setInsights] = useState<InsightCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const generateInsights = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get current month and last month data
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        const [currentTransactions, lastMonthTransactions] = await Promise.all([
          transactionAPI.getTransactions(token, currentMonth, currentYear),
          transactionAPI.getTransactions(token, lastMonth, lastMonthYear)
        ]);

        const generatedInsights = await analyzeTransactions(
          currentTransactions, 
          lastMonthTransactions
        );
        
        setInsights(generatedInsights);
      } catch (error) {
        console.error('Failed to generate insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [token]);

  const analyzeTransactions = async (
    currentTransactions: Item[], 
    lastMonthTransactions: Item[]
  ): Promise<InsightCardProps[]> => {
    const insights: InsightCardProps[] = [];

    // Calculate totals
    const currentExpenses = currentTransactions
      .filter(t => t.category.isExpense)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const lastExpenses = lastMonthTransactions
      .filter(t => t.category.isExpense)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const currentIncome = currentTransactions
      .filter(t => !t.category.isExpense)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    // Monthly spending comparison
    if (lastExpenses > 0) {
      const percentChange = ((currentExpenses - lastExpenses) / lastExpenses) * 100;
      const isIncreasing = percentChange > 5;
      const isDecreasing = percentChange < -5;
      
      if (isIncreasing) {
        insights.push({
          icon: '📈',
          title: 'Gastos em Alta',
          description: `Seus gastos aumentaram ${percentChange.toFixed(1)}% em relação ao mês passado`,
          value: `+R$ ${(currentExpenses - lastExpenses).toFixed(2)}`,
          trend: 'up',
          color: 'warning'
        });
      } else if (isDecreasing) {
        insights.push({
          icon: '📉',
          title: 'Gastos Reduzidos',
          description: `Parabéns! Você economizou ${Math.abs(percentChange).toFixed(1)}% este mês`,
          value: `-R$ ${Math.abs(currentExpenses - lastExpenses).toFixed(2)}`,
          trend: 'down',
          color: 'success'
        });
      }
    }

    // Category analysis
    const categoryTotals: { [key: string]: { total: number; title: string; isExpense: boolean } } = {};
    currentTransactions.forEach(transaction => {
      const categoryName = transaction.category.name;
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = {
          total: 0,
          title: transaction.category.title,
          isExpense: transaction.category.isExpense
        };
      }
      categoryTotals[categoryName].total += parseFloat(transaction.amount.toString());
    });

    // Find biggest expense category
    const expenseCategories = Object.entries(categoryTotals)
      .filter(([_, data]) => data.isExpense)
      .sort((a, b) => b[1].total - a[1].total);

    if (expenseCategories.length > 0) {
      const [topCategory, topCategoryData] = expenseCategories[0];
      const percentOfTotal = currentExpenses > 0 ? (topCategoryData.total / currentExpenses) * 100 : 0;
      
      insights.push({
        icon: '🎯',
        title: 'Maior Categoria de Gasto',
        description: `${topCategoryData.title} representa ${percentOfTotal.toFixed(1)}% dos seus gastos`,
        value: `R$ ${topCategoryData.total.toFixed(2)}`,
        color: percentOfTotal > 40 ? 'warning' : 'info'
      });
    }

    // Savings rate
    if (currentIncome > 0) {
      const savingsRate = ((currentIncome - currentExpenses) / currentIncome) * 100;
      let savingsInsight: InsightCardProps;

      if (savingsRate < 0) {
        savingsInsight = {
          icon: '⚠️',
          title: 'Atenção: Gastos > Receita',
          description: 'Seus gastos excedem sua receita este mês',
          value: `${savingsRate.toFixed(1)}%`,
          color: 'danger'
        };
      } else if (savingsRate < 10) {
        savingsInsight = {
          icon: '💰',
          title: 'Taxa de Poupança Baixa',
          description: 'Tente poupar pelo menos 20% da sua receita',
          value: `${savingsRate.toFixed(1)}%`,
          color: 'warning'
        };
      } else {
        savingsInsight = {
          icon: '🎉',
          title: 'Ótima Taxa de Poupança',
          description: 'Você está poupando bem! Continue assim',
          value: `${savingsRate.toFixed(1)}%`,
          color: 'success'
        };
      }
      
      insights.push(savingsInsight);
    }

    return insights.slice(0, 3); // Return max 3 insights for home page
  };

  if (isLoading) {
    return (
      <div className="smart-insights">
        <div className="smart-insights__header">
          <h3>💡 Insights Inteligentes</h3>
          <p>Analisando seus dados financeiros...</p>
        </div>
        <div className="smart-insights__loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="smart-insights">
        <div className="smart-insights__header">
          <h3>💡 Insights Inteligentes</h3>
          <p>Faça login para ver insights personalizados dos seus gastos</p>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="smart-insights">
        <div className="smart-insights__header">
          <h3>💡 Insights Inteligentes</h3>
          <p>Adicione algumas transações para ver insights personalizados</p>
        </div>
        <div className="smart-insights__empty">
          <span className="empty-icon">📈</span>
          <p>Comece adicionando receitas e despesas para receber análises inteligentes!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-insights">
      <div className="smart-insights__header">
        <h3>💡 Insights Inteligentes</h3>
        <p>Análise automatizada dos seus hábitos financeiros</p>
      </div>
      <div className="smart-insights__grid">
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
      </div>
    </div>
  );
};