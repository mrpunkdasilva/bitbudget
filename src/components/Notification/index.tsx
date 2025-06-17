import { useEffect, useState } from 'react';
import './styles.scss';

type NotificationType = 'success' | 'error' | 'info';

type Props = {
    type: NotificationType;
    message: string;
    duration?: number;
    onClose: () => void;
    index?: number;
}

export const Notification = ({ type, message, duration = 3000, onClose, index = 0 }: Props) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Aguarda a animação de saída
        }, duration);
        
        // Atualiza a barra de progresso
        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev - (100 / (duration / 100));
                return newProgress < 0 ? 0 : newProgress;
            });
        }, 100);
        
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [duration, onClose]);
    
    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(false);
        setTimeout(onClose, 300); // Aguarda a animação de saída
    };
    
    // Calcular a posição vertical com base no índice
    const getTopPosition = () => {
        const basePosition = 20; // posição base em px
        const offset = 80; // deslocamento entre notificações em px
        return basePosition + (index * offset);
    };
    
    return (
        <div 
            className={`notification notification--${type} ${isVisible ? 'notification--visible' : 'notification--hidden'}`}
            style={{ top: `${getTopPosition()}px` }}
        >
            <div className="notification__icon">
                {type === 'success' && '✓'}
                {type === 'error' && '✗'}
                {type === 'info' && 'ℹ'}
            </div>
            <div className="notification__content">
                <div className="notification__message">{message}</div>
                <div className="notification__progress">
                    <div 
                        className="notification__progress-bar" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            <button 
                onClick={handleClose}
                aria-label="Fechar notificação"
                type="button"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    minWidth: '30px',
                    minHeight: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    padding: 0,
                    margin: 0,
                    marginLeft: '10px',
                    position: 'relative',
                    zIndex: 100,
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                ×
            </button>
        </div>
    );
};

export type { NotificationType };