import React, { useState } from 'react';
import { useAi } from '../../contexts/AiContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../NotificationManager';

export const AiAdvisorButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { generateRecommendation, isGenerating, recommendations } = useAi();
  const { isAuthenticated } = useAuth();
  const { info, error } = useNotification();

  const handleClick = async () => {
    if (!isAuthenticated) {
      info('Faça login para acessar o assistente financeiro');
      return;
    }
    
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    
    setIsOpen(true);
    
    // If no recommendations, generate one
    if (recommendations.length === 0 && !isGenerating) {
      try {
        await generateRecommendation();
      } catch (err) {
        error('Não foi possível gerar uma recomendação. Tente novamente mais tarde.');
      }
    }
  };

  // Count unread recommendations
  const unreadCount = recommendations.filter(rec => !rec.isRead).length;

  return (
    <>
      <button 
        className={`ai-advisor-button ${isOpen ? 'open' : ''}`} 
        onClick={handleClick}
      >
        <span className="ai-icon">💡</span>
        {unreadCount > 0 && (
          <span className="unread-count">{unreadCount}</span>
        )}
      </button>
      
      {isOpen && (
        <div className="ai-advisor-popup">
          <div className="popup-header">
            <h3>Assistente Financeiro</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="popup-content">
            {isAuthenticated ? (
              <>
                <p className="advisor-intro">
                  Olá! Sou seu assistente financeiro pessoal. Posso ajudar com dicas e recomendações baseadas no seu perfil financeiro.
                </p>
                
                <div className="advisor-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={generateRecommendation}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Gerando...' : 'Gerar Nova Dica'}
                  </button>
                </div>
                
                <div className="recent-recommendations">
                  <h4>Recomendações Recentes</h4>
                  
                  {recommendations.length === 0 ? (
                    <p>Nenhuma recomendação disponível. Clique em "Gerar Nova Dica" para começar.</p>
                  ) : (
                    <div className="recommendations-list">
                      {recommendations.slice(0, 3).map(rec => (
                        <div key={rec.id} className="recommendation-item">
                          <h5>{rec.title}</h5>
                          <p>{rec.content.substring(0, 100)}...</p>
                        </div>
                      ))}
                      
                      {recommendations.length > 3 && (
                        <a href="/recommendations" className="view-all">
                          Ver todas as recomendações
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="login-prompt">
                <p>Faça login para acessar o assistente financeiro e receber dicas personalizadas.</p>
                <a href="/login" className="btn btn-primary">Fazer Login</a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};