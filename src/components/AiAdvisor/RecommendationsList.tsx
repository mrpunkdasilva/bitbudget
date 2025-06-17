import React from 'react';
import { useAi } from '../../contexts/AiContext';

export const RecommendationsList: React.FC = () => {
  const { recommendations, isLoading, isGenerating, generateRecommendation, markAsRead } = useAi();

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get badge color based on recommendation type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'SAVING':
        return 'badge-success';
      case 'INVESTMENT':
        return 'badge-primary';
      case 'BUDGET':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  // Get badge text based on recommendation type
  const getBadgeText = (type: string) => {
    switch (type) {
      case 'SAVING':
        return 'Economia';
      case 'INVESTMENT':
        return 'Investimento';
      case 'BUDGET':
        return 'Orçamento';
      default:
        return 'Geral';
    }
  };

  return (
    <div className="recommendations-list">
      <div className="recommendations-header">
        <h3>Recomendações Financeiras</h3>
        <button 
          className="btn btn-primary" 
          onClick={generateRecommendation} 
          disabled={isGenerating}
        >
          {isGenerating ? 'Gerando...' : 'Nova Recomendação'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading">Carregando recomendações...</div>
      ) : recommendations.length === 0 ? (
        <div className="recommendations-empty">
          <p>Nenhuma recomendação disponível. Clique em "Nova Recomendação" para gerar conselhos financeiros personalizados.</p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map(recommendation => (
            <div 
              key={recommendation.id} 
              className={`recommendation-card ${recommendation.isRead ? 'read' : 'unread'}`}
              onClick={() => !recommendation.isRead && markAsRead(recommendation.id)}
            >
              <div className="recommendation-header">
                <h4>{recommendation.title}</h4>
                <span className={`badge ${getBadgeColor(recommendation.type)}`}>
                  {getBadgeText(recommendation.type)}
                </span>
              </div>
              
              <div className="recommendation-content">
                {recommendation.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="recommendation-footer">
                <span className="date">{formatDate(recommendation.createdAt)}</span>
                {!recommendation.isRead && (
                  <span className="unread-badge">Novo</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};