/**
 * API Key Service
 * Handles all API key management related operations
 */
import apiClient from '../lib/api-client';

// Define interfaces for API key data
export interface ApiKey {
  id: string;
  name: string;
  customerId: string;
  key?: string;
  keySuffix?: string;
  status: 'active' | 'inactive';
  environment: 'production' | 'development' | 'testing';
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
}

export interface ApiKeyCreateData {
  name: string;
  customerId: string;
  environment: string;
  permissions: string[];
}

export interface ApiKeyUpdateData {
  name?: string;
  status?: 'active' | 'inactive';
  permissions?: string[];
}

export interface ApiRateLimitData {
  requestsPerSecond: number;
  requestsPerDay: number;
  maxBurstSize?: number;
  enabled: boolean;
}

export interface ApiUsageParams {
  timeframe?: 'day' | 'week' | 'month';
  startDate?: string;
  endDate?: string;
}

export const ApiKeyService = {
  /**
   * Get all API keys for a customer
   */
  getApiKeys: async (params = {}) => {
    return apiClient.get('/api-keys', params);
  },
  
  /**
   * Get a specific API key by ID
   */
  getApiKeyById: async (id: string) => {
    return apiClient.get(`/api-keys/${id}`);
  },
  
  /**
   * Create a new API key for a customer
   */
  createApiKey: async (keyData: ApiKeyCreateData) => {
    return apiClient.post('/api-keys', keyData);
  },
  
  /**
   * Update an existing API key
   */
  updateApiKey: async (id: string, keyData: ApiKeyUpdateData) => {
    return apiClient.put(`/api-keys/${id}`, keyData);
  },
  
  /**
   * Delete an API key
   */
  deleteApiKey: async (id: string) => {
    return apiClient.delete(`/api-keys/${id}`);
  },

  /**
   * Get API usage statistics
   */
  getApiUsageStats: async (params: ApiUsageParams = {}) => {
    return apiClient.get('/api-keys/usage', params);
  },
  
  /**
   * Get API rate limits
   */
  getApiRateLimits: async (apiKeyId: string) => {
    return apiClient.get(`/api-keys/${apiKeyId}/rate-limits`);
  },
  
  /**
   * Update API rate limits
   */
  updateApiRateLimits: async (apiKeyId: string, limitData: ApiRateLimitData) => {
    return apiClient.put(`/api-keys/${apiKeyId}/rate-limits`, limitData);
  }
};

export default ApiKeyService;