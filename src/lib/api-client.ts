/**
 * API Client for Zephyr application
 * Handles API requests with authentication and error handling
 */

import errorService from '../services/error-service';

// Define types for API responses and requests
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date | string;
  status?: 'sent' | 'delivered' | 'read';
}

interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  url: string;
  tags: string[];
}

interface AnalyticsEvent {
  event: string;
  userId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

type ApiHeaders = Record<string, string>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

/**
 * Get headers with authorization token if available
 */
const getHeaders = (): ApiHeaders => {
  const headers: ApiHeaders = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available (client-side only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  // Check if the request was successful
  if (!response.ok) {
    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      // Client-side only
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }

    // Get error message from the response body
    const errorData = await response.json();
    const error = new Error(errorData.message || 'Something went wrong') as ApiError;
    error.statusCode = response.status;
    error.details = errorData;

    // Log the error using the error service
    errorService.handleApiError({
      response: {
        status: response.status,
        data: errorData
      }
    });

    throw error;
  }

  // Parse JSON response
  return response.json();
};

/**
 * API client with methods for CRUD operations
 */
const apiClient = {
  get: async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      return handleResponse<T>(response);
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  post: async <T>(endpoint: string, data: any = {}): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: 'include',
      });

      return handleResponse<T>(response);
    } catch (error) {
      console.error(`POST request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  put: async <T>(endpoint: string, data: any = {}): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: 'include',
      });

      return handleResponse<T>(response);
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      });

      return handleResponse<T>(response);
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  },
};

// Additional chat-specific API methods
const chatApi = {
  sendMessage: async (message: Partial<ChatMessage>, conversationId?: string) => {
    return apiClient.post<ApiResponse<ChatMessage>>('/chat', { 
      message,
      conversationId 
    });
  },
  
  getConversationHistory: async (conversationId: string) => {
    return apiClient.get<ApiResponse<ChatMessage[]>>(`/chat?conversationId=${conversationId}`);
  },
  
  searchKnowledgeBase: async (query: string) => {
    return apiClient.post<ApiResponse<KnowledgeArticle[]>>('/chat/knowledge-search', { query });
  },
  
  trackAnalytics: async (event: AnalyticsEvent) => {
    return apiClient.post<ApiResponse>('/chat/analytics', event);
  }
};

export { apiClient as default, chatApi };
export type { ApiResponse, ChatMessage, KnowledgeArticle, AnalyticsEvent };