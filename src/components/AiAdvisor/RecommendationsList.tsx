import React from 'react';
import { useAi } from '../../contexts/AiContext';
import './styles.scss';

export const RecommendationsList: React.FC = () => {
  const { 
    recommendations, 
    isLoading, 
    isGenerating, 
    generateRecommendation, 
    markAsRead 
  } = useAi();

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Get recommendation type class
  const getRecommendationTypeClass = (type: string) => {
    switch (type.toUpperCase()) {
      case 'SAVING': return 'recommendation-card--saving';
      case 'INVESTMENT': return 'recommendation-card--investment';
      case 'BUDGET': return 'recommendation-card--budget';
      default: return 'recommendation-card--general';
    }
  };

  // Get badge class based on recommendation type
  const getBadgeClass = (type: string) => {
    switch (type.toUpperCase()) {
      case 'SAVING': return 'recommendation-card__badge--saving';
      case 'INVESTMENT': return 'recommendation-card__badge--investment';
      case 'BUDGET': return 'recommendation-card__badge--budget';
      default: return 'recommendation-card__badge--general';
    }
  };

  // Get badge text based on recommendation type
  const getBadgeText = (type: string) => {
    switch (type.toUpperCase()) {
      case 'SAVING': return 'Economia';
      case 'INVESTMENT': return 'Investimento';
      case 'BUDGET': return 'Orçamento';
      default: return 'Geral';
    }
  };

  // Limitar o texto da descrição para evitar overflow
  const truncateText = (text: string, maxLength: number = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Renderizar um card de recomendação
  const renderRecommendationCard = (recommendation: any) => (
    <div
      key={recommendation.id}
      className={`recommendation-card ${getRecommendationTypeClass(recommendation.type)} ${
        recommendation.isRead ? 'read' : 'unread'
      }`}
      onClick={() => !recommendation.isRead && markAsRead(recommendation.id)}
    >
      <div className="recommendation-card__header">
        <h4 className="recommendation-card__title">{recommendation.title}</h4>
        <span className={`recommendation-card__badge ${getBadgeClass(recommendation.type)}`}>
          {getBadgeText(recommendation.type)}
        </span>
      </div>
      
      <p className="recommendation-card__description">
        {truncateText(recommendation.description)}
      </p>
      
      <div className="recommendation-card__footer">
        <div className="recommendation-card__date">
          <span>📅</span> {formatDate(recommendation.createdAt)}
        </div>
        <div className="recommendation-card__actions">
          <button 
            className="recommendation-card__button"
            onClick={(e) => {
              e.stopPropagation();
              // Lógica para ignorar
            }}
          >
            Ignorar
          </button>
          <button 
            className="recommendation-card__button recommendation-card__button--primary"
            onClick={(e) => {
              e.stopPropagation();
              // Lógica para aplicar
            }}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ai-section__content">
      <div className="recommendations">
        <div className="recommendations__header">
          <h3>Recomendações Inteligentes</h3>
          <p>Conselhos personalizados para melhorar sua saúde financeira</p>
        </div>
        
        {isLoading ? (
          <div className="recommendations__loading">
            <div className="loading-spinner"></div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="recommendations__empty">
            <span className="empty-icon">💡</span>
            <p>
              Nenhuma recomendação disponível. Clique em "Nova Recomendação" para gerar conselhos
              financeiros personalizados.
            </p>
          </div>
        ) : (
          <div className="recommendations__grid">
            {recommendations.map(renderRecommendationCard)}
          </div>
        )}

        <div className="recommendations__actions">
          <button onClick={generateRecommendation} disabled={isGenerating}>
            {isGenerating ? (
              <>Gerando... <div className="loading-spinner"></div></>
            ) : (
              <>
                <span>✨</span> Nova Recomendação
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};