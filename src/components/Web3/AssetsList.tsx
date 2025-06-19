import React from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { mockWeb3Assets } from '../../data/mockWeb3Data';

export const AssetsList: React.FC = () => {
  const { assets, syncAssets, isSyncing, walletAddress } = useWeb3();

  // Use dados mocados se não houver ativos reais
  const displayAssets = assets.length > 0 ? assets : walletAddress ? mockWeb3Assets : [];

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format percentage change
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  // Get crypto icon
  const getCryptoIcon = (symbol: string) => {
    const icons: { [key: string]: string } = {
      BTC: '₿',
      ETH: 'Ξ',
      BNB: '🔶',
      ADA: '🔷',
      SOL: '☀️',
      MATIC: '🔮',
    };
    return icons[symbol] || '🪙';
  };

  if (!walletAddress) {
    return (
      <div className="assets-list empty">
        <p>Conecte uma carteira para ver seus ativos Web3.</p>
      </div>
    );
  }

  return (
    <div className="assets-list">
      <div className="assets-header">
        <h3>Seus Ativos Web3</h3>
        <button className="btn btn-secondary" onClick={syncAssets} disabled={isSyncing}>
          {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
        </button>
      </div>

      {displayAssets.length === 0 ? (
        <div className="assets-empty">
          <p>Nenhum ativo encontrado. Clique em Sincronizar para atualizar.</p>
        </div>
      ) : (
        <div className="assets-grid">
          {displayAssets.map(asset => (
            <div key={asset.id} className="asset-card">
              <div className="asset-header">
                <div className="asset-name-container">
                  <span className="asset-icon">{getCryptoIcon(asset.symbol)}</span>
                  <h4>{asset.name}</h4>
                </div>
                <span className="asset-symbol">{asset.symbol}</span>
              </div>

              <div className="asset-balance">
                <span className="balance-value">{asset.balance}</span>
                <span className="balance-symbol">{asset.symbol}</span>
              </div>

              {asset.price && asset.valueUSD && (
                <div className="asset-price-info">
                  <div className="price-usd">
                    <span className="label">Valor USD:</span>
                    <span className="value">{formatCurrency(asset.valueUSD)}</span>
                  </div>
                  <div className="price-per-unit">
                    <span className="label">Preço unitário:</span>
                    <span className="value">{formatCurrency(asset.price)}</span>
                  </div>
                  {asset.change24h !== undefined && (
                    <div className="price-change">
                      <span className="label">24h:</span>
                      <span className={`value ${asset.change24h >= 0 ? 'positive' : 'negative'}`}>
                        {formatChange(asset.change24h)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="asset-details">
                <div className="asset-type">
                  <span className="label">Tipo:</span>
                  <span className="value">{asset.tokenType}</span>
                </div>

                <div className="asset-network">
                  <span className="label">Rede:</span>
                  <span className="value">{asset.network}</span>
                </div>

                <div className="asset-updated">
                  <span className="label">Atualizado:</span>
                  <span className="value">{formatDate(asset.lastUpdated)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
