import React, { createContext, useState, useEffect, useContext } from 'react';
import { AiRecommendation } from '../types/AiRecommendation';
import { aiAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotification } from '../components/NotificationManager';
import { mockRecommendations, generateMockRecommendation } from '../data/mockAiData';

interface AiContextData {
  recommendations: AiRecommendation[];
  isLoading: boolean;
  isGenerating: boolean;
  unreadCount: number;
  isAiAdvisorOpen: boolean;
  toggleAiAdvisor: () => void;
  generateRecommendation: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const AiContext = createContext<AiContextData>({} as AiContextData);

export const AiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>(mockRecommendations);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  const { token, user } = useAuth();
  const { error, success } = useNotification();

  // Calcular o número de recomendações não lidas
  const unreadCount = recommendations.filter(rec => !rec.isRead).length;

  // Função para alternar a visibilidade do painel de recomendações
  const toggleAiAdvisor = () => {
    setIsAiAdvisorOpen(prev => !prev);
  };

  useEffect(() => {
    // Usar dados mockados para demonstração
    setRecommendations(mockRecommendations);

    // Comentado o código real que seria usado com a API
    /*
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
    */
  }, []);

  const generateRecommendation = async () => {
    try {
      setIsGenerating(true);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Gerar recomendação mockada
      const newRecommendation = generateMockRecommendation();
      setRecommendations(prev => [newRecommendation, ...prev]);
      success('Nova recomendação gerada com sucesso!');
    } catch (err) {
      error('Falha ao gerar recomendação. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));

      // Atualizar estado local
      setRecommendations(prev => prev.map(rec => (rec.id === id ? { ...rec, isRead: true } : rec)));
    } catch (err) {
      error('Falha ao marcar recomendação como lida');
    }
  };

  return (
    <AiContext.Provider
      value={{
        recommendations,
        isLoading,
        isGenerating,
        unreadCount,
        isAiAdvisorOpen,
        toggleAiAdvisor,
        generateRecommendation,
        markAsRead,
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
