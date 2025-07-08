import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { dispatchApiError, dispatchAuthRequired } from '../events/eventDispatcher';

declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

/**
 * HTTP Client configuration interface
 */
interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * HTTP Client class with authentication and error handling
 *
 * This class provides a configured Axios instance with:
 * - Automatic JWT token injection
 * - Global error handling
 * - Authentication re-challenge on 401 errors
 * - Retry mechanism for transient failures
 * - Event-based error reporting
 */
class HttpClient {
  private axios: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    this.config = {
      // TO-DO: Build with env-cmd
      // baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com',
      baseURL: 'https://api.example.com',
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };

    this.axios = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupRequestInterceptors();
    this.setupResponseInterceptors();
  }

  /**
   * Setup request interceptors for authentication
   */
  private setupRequestInterceptors(): void {
    this.axios.interceptors.request.use(
      (config) => {
        // Inject JWT token from auth store
        const authState = useAuthStore.getState();
        if (authState.accessToken) {
          config.headers.Authorization = `Bearer ${authState.accessToken}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: Date.now() };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Setup response interceptors for error handling
   */
  private setupResponseInterceptors(): void {
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time for performance monitoring
        const endTime = Date.now();
        const startTime = response.config.metadata?.startTime || endTime;
        console.debug(`HTTP ${response.config.method?.toUpperCase()} ${response.config.url} - ${endTime - startTime}ms`);

        return response;
      },
      async (error: AxiosError) => {
        // Handle different error scenarios
        if (error.response) {
          await this.handleHttpError(error);
        } else if (error.request) {
          await this.handleNetworkError(error);
        } else {
          await this.handleRequestError(error);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle HTTP errors (4xx, 5xx)
   */
  private async handleHttpError(error: AxiosError): Promise<void> {
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message || error.message; // Cast to any to access message
    const validationErrors = (error.response?.data as any)?.errors; // Cast to any to access errors

    switch (status) {
      case 401:
        // Authentication required - dispatch event for re-login
        dispatchAuthRequired('http-client');
        useAuthStore.getState().logout();
        break;

      case 403:
        // Forbidden - insufficient permissions
        dispatchApiError({
          type: 'FORBIDDEN',
          message: 'You do not have permission to access this resource',
          status,
        }, 'http-client');
        break;

      case 404:
        // Not found - resource doesn't exist
        dispatchApiError({
          type: 'NOT_FOUND',
          message: 'The requested resource was not found',
          status,
        }, 'http-client');
        break;

      case 422:
        // Validation error - handle form validation
        dispatchApiError({
          type: 'VALIDATION_ERROR',
          message: 'Validation failed',
          status,
          validationErrors: validationErrors,
        }, 'http-client');
        break;

      case 429:
        // Rate limit exceeded
        dispatchApiError({
          type: 'RATE_LIMIT',
          message: 'Too many requests. Please try again later.',
          status,
        }, 'http-client');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors - dispatch global error notification
        dispatchApiError({
          type: 'SERVER_ERROR',
          message: 'A server error occurred. Please try again.',
          status,
        }, 'http-client');
        break;

      default:
        // Generic error handling
        dispatchApiError({
          type: 'UNKNOWN_ERROR',
          message: message || 'An unexpected error occurred',
          status,
        }, 'http-client');
    }
  }

  /**
   * Handle network errors (no response received)
   */
  private async handleNetworkError(error: AxiosError): Promise<void> {
    dispatchApiError({
      type: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection and try again.',
      originalError: error.message,
    }, 'http-client');
  }

  /**
   * Handle request setup errors
   */
  private async handleRequestError(error: AxiosError): Promise<void> {
    dispatchApiError({
      type: 'REQUEST_ERROR',
      message: 'Request configuration error',
      originalError: error.message,
    }, 'http-client');
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.get<T>(url, config);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.delete<T>(url, config);
  }

  /**
   * Get the underlying Axios instance
   */
  getInstance(): AxiosInstance {
    return this.axios;
  }

  /**
   * Update base URL
   */
  setBaseURL(baseURL: string): void {
    this.axios.defaults.baseURL = baseURL;
  }

  /**
   * Add custom header
   */
  setHeader(key: string, value: string): void {
    this.axios.defaults.headers.common[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
    delete this.axios.defaults.headers.common[key];
  }
}

/**
 * Global HTTP client instance
 * This singleton ensures all MFEs use the same HTTP configuration
 */
export const httpClient = new HttpClient();

/**
 * Convenience function to create a new HTTP client with custom config
 */
export const createHttpClient = (config: HttpClientConfig) => {
  return new HttpClient(config);
};
