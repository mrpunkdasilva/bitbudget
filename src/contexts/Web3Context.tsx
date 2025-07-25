import React, { createContext, useState, useEffect, useContext } from 'react';
import { Web3Asset } from '../types/Web3Asset';
import { web3API } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotification } from '../components/NotificationManager';
import { mockWalletAddress, mockWeb3Assets } from '../data/mockWeb3Data';

interface Web3ContextData {
  walletAddress: string | null;
  assets: Web3Asset[];
  isConnecting: boolean;
  isSyncing: boolean;
  connectWallet: (address: string) => Promise<void>;
  syncAssets: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextData>({} as Web3ContextData);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [assets, setAssets] = useState<Web3Asset[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { token, user } = useAuth();
  const { error, success, info } = useNotification();

  useEffect(() => {
    // Load wallet info if user is logged in
    const loadWalletInfo = async () => {
      if (token && user) {
        try {
          const { walletAddress } = await web3API.getWalletInfo(token);
          setWalletAddress(walletAddress);

          // Load assets
          const assets = await web3API.getAssets(token);
          setAssets(assets);
        } catch (err) {
          // Wallet might not be connected yet, which is fine
          console.log('Wallet not connected yet');
        }
      }
    };

    loadWalletInfo();
  }, [token, user]);

  const connectWallet = async (address: string) => {
    try {
      setIsConnecting(true);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Usar dados mocados
      setWalletAddress(mockWalletAddress);
      success('Carteira conectada com sucesso!');

      // Sync assets after connecting wallet
      await syncAssets();
    } catch (err) {
      error('Falha ao conectar carteira. Verifique o endereço e tente novamente.');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const syncAssets = async () => {
    if (!walletAddress && !mockWalletAddress) {
      info('Conecte uma carteira primeiro para sincronizar ativos');
      return;
    }

    try {
      setIsSyncing(true);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Usar dados mocados
      setAssets(mockWeb3Assets);
      success(`${mockWeb3Assets.length} ativos sincronizados com sucesso!`);
    } catch (err) {
      error('Falha ao sincronizar ativos. Tente novamente.');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        walletAddress,
        assets,
        isConnecting,
        isSyncing,
        connectWallet,
        syncAssets,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);

  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }

  return context;
};
