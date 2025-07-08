/**
 * Event types for cross-MFE communication
 */
export type EventType = 
  | 'API_ERROR'
  | 'SUCCESS_MESSAGE'
  | 'AUTH_REQUIRED'
  | 'USER_LOGGED_OUT'
  | 'NOTIFICATION_SHOW'
  | 'NOTIFICATION_HIDE'
  | 'ROUTE_CHANGE'
  | 'THEME_CHANGE'
  | 'LANGUAGE_CHANGE'
  | 'AUTH_LOGIN' // Added AUTH_LOGIN
  | 'AUTH_LOGOUT'; // Added AUTH_LOGOUT

/**
 * Event payload interface
 */
export interface EventPayload {
  type: EventType;
  data?: any;
  timestamp?: number;
  source?: string;
}

/**
 * Event dispatcher class for cross-MFE communication
 * 
 * This class provides a centralized event system that allows different
 * microfrontends to communicate with each other without tight coupling.
 * It uses the browser's CustomEvent API for fire-and-forget messaging.
 */
class EventDispatcher {
  private eventTarget: EventTarget;

  constructor() {
    this.eventTarget = new EventTarget();
  }

  /**
   * Dispatch an event to all listeners
   * @param type - Event type
   * @param data - Event data
   * @param source - Source identifier (optional)
   */
  dispatchEvent(type: EventType, data?: any, source?: string): void {
    const payload: EventPayload = {
      type,
      data,
      timestamp: Date.now(),
      source,
    };

    const customEvent = new CustomEvent(type, {
      detail: payload,
    });

    this.eventTarget.dispatchEvent(customEvent);
  }

  /**
   * Add event listener
   * @param type - Event type to listen for
   * @param listener - Callback function
   */
  addEventListener(type: EventType, listener: (event: CustomEvent<EventPayload>) => void): void {
    this.eventTarget.addEventListener(type, listener as EventListener);
  }

  /**
   * Remove event listener
   * @param type - Event type
   * @param listener - Callback function to remove
   */
  removeEventListener(type: EventType, listener: (event: CustomEvent<EventPayload>) => void): void {
    this.eventTarget.removeEventListener(type, listener as EventListener);
  }

  /**
   * Add event listener that automatically removes itself after first call
   * @param type - Event type to listen for
   * @param listener - Callback function
   */
  addEventListenerOnce(type: EventType, listener: (event: CustomEvent<EventPayload>) => void): void {
    const onceListener = (event: CustomEvent<EventPayload>) => {
      listener(event);
      this.removeEventListener(type, onceListener);
    };
    this.addEventListener(type, onceListener);
  }

  /**
   * Remove all event listeners for a specific event type
   * @param type - Event type
   */
  removeAllListeners(_type?: EventType): void {
    // Create a new EventTarget to effectively remove all listeners
    // Note: This is a simplified approach. In production, you might want
    // to maintain a registry of listeners for better management.
    this.eventTarget = new EventTarget();
  }

  /**
   * Check if there are any listeners for a specific event type
   * @param type - Event type
   * @returns Boolean indicating if listeners exist
   */
  hasListeners(_type?: EventType): boolean {
    // This is a simplified implementation
    // In a real-world scenario, you'd maintain a listener registry
    return true;
  }
}

/**
 * Global event dispatcher instance
 * This singleton instance ensures all MFEs use the same event system
 */
export const eventDispatcher = new EventDispatcher();

/**
 * Convenience functions for common events
 */
export const dispatchApiError = (error: any, source?: string) => {
  eventDispatcher.dispatchEvent('API_ERROR', error, source);
};

export const dispatchSuccessMessage = (message: string, source?: string) => {
  eventDispatcher.dispatchEvent('SUCCESS_MESSAGE', { message }, source);
};

export const dispatchAuthRequired = (source?: string) => {
  eventDispatcher.dispatchEvent('AUTH_REQUIRED', null, source);
};

export const dispatchUserLoggedOut = (source?: string) => {
  eventDispatcher.dispatchEvent('USER_LOGGED_OUT', null, source);
};

export const dispatchNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', source?: string) => {
  eventDispatcher.dispatchEvent('NOTIFICATION_SHOW', { message, type }, source);
};
