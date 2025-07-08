import React, { Component, ReactNode } from 'react';
import { eventDispatcher } from '@mfx/shared-utils';

export interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: ReactNode;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const DefaultFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => (
  <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
    <div className="text-center">
      <div className="text-red-400 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-900 mb-2">Something went wrong</h3>
      <p className="text-sm text-red-700 mb-4">
        This section encountered an error and couldn't be loaded.
      </p>
      <button
        onClick={resetError}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Try again
      </button>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm font-medium text-red-800 hover:text-red-900">
            Error details (development only)
          </summary>
          <pre className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded border overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  </div>
);

/**
 * Error boundary component for graceful error handling
 * Catches JavaScript errors in child components and displays fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Dispatch global error event
    eventDispatcher.dispatchEvent('API_ERROR', {
      type: 'COMPONENT_ERROR',
      message: 'A component error occurred',
      originalError: error,
      errorInfo,
    }, 'error-boundary');
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultFallback;
      return (
        <div className={this.props.className}>
          <FallbackComponent error={this.state.error} resetError={this.resetError} />
        </div>
      );
    }

    return this.props.children;
  }
}
