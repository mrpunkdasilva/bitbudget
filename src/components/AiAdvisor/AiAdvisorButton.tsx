import React from 'react';
import { useAi } from '../../contexts/AiContext';
import './styles.scss';

export const AiAdvisorButton: React.FC = () => {
  const { unreadCount, toggleAiAdvisor } = useAi();

  return (
    <button
      className="ai-advisor-button"
      onClick={toggleAiAdvisor}
      aria-label="Abrir Conselheiro Financeiro"
    >
      💡
      {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
    </button>
  );
};
