import React from 'react';
import { AuthProvider } from './AuthContext';
import { Web3Provider } from './Web3Context';
import { AiProvider } from './AiContext';
import { NotificationProvider } from '../components/NotificationManager';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Web3Provider>
          <AiProvider>
            {children}
          </AiProvider>
        </Web3Provider>
      </AuthProvider>
    </NotificationProvider>
  );
};