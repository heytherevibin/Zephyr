/**
 * ApiKeyService Tests
 * Tests for the ApiKeyService functionality
 */
import ApiKeyService from '../api-key-service';
import apiClient from '../../lib/api-client';

// Mock the apiClient
jest.mock('../../lib/api-client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ApiKeyService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getApiKeys', () => {
    it('should call apiClient.get with the correct parameters', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            id: '1',
            name: 'Test Key',
            customerId: 'customer1',
            status: 'active',
            environment: 'production',
            permissions: ['read'],
            createdAt: '2023-01-01T00:00:00Z',
          },
        ],
        success: true,
      };
      
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      const result = await ApiKeyService.getApiKeys();
      
      // Assert
      expect(apiClient.get).toHaveBeenCalledWith('/api-keys', {});
      expect(result).toEqual(mockResponse);
    });
    
    it('should pass query parameters to apiClient.get', async () => {
      // Arrange
      const params = { customerId: 'customer1' };
      const mockResponse = { data: [], success: true };
      
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      await ApiKeyService.getApiKeys(params);
      
      // Assert
      expect(apiClient.get).toHaveBeenCalledWith('/api-keys', params);
    });
  });
  
  describe('getApiKeyById', () => {
    it('should call apiClient.get with the correct ID', async () => {
      // Arrange
      const id = '1';
      const mockResponse = {
        data: {
          id: '1',
          name: 'Test Key',
          customerId: 'customer1',
          status: 'active',
          environment: 'production',
          permissions: ['read'],
          createdAt: '2023-01-01T00:00:00Z',
        },
        success: true,
      };
      
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      const result = await ApiKeyService.getApiKeyById(id);
      
      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(`/api-keys/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('createApiKey', () => {
    it('should call apiClient.post with the correct data', async () => {
      // Arrange
      const keyData = {
        name: 'New Key',
        customerId: 'customer1',
        environment: 'production',
        permissions: ['read', 'write'],
      };
      
      const mockResponse = {
        data: {
          id: '2',
          ...keyData,
          status: 'active',
          createdAt: '2023-01-01T00:00:00Z',
        },
        success: true,
      };
      
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      const result = await ApiKeyService.createApiKey(keyData);
      
      // Assert
      expect(apiClient.post).toHaveBeenCalledWith('/api-keys', keyData);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('updateApiKey', () => {
    it('should call apiClient.put with the correct ID and data', async () => {
      // Arrange
      const id = '1';
      const keyData = {
        name: 'Updated Key',
        status: 'inactive',
      };
      
      const mockResponse = {
        data: {
          id: '1',
          name: 'Updated Key',
          customerId: 'customer1',
          status: 'inactive',
          environment: 'production',
          permissions: ['read'],
          createdAt: '2023-01-01T00:00:00Z',
        },
        success: true,
      };
      
      (apiClient.put as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      const result = await ApiKeyService.updateApiKey(id, keyData);
      
      // Assert
      expect(apiClient.put).toHaveBeenCalledWith(`/api-keys/${id}`, keyData);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('deleteApiKey', () => {
    it('should call apiClient.delete with the correct ID', async () => {
      // Arrange
      const id = '1';
      const mockResponse = { data: null, success: true };
      
      (apiClient.delete as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      const result = await ApiKeyService.deleteApiKey(id);
      
      // Assert
      expect(apiClient.delete).toHaveBeenCalledWith(`/api-keys/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('getApiUsageStats', () => {
    it('should call apiClient.get with default parameters when none provided', async () => {
      // Arrange
      const mockResponse = {
        data: {
          totalRequests: 100,
          requestsByEndpoint: { '/api/users': 50, '/api/products': 50 },
          requestsByDate: { '2023-01-01': 30, '2023-01-02': 70 },
        },
        success: true,
      };
      
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      const result = await ApiKeyService.getApiUsageStats();
      
      // Assert
      expect(apiClient.get).toHaveBeenCalledWith('/api-keys/usage', expect.any(Object));
      expect(result).toEqual(mockResponse);
    });
    
    it('should use provided parameters when available', async () => {
      // Arrange
      const params = {
        startDate: '2023-01-01T00:00:00Z',
        endDate: '2023-01-31T23:59:59Z',
        apiKeyId: '1',
      };
      
      const mockResponse = {
        data: {
          totalRequests: 100,
          requestsByEndpoint: { '/api/users': 50, '/api/products': 50 },
          requestsByDate: { '2023-01-01': 30, '2023-01-02': 70 },
        },
        success: true,
      };
      
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      const result = await ApiKeyService.getApiUsageStats(params);
      
      // Assert
      expect(apiClient.get).toHaveBeenCalledWith('/api-keys/usage', params);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('getApiRateLimits', () => {
    it('should call apiClient.get with the correct ID', async () => {
      // Arrange
      const apiKeyId = '1';
      const mockResponse = {
        data: {
          requestsPerSecond: 10,
          requestsPerDay: 1000,
          maxBurstSize: 20,
          enabled: true,
        },
        success: true,
      };
      
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      const result = await ApiKeyService.getApiRateLimits(apiKeyId);
      
      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(`/api-keys/${apiKeyId}/rate-limits`);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('updateApiRateLimits', () => {
    it('should call apiClient.put with the correct ID and data', async () => {
      // Arrange
      const apiKeyId = '1';
      const limitData = {
        requestsPerSecond: 20,
        requestsPerDay: 2000,
        maxBurstSize: 30,
        enabled: true,
      };
      
      const mockResponse = {
        data: limitData,
        success: true,
      };
      
      (apiClient.put as jest.Mock).mockResolvedValue(mockResponse);
      
      // Act
      const result = await ApiKeyService.updateApiRateLimits(apiKeyId, limitData);
      
      // Assert
      expect(apiClient.put).toHaveBeenCalledWith(`/api-keys/${apiKeyId}/rate-limits`, limitData);
      expect(result).toEqual(mockResponse);
    });
  });
}); 