import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './styles.scss';

interface QuickTip {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: 'saving' | 'budgeting' | 'investing' | 'general';
  actionable?: boolean;
}

const tips: QuickTip[] = [
  {
    id: 'emergency-fund',
    icon: '🏦',
    title: 'Fundo de Emergência',
    description: 'Mantenha 3-6 meses de despesas guardados para emergências. Comece poupando R$ 50 por semana.',
    category: 'saving',
    actionable: true
  },
  {
    id: '50-30-20-rule',
    icon: '📊',
    title: 'Regra 50/30/20',
    description: '50% para necessidades, 30% para desejos, 20% para poupança. Uma fórmula simples para organizar o orçamento.',
    category: 'budgeting'
  },
  {
    id: 'track-small-expenses',
    icon: '☕',
    title: 'Pequenos Gastos',
    description: 'Aquele cafezinho de R$ 5 por dia representa R$ 1.825 por ano. Pequenas economias fazem grande diferença.',
    category: 'saving'
  },
  {
    id: 'compound-interest',
    icon: '📈',
    title: 'Juros Compostos',
    description: 'Começar a investir R$ 100/mês aos 25 anos pode resultar em R$ 300mil aos 65 anos (8% a.a.).',
    category: 'investing'
  },
  {
    id: 'automated-savings',
    icon: '🤖',
    title: 'Poupança Automática',
    description: 'Configure transferências automáticas no dia do salário. "Pague a si mesmo primeiro".',
    category: 'saving',
    actionable: true
  },
  {
    id: 'debt-avalanche',
    icon: '❄️',
    title: 'Método Avalanche',
    description: 'Quite primeiro as dívidas com maiores juros. Mantenha pagamentos mínimos nas outras.',
    category: 'budgeting'
  },
  {
    id: 'price-comparison',
    icon: '🔍',
    title: 'Compare Preços',
    description: 'Use apps de comparação antes de compras grandes. 10 minutos podem economizar centenas de reais.',
    category: 'general',
    actionable: true
  },
  {
    id: 'review-subscriptions',
    icon: '📱',
    title: 'Revise Assinaturas',
    description: 'Cancele serviços que você não usa. A média das pessoas paga por 3+ assinaturas que esqueceram.',
    category: 'budgeting',
    actionable: true
  },
  {
    id: 'investment-apps',
    icon: '📲',
    title: 'Apps de Investimento',
    description: 'Use aplicativos que arredondam compras e investem o "troco". Invista sem sentir no bolso.',
    category: 'investing'
  },
  {
    id: 'financial-education',
    icon: '📚',
    title: 'Educação Financeira',
    description: 'Dedique 15 minutos por semana lendo sobre finanças. Conhecimento é o melhor investimento.',
    category: 'general'
  }
];

export const QuickTips: React.FC = () => {
  const [currentTip, setCurrentTip] = useState<QuickTip | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Show a random tip every time the component mounts
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
    setIsDismissed(false);
  }, []);

  const getNextTip = () => {
    const currentIndex = currentTip ? tips.findIndex(tip => tip.id === currentTip.id) : -1;
    const nextIndex = (currentIndex + 1) % tips.length;
    setCurrentTip(tips[nextIndex]);
    setIsDismissed(false);
  };

  const dismissTip = () => {
    setIsDismissed(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'saving': return '#28a745';
      case 'budgeting': return '#ffc107';
      case 'investing': return '#17a2b8';
      case 'general': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'saving': return 'Economia';
      case 'budgeting': return 'Orçamento';
      case 'investing': return 'Investimento';
      case 'general': return 'Geral';
      default: return 'Dica';
    }
  };

  if (!isAuthenticated || !currentTip || isDismissed) {
    return null;
  }

  return (
    <div className="quick-tips">
      <div className="quick-tip">
        <div className="quick-tip__header">
          <div className="quick-tip__icon">
            <span>{currentTip.icon}</span>
          </div>
          <div className="quick-tip__meta">
            <span 
              className="quick-tip__category"
              style={{ color: getCategoryColor(currentTip.category) }}
            >
              {getCategoryLabel(currentTip.category)}
            </span>
            <h4 className="quick-tip__title">{currentTip.title}</h4>
          </div>
          <div className="quick-tip__actions">
            <button 
              className="quick-tip__next"
              onClick={getNextTip}
              title="Próxima dica"
            >
              ↻
            </button>
            <button 
              className="quick-tip__dismiss"
              onClick={dismissTip}
              title="Dispensar"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="quick-tip__content">
          <p className="quick-tip__description">{currentTip.description}</p>
          
          {currentTip.actionable && (
            <div className="quick-tip__cta">
              <span className="quick-tip__cta-text">💡 Ação recomendada</span>
            </div>
          )}
        </div>
        
        <div className="quick-tip__footer">
          <span className="quick-tip__label">Dica do Dia</span>
          <div className="quick-tip__progress">
            <div className="quick-tip__progress-bar">
              <div 
                className="quick-tip__progress-fill"
                style={{ 
                  width: `${((tips.findIndex(t => t.id === currentTip.id) + 1) / tips.length) * 100}%`,
                  backgroundColor: getCategoryColor(currentTip.category)
                }}
              />
            </div>
            <span className="quick-tip__progress-text">
              {tips.findIndex(t => t.id === currentTip.id) + 1} de {tips.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};