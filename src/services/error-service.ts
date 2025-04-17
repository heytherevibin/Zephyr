/**
 * Error Service
 * Provides consistent error handling across the application
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATABASE = 'database',
  UI = 'ui',
  API = 'api',
  UNKNOWN = 'unknown'
}

export interface ErrorDetails {
  message: string;
  code?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  stackTrace?: string;
  context?: Record<string, any>;
}

class ErrorService {
  private errors: ErrorDetails[] = [];
  private errorListeners: ((error: ErrorDetails) => void)[] = [];

  /**
   * Log an error with the error service
   */
  logError(
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context?: Record<string, any>
  ): ErrorDetails {
    const error: ErrorDetails = {
      message,
      severity,
      category,
      timestamp: new Date(),
      context
    };

    // Add stack trace if available
    try {
      throw new Error();
    } catch (e) {
      if (e instanceof Error) {
        error.stackTrace = e.stack;
      }
    }

    this.errors.push(error);
    
    // Notify listeners
    this.notifyListeners(error);
    
    // Log to console based on severity
    this.logToConsole(error);
    
    return error;
  }

  /**
   * Log error to console based on severity
   */
  private logToConsole(error: ErrorDetails): void {
    const { message, severity, category, context } = error;
    
    const logMessage = `[${category.toUpperCase()}] ${message}`;
    
    switch (severity) {
      case ErrorSeverity.LOW:
        console.log(logMessage, context || '');
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(logMessage, context || '');
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        console.error(logMessage, context || '');
        break;
    }
  }

  /**
   * Get all logged errors
   */
  getErrors(): ErrorDetails[] {
    return [...this.errors];
  }

  /**
   * Clear all logged errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Add an error listener
   */
  addErrorListener(listener: (error: ErrorDetails) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * Remove an error listener
   */
  removeErrorListener(listener: (error: ErrorDetails) => void): void {
    this.errorListeners = this.errorListeners.filter(l => l !== listener);
  }

  /**
   * Notify all error listeners
   */
  private notifyListeners(error: ErrorDetails): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });
  }

  /**
   * Handle API errors
   */
  handleApiError(error: any): ErrorDetails {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data;
      
      let category = ErrorCategory.API;
      let severity = ErrorSeverity.MEDIUM;
      
      if (status === 401) {
        category = ErrorCategory.AUTHENTICATION;
        severity = ErrorSeverity.HIGH;
      } else if (status === 403) {
        category = ErrorCategory.AUTHORIZATION;
        severity = ErrorSeverity.HIGH;
      } else if (status >= 500) {
        severity = ErrorSeverity.HIGH;
      }
      
      return this.logError(
        data.message || `API Error: ${status}`,
        severity,
        category,
        { status, data }
      );
    } else if (error.request) {
      // The request was made but no response was received
      return this.logError(
        'Network Error: No response received',
        ErrorSeverity.HIGH,
        ErrorCategory.NETWORK,
        { request: error.request }
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return this.logError(
        `Request Error: ${error.message}`,
        ErrorSeverity.MEDIUM,
        ErrorCategory.NETWORK
      );
    }
  }
}

// Create and export a singleton instance
const errorService = new ErrorService();

export default errorService; 