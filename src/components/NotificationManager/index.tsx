import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Notification, NotificationType } from '../Notification';

type NotificationItem = {
  id: number;
  type: NotificationType;
  message: string;
  duration?: number;
  createdAt: number;
};

interface NotificationContextData {
  addNotification: (type: NotificationType, message: string, duration?: number) => number;
  removeNotification: (id: number) => void;
  NotificationContainer: React.FC;
  success: (message: string, duration?: number) => number;
  error: (message: string, duration?: number) => number;
  info: (message: string, duration?: number) => number;
}

// Limitar o número máximo de notificações visíveis ao mesmo tempo
const MAX_NOTIFICATIONS = 3;

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Limpar notificações antigas automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setNotifications(prev =>
        prev.filter(notification => {
          const duration = notification.duration || 3000;
          // Remove notificações que estão ativas há mais tempo que sua duração + 1s para animação
          return now - notification.createdAt < duration + 1000;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Usar useCallback para evitar recriações desnecessárias da função
  const addNotification = useCallback(
    (type: NotificationType, message: string, duration?: number) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);

      // Limitar o número de notificações
      setNotifications(prev => {
        // Verificar se já existe uma notificação com a mesma mensagem
        const existingNotification = prev.find(n => n.message === message && n.type === type);
        if (existingNotification) {
          // Atualizar apenas o timestamp da notificação existente
          return prev.map(n =>
            n.id === existingNotification.id ? { ...n, createdAt: Date.now() } : n
          );
        }

        const newNotifications = [
          ...prev,
          {
            id,
            type,
            message,
            duration,
            createdAt: Date.now(),
          },
        ];

        // Se exceder o limite, remover as mais antigas
        if (newNotifications.length > MAX_NOTIFICATIONS) {
          return newNotifications.slice(-MAX_NOTIFICATIONS);
        }

        return newNotifications;
      });

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const NotificationContainer = useCallback(
    () => (
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
            index={index}
          />
        ))}
      </div>
    ),
    [notifications, removeNotification]
  );

  const success = useCallback(
    (message: string, duration?: number) => addNotification('success', message, duration || 3000),
    [addNotification]
  );

  const error = useCallback(
    (message: string, duration?: number) => addNotification('error', message, duration || 5000),
    [addNotification]
  );

  const info = useCallback(
    (message: string, duration?: number) => addNotification('info', message, duration || 4000),
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        removeNotification,
        NotificationContainer,
        success,
        error,
        info,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
};
