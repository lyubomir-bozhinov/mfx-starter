import { useCallback } from 'react';
import { eventDispatcher } from '@mfx/shared-utils';

export interface NotificationOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Hook for dispatching notifications
 */
export const useNotification = () => {
  const showNotification = useCallback((message: string, options: NotificationOptions = {}) => {
    eventDispatcher.dispatchEvent('NOTIFICATION_SHOW', {
      message,
      type: options.type || 'info',
      duration: options.duration,
      action: options.action,
    });
  }, []);

  const showSuccess = useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    showNotification(message, { ...options, type: 'success' });
  }, [showNotification]);

  const showError = useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    showNotification(message, { ...options, type: 'error' });
  }, [showNotification]);

  const showWarning = useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    showNotification(message, { ...options, type: 'warning' });
  }, [showNotification]);

  const showInfo = useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    showNotification(message, { ...options, type: 'info' });
  }, [showNotification]);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
