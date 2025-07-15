// Auth Store
export { useAuthStore } from './stores/authStore';
export type { AuthState } from './stores/authStore';

// Event Dispatcher
export { eventDispatcher, dispatchNotification } from './events/eventDispatcher';
export type { EventPayload, EventType } from './events/eventDispatcher';

// HTTP Client
export { httpClient } from './http/httpClient';

// i18n
export { default as i18nInstance, initializeI18n, translate as t } from './i18n/i18n';

// Types
export * from './types/mfe-contracts';
