/**
 * Module Federation Contracts
 * 
 * This file defines TypeScript interfaces for components and data
 * that are shared between different microfrontends through Module Federation.
 */

/**
 * Base props for all MFE components
 */
export interface BaseMfeProps {
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

/**
 * Angular Widget Props
 */
export interface AngularWidgetProps extends BaseMfeProps {
  title?: string;
  data?: any;
  onAction?: (action: string, data?: any) => void;
  config?: {
    theme?: 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary';
  };
}

/**
 * Svelte Widget Props
 */
export interface SvelteWidgetProps extends BaseMfeProps {
  title?: string;
  items?: any[];
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  config?: {
    theme?: 'light' | 'dark';
    showHeader?: boolean;
    allowEdit?: boolean;
  };
}

/**
 * Route configuration for MFE routing
 */
export interface MfeRouteConfig {
  path: string;
  component: string;
  exact?: boolean;
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    roles?: string[];
  };
}

/**
 * Angular Routes Props
 */
export interface AngularRoutesProps {
  basePath?: string;
  routes?: MfeRouteConfig[];
  fallback?: React.ComponentType;
}

/**
 * Svelte Routes Props
 */
export interface SvelteRoutesProps {
  basePath?: string;
  routes?: MfeRouteConfig[];
  fallback?: React.ComponentType;
}

/**
 * Event payload types for cross-MFE communication
 */
export interface ApiErrorPayload {
  type: string;
  message: string;
  status?: number;
  originalError?: any;
  validationErrors?: Record<string, string[]>;
}

export interface NotificationPayload {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface RouteChangePayload {
  from: string;
  to: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export interface ThemeChangePayload {
  theme: 'light' | 'dark';
  colors?: Record<string, string>;
}

export interface LanguageChangePayload {
  language: string;
  previousLanguage: string;
}

/**
 * MFE module export interfaces
 */
export interface MfeModule {
  name: string;
  version: string;
  exports: string[];
}

export interface AngularModule extends MfeModule {
  bootstrap: () => Promise<void>;
  mount: (element: HTMLElement, props?: AngularWidgetProps) => Promise<void>;
  unmount: (element: HTMLElement) => Promise<void>;
}

export interface SvelteModule extends MfeModule {
  mount: (element: HTMLElement, props?: SvelteWidgetProps) => Promise<void>;
  unmount: (element: HTMLElement) => Promise<void>;
}

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: any) => void;
  children: React.ReactNode;
}

/**
 * Role-based access control props
 */
export interface RoleGateProps {
  roles: string[];
  mode?: 'any' | 'all';
  fallback?: React.ComponentType;
  children: React.ReactNode;
}

/**
 * Global notification props
 */
export interface GlobalNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
  defaultDuration?: number;
}

/**
 * Shared component props
 */
export interface ButtonProps extends BaseMfeProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

/**
 * Configuration interfaces
 */
export interface MfeConfig {
  name: string;
  version: string;
  url: string;
  scope: string;
  module: string;
  fallback?: React.ComponentType;
  retryAttempts?: number;
  timeout?: number;
}

export interface HostConfig {
  mfes: MfeConfig[];
  router: {
    type: 'browser' | 'hash' | 'memory';
    basename?: string;
  };
  auth: {
    enabled: boolean;
    loginUrl?: string;
    logoutUrl?: string;
  };
  i18n: {
    enabled: boolean;
    defaultLanguage: string;
    supportedLanguages: string[];
  };
}

/**
 * Type guards
 */
export const isAngularWidgetProps = (props: any): props is AngularWidgetProps => {
  return typeof props === 'object' && props !== null;
};

export const isSvelteWidgetProps = (props: any): props is SvelteWidgetProps => {
  return typeof props === 'object' && props !== null;
};

export const isApiErrorPayload = (payload: any): payload is ApiErrorPayload => {
  return typeof payload === 'object' && payload !== null && 'type' in payload && 'message' in payload;
};

export const isNotificationPayload = (payload: any): payload is NotificationPayload => {
  return typeof payload === 'object' && payload !== null && 'message' in payload && 'type' in payload;
};
