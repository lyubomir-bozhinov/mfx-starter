import { useCallback, useState } from 'react';

/**
 * Hook for manually triggering error boundaries
 */
export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error: Error) => {
    setError(error);
  }, []);

  const throwError = useCallback((error: Error) => {
    throw error;
  }, []);

  return {
    error,
    resetError,
    captureError,
    throwError,
  };
};
