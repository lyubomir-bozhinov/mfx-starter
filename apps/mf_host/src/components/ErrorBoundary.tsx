import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@mfx/ui-components';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const DefaultFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => (
  <div className='mfe-container'>
    <div className='text-center py-8'>
      <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
      <h3 className='text-lg font-medium text-gray-900 mb-2'>Something went wrong</h3>
      <p className='text-gray-600 mb-6'>
        This section encountered an error and couldn't be loaded properly.
      </p>
      <Button onClick={resetError} variant='primary' size='sm'>
        <RefreshCw className='w-4 h-4 mr-2' />
        Try Again
      </Button>
      {process.env.NODE_ENV === 'development' && (
        <details className='mt-6 text-left'>
          <summary className='cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900'>
            Error Details (Development Only)
          </summary>
          <pre className='mt-2 text-xs text-red-700 bg-red-50 p-3 rounded border overflow-auto'>
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  </div>
);

/**
 * Error boundary component for graceful error handling of microfrontend modules
 * Catches JavaScript errors in child components and displays fallback UI
 */
class ErrorBoundaryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // In a real application, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundaryComponent;
