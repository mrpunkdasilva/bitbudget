import React from 'react';
import { useWeb3 } from '../../contexts/Web3Context';

export const AssetsList: React.FC = () => {
  const { assets, syncAssets, isSyncing, walletAddress } = useWeb3();

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
        <button 
          className="btn btn-secondary" 
          onClick={syncAssets} 
          disabled={isSyncing}
        >
          {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
        </button>
      </div>
      
      {assets.length === 0 ? (
        <div className="assets-empty">
          <p>Nenhum ativo encontrado. Clique em Sincronizar para atualizar.</p>
        </div>
      ) : (
        <div className="assets-grid">
          {assets.map(asset => (
            <div key={asset.id} className="asset-card">
              <div className="asset-header">
                <h4>{asset.name}</h4>
                <span className="asset-symbol">{asset.symbol}</span>
              </div>
              
              <div className="asset-balance">
                <span className="balance-value">{asset.balance}</span>
                <span className="balance-symbol">{asset.symbol}</span>
              </div>
              
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