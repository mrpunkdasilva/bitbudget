import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { transactionAPI } from '../../services/api';
import { Item } from '../../types/Item';
import './styles.scss';

interface SmartAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  icon: string;
  title: string;
  message: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

export const SmartAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const generateAlerts = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get recent transactions (last 7 days)
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        const transactions = await transactionAPI.getTransactions(token, currentMonth, currentYear);
        
        // Filter transactions from last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const recentTransactions = transactions.filter(t => 
          new Date(t.date) >= weekAgo
        );

        const generatedAlerts = await analyzeForAlerts(recentTransactions, transactions);
        setAlerts(generatedAlerts);
      } catch (error) {
        console.error('Failed to generate alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateAlerts();
  }, [token]);

  const analyzeForAlerts = async (
    recentTransactions: Item[],
    allMonthTransactions: Item[]
  ): Promise<SmartAlert[]> => {
    const alerts: SmartAlert[] = [];

    // 1. Spending spike alert
    const recentExpenses = recentTransactions
      .filter(t => t.category.isExpense)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const dailyAverage = recentExpenses / 7;
    const monthlyAverage = allMonthTransactions
      .filter(t => t.category.isExpense)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) / new Date().getDate();

    if (dailyAverage > monthlyAverage * 1.5) {
      alerts.push({
        id: 'spending-spike',
        type: 'warning',
        icon: '⚡',
        title: 'Gastos Acima da Média',
        message: `Você gastou R$ ${recentExpenses.toFixed(2)} nos últimos 7 dias, acima da sua média mensal.`,
        dismissible: true
      });
    }

    // 2. No transactions today
    const today = new Date().toDateString();
    const todayTransactions = recentTransactions.filter(t => 
      new Date(t.date).toDateString() === today
    );

    if (todayTransactions.length === 0 && new Date().getHours() > 18) {
      alerts.push({
        id: 'no-transactions-today',
        type: 'info',
        icon: '📝',
        title: 'Sem Transações Hoje',
        message: 'Não esqueça de registrar suas transações do dia!',
        action: {
          text: 'Adicionar Transação',
          onClick: () => {
            // Scroll to input area or focus on add transaction
            const inputArea = document.querySelector('.input-area');
            if (inputArea) {
              inputArea.scrollIntoView({ behavior: 'smooth' });
            }
          }
        },
        dismissible: true
      });
    }

    // 3. Duplicate transaction detection
    const duplicateGroups = new Map<string, Item[]>();
    recentTransactions.forEach(transaction => {
      const key = `${transaction.amount}-${transaction.category.name}-${new Date(transaction.date).toDateString()}`;
      if (!duplicateGroups.has(key)) {
        duplicateGroups.set(key, []);
      }
      duplicateGroups.get(key)!.push(transaction);
    });

    const duplicates = Array.from(duplicateGroups.values()).filter(group => group.length > 1);
    if (duplicates.length > 0) {
      const firstDuplicate = duplicates[0];
      alerts.push({
        id: 'duplicate-transactions',
        type: 'warning',
        icon: '👥',
        title: 'Possíveis Transações Duplicadas',
        message: `Encontrei ${duplicates.length} grupo(s) de transações similares. Verifique se não há duplicatas.`,
        dismissible: true
      });
    }

    // 4. Weekend spending pattern
    const weekendTransactions = recentTransactions.filter(t => {
      const day = new Date(t.date).getDay();
      return (day === 0 || day === 6) && t.category.isExpense;
    });

    const weekendSpending = weekendTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    const weekendPercentage = recentExpenses > 0 ? (weekendSpending / recentExpenses) * 100 : 0;

    if (weekendPercentage > 50) {
      alerts.push({
        id: 'weekend-spending',
        type: 'info',
        icon: '🎪',
        title: 'Gastos Concentrados no Fim de Semana',
        message: `${weekendPercentage.toFixed(1)}% dos seus gastos foram nos fins de semana. Considere planejar o orçamento para lazer.`,
        dismissible: true
      });
    }

    // 5. Budget milestone (25th of month)
    const today = new Date();
    const isEndOfMonth = today.getDate() >= 25;
    
    if (isEndOfMonth) {
      const monthlyBudget = 3000; // This could come from user settings
      const monthlySpending = allMonthTransactions
        .filter(t => t.category.isExpense)
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

      const budgetPercentage = (monthlySpending / monthlyBudget) * 100;

      if (budgetPercentage > 90) {
        alerts.push({
          id: 'budget-almost-exceeded',
          type: 'warning',
          icon: '🚨',
          title: 'Orçamento Quase Excedido',
          message: `Você já gastou ${budgetPercentage.toFixed(1)}% do seu orçamento mensal. Cuidado com os gastos restantes!`,
          dismissible: true
        });
      } else if (budgetPercentage < 70) {
        alerts.push({
          id: 'budget-on-track',
          type: 'success',
          icon: '🎯',
          title: 'Orçamento Sob Controle',
          message: `Parabéns! Você está usando apenas ${budgetPercentage.toFixed(1)}% do seu orçamento mensal.`,
          dismissible: true
        });
      }
    }

    // 6. Smart tips based on patterns
    const categoryTotals: { [key: string]: number } = {};
    allMonthTransactions
      .filter(t => t.category.isExpense)
      .forEach(t => {
        categoryTotals[t.category.name] = (categoryTotals[t.category.name] || 0) + parseFloat(t.amount.toString());
      });

    const topCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];

    if (topCategory && Math.random() < 0.3) { // 30% chance to show tip
      const tips = [
        'Considere definir um limite mensal para sua categoria de maior gasto.',
        'Que tal revisar assinaturas e serviços recorrentes?',
        'Experimente a regra 50/30/20: 50% necessidades, 30% desejos, 20% poupança.',
        'Use a técnica dos 24 horas: espere um dia antes de compras não essenciais.',
        'Considere usar dinheiro físico para categorias de maior gasto - ajuda a controlar.'
      ];

      alerts.push({
        id: 'smart-tip',
        type: 'tip',
        icon: '💡',
        title: 'Dica Inteligente',
        message: tips[Math.floor(Math.random() * tips.length)],
        dismissible: true
      });
    }

    return alerts.filter(alert => !dismissedAlerts.includes(alert.id));
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (isLoading) {
    return (
      <div className="smart-alerts">
        <div className="smart-alerts__loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!token || alerts.length === 0) {
    return null;
  }

  return (
    <div className="smart-alerts">
      {alerts.map(alert => (
        <div key={alert.id} className={`smart-alert smart-alert--${alert.type}`}>
          <div className="smart-alert__icon">
            <span>{alert.icon}</span>
          </div>
          
          <div className="smart-alert__content">
            <h4 className="smart-alert__title">{alert.title}</h4>
            <p className="smart-alert__message">{alert.message}</p>
            
            {alert.action && (
              <button 
                className="smart-alert__action"
                onClick={alert.action.onClick}
              >
                {alert.action.text}
              </button>
            )}
          </div>
          
          {alert.dismissible && (
            <button 
              className="smart-alert__dismiss"
              onClick={() => dismissAlert(alert.id)}
              title="Dispensar"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};