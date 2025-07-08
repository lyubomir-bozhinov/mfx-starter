import React, { useState, useEffect, useCallback } from 'react';
import { eventDispatcher, EventType, NotificationPayload, EventPayload } from '@mfx/shared-utils';
import { cn } from '../utils/cn';

export interface GlobalNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
  defaultDuration?: number; // in milliseconds
}

interface Notification extends NotificationPayload {
  id: string;
  timerId?: ReturnType<typeof setTimeout>;
}

const DefaultNotification: React.FC<{ notification: Notification; onClose: (id: string) => void }> = ({
  notification,
  onClose,
}) => {
  const { message, type, action } = notification;

  const baseClasses = 'p-4 rounded-lg shadow-lg flex items-center justify-between text-white';
  const typeClasses = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={cn(baseClasses, typeClasses[type || 'info'], 'mb-2')}>
      <p className="flex-grow">{message}</p>
      {action && (
        <button
          onClick={() => {
            action.onClick();
            onClose(notification.id);
          }}
          className="ml-4 px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
        >
          {action.label}
        </button>
      )}
      <button onClick={() => onClose(notification.id)} className="ml-4 text-white opacity-70 hover:opacity-100">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

/**
 * Global notification system for displaying toasts/alerts.
 * Listens to 'NOTIFICATION' events dispatched via eventDispatcher.
 */
export const GlobalNotification: React.FC<GlobalNotificationProps> = ({
  position = 'top-right',
  maxNotifications = 5,
  defaultDuration = 5000,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const notificationToRemove = prev.find((n) => n.id === id);
      if (notificationToRemove?.timerId) {
        clearTimeout(notificationToRemove.timerId);
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  useEffect(() => {
    const handleNotification = (event: CustomEvent<EventPayload>) => {
      const { message, type, duration, action } = event.detail.data || {};
      if (!message) return;

      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const newNotification: Notification = { id, message, type, duration, action };

      setNotifications((prev) => {
        const updatedNotifications = [newNotification, ...prev];
        if (updatedNotifications.length > maxNotifications) {
          // Remove the oldest notification if max is exceeded
          const oldestNotification = updatedNotifications.pop();
          if (oldestNotification?.timerId) {
            clearTimeout(oldestNotification.timerId);
          }
        }
        return updatedNotifications;
      });
    };

    eventDispatcher.addEventListener('NOTIFICATION_SHOW', handleNotification);

    return () => {
      eventDispatcher.removeEventListener('NOTIFICATION_SHOW', handleNotification);
      // Clear all timers on unmount
      notifications.forEach((n) => n.timerId && clearTimeout(n.timerId));
    };
  }, [maxNotifications, removeNotification, notifications]);

  useEffect(() => {
    // Set timers for new notifications
    notifications.forEach((notification) => {
      if (!notification.timerId) {
        const timerId = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || defaultDuration);

        // Update the notification with the timerId
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, timerId } : n))
        );
      }
    });
  }, [notifications, defaultDuration, removeNotification]);

  const positionClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  };

  return (
    <div
      className={cn(
        'fixed z-[9999] flex flex-col pointer-events-none',
        positionClasses[position]
      )}
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto w-full max-w-sm">
          <DefaultNotification notification={notification} onClose={removeNotification} />
        </div>
      ))}
    </div>
  );
};
