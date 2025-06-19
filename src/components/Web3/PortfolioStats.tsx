import React from 'react';
import { mockPortfolioStats } from '../../data/mockWeb3Data';

export const PortfolioStats: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="portfolio-stats">
      <div className="stats-header">
        <h3>💼 Visão Geral do Portfólio</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-card total-value">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Valor Total</div>
            <div className="stat-value">{formatCurrency(mockPortfolioStats.totalValue)}</div>
            <div
              className={`stat-change ${mockPortfolioStats.change24h >= 0 ? 'positive' : 'negative'}`}
            >
              {formatChange(mockPortfolioStats.change24h)} 24h
            </div>
          </div>
        </div>

        <div className="stat-card assets-count">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Total de Ativos</div>
            <div className="stat-value">{mockPortfolioStats.assetsCount}</div>
            <div className="stat-change neutral">Diversificado</div>
          </div>
        </div>

        <div className="stat-card top-gainer">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Maior Alta</div>
            <div className="stat-value">{mockPortfolioStats.topGainer}</div>
            <div className="stat-change positive">Melhor performer</div>
          </div>
        </div>

        <div className="stat-card top-loser">
          <div className="stat-icon">📉</div>
          <div className="stat-content">
            <div className="stat-label">Maior Baixa</div>
            <div className="stat-value">{mockPortfolioStats.topLoser}</div>
            <div className="stat-change negative">Necessita atenção</div>
          </div>
        </div>
      </div>
    </div>
  );
};
