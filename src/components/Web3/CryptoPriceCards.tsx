import React from 'react';
import { mockCryptoPrices } from '../../data/mockWeb3Data';

export const CryptoPriceCards: React.FC = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 4 : 2
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="crypto-price-cards">
      {mockCryptoPrices.map(crypto => (
        <div key={crypto.symbol} className="price-card">
          <div className="crypto-icon">{crypto.icon}</div>
          <div className="crypto-name">{crypto.name}</div>
          <div className="crypto-price">{formatPrice(crypto.price)}</div>
          <div className={`crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
            {formatChange(crypto.change24h)}
          </div>
        </div>
      ))}
    </div>
  );
};