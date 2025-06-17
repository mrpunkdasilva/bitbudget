import React, { createContext, useState, useEffect, useContext } from 'react';
import { AiRecommendation } from '../types/AiRecommendation';
import { aiAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotification } from '../components/NotificationManager';

interface AiContextData {
  recommendations: AiRecommendation[];
  isLoading: boolean;
  isGenerating: boolean;
  generateRecommendation: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const AiContext = createContext<AiContextData>({} as AiContextData);

export const AiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { token, user } = useAuth();
  const { error, success } = useNotification();

  useEffect(() => {
    // Load recommendations if user is logged in
    const loadRecommendations = async () => {
      if (token && user) {
        try {
          setIsLoading(true);
          const recommendations = await aiAPI.getRecommendations(token);
          setRecommendations(recommendations);
        } catch (err) {
          console.error('Failed to load recommendations', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadRecommendations();
  }, [token, user]);

  const generateRecommendation = async () => {
    if (!token) {
      error('Você precisa estar logado para gerar recomendações');
      return;
    }
    
    try {
      setIsGenerating(true);
      const newRecommendation = await aiAPI.generateRecommendation(token);
      setRecommendations(prev => [newRecommendation, ...prev]);
      success('Nova recomendação gerada com sucesso!');
    } catch (err) {
      error('Falha ao gerar recomendação. Tente novamente.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!token) {
      error('Você precisa estar logado para marcar recomendações como lidas');
      return;
    }
    
    try {
      await aiAPI.markRecommendationAsRead(token, id);
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id ? { ...rec, isRead: true } : rec
        )
      );
    } catch (err) {
      error('Falha ao marcar recomendação como lida');
      throw err;
    }
  };

  return (
    <AiContext.Provider
      value={{
        recommendations,
        isLoading,
        isGenerating,
        generateRecommendation,
        markAsRead
      }}
    >
      {children}
    </AiContext.Provider>
  );
};

export const useAi = () => {
  const context = useContext(AiContext);
  
  if (!context) {
    throw new Error('useAi must be used within an AiProvider');
  }
  
  return context;
};