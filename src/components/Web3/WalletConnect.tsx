import React, { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useNotification } from '../NotificationManager';

export const WalletConnect: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const { connectWallet, walletAddress: connectedWallet, isConnecting } = useWeb3();
  const { error } = useNotification();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      error('Por favor, insira um endereço de carteira');
      return;
    }
    
    try {
      await connectWallet(walletAddress);
      setWalletAddress(''); // Clear input after successful connection
    } catch (err) {
      console.error('Failed to connect wallet', err);
    }
  };

  return (
    <div className="wallet-connect">
      <h3>Conectar Carteira Web3</h3>
      
      {connectedWallet ? (
        <div className="wallet-info">
          <p>Carteira conectada:</p>
          <div className="wallet-address">
            {connectedWallet.substring(0, 6)}...{connectedWallet.substring(connectedWallet.length - 4)}
          </div>
          <p className="wallet-note">
            Seus ativos Web3 serão sincronizados automaticamente.
          </p>
        </div>
      ) : (
        <form onSubmit={handleConnect}>
          <div className="form-group">
            <label htmlFor="walletAddress">Endereço da Carteira</label>
            <input
              type="text"
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isConnecting}
          >
            {isConnecting ? 'Conectando...' : 'Conectar Carteira'}
          </button>
        </form>
      )}
    </div>
  );
};