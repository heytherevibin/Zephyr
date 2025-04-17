/**
 * API Key Service
 * Handles all API key management related operations
 */
import apiClient from '../lib/api-client';
import type { ApiResponse } from '../lib/api-client';
import errorService from './error-service';

// Define interfaces for API key data
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  rateLimit?: {
    requests: number;
    period: string;
  };
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

export interface ApiUsage {
  totalRequests: number;
  requestsByEndpoint: Record<string, number>;
  requestsByDate: Record<string, number>;
}

export interface ApiUsageParams {
  startDate: string;
  endDate: string;
  apiKeyId: string;
  [key: string]: string; // Add index signature to satisfy Record<string, string>
}

export interface ApiUsageStats {
  totalRequests: number;
  requestsByEndpoint: Record<string, number>;
  requestsByDate: Record<string, number>;
}

// Define the service as a class to avoid property/accessor conflicts
class ApiKeyService {
  /**
   * Get all API keys for a customer
   */
  async getApiKeys(params = {}) {
    return apiClient.get<ApiResponse<ApiKey[]>>('/api-keys', params);
  }
  
  /**
   * Get a specific API key by ID
   */
  async getApiKeyById(id: string) {
    return apiClient.get<ApiResponse<ApiKey>>(`/api-keys/${id}`);
  }
  
  /**
   * Create a new API key for a customer
   */
  async createApiKey(keyData: ApiKeyCreateData) {
    try {
      const response = await apiClient.post<ApiResponse<ApiKey>>('/api-keys', keyData);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create API key');
      }
      
      return response.data;
    } catch (error) {
      errorService.handleApiError(error);
      throw error;
    }
  }
  
  /**
   * Update an existing API key
   */
  async updateApiKey(id: string, keyData: ApiKeyUpdateData) {
    return apiClient.put<ApiResponse<ApiKey>>(`/api-keys/${id}`, keyData);
  }
  
  /**
   * Delete an API key
   */
  async deleteApiKey(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/api/keys/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete API key');
      }
    } catch (error) {
      errorService.handleApiError(error);
      throw error;
    }
  }

  /**
   * Get API usage statistics
   */
  async getApiUsageStats(params: Partial<ApiUsageParams> = {}): Promise<ApiResponse<ApiUsageStats>> {
    const defaultParams: ApiUsageParams = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      endDate: new Date().toISOString(),
      apiKeyId: '',
      ...params
    };
    return apiClient.get<ApiResponse<ApiUsageStats>>('/api-keys/usage', defaultParams);
  }
  
  /**
   * Get API rate limits
   */
  async getApiRateLimits(apiKeyId: string) {
    return apiClient.get<ApiResponse<ApiRateLimitData>>(`/api-keys/${apiKeyId}/rate-limits`);
  }
  
  /**
   * Update API rate limits
   */
  async updateApiRateLimits(apiKeyId: string, limitData: ApiRateLimitData) {
    return apiClient.put<ApiResponse<ApiRateLimitData>>(`/api-keys/${apiKeyId}/rate-limits`, limitData);
  }

  /**
   * Get API usage data
   */
  async getApiUsage(params: ApiUsageParams): Promise<ApiUsage> {
    try {
      // Convert params to query string format
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      const response = await apiClient.get<ApiResponse<ApiUsage>>(`/api/usage?${queryParams.toString()}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch API usage data');
      }
      
      return response.data;
    } catch (error) {
      errorService.handleApiError(error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiKeyService = new ApiKeyService();