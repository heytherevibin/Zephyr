/**
 * Customer Service
 * Handles all customer-related API calls
 */
import apiClient from '../lib/api-client';

// Define interfaces for customer data
export interface Customer {
  id: string;
  name: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  plan?: string;
  users?: number;
  status: 'active' | 'inactive' | 'trial';
  country?: string;
  industry?: string;
  mrr?: number;
  joinDate: string;
}

export interface CustomerCreateData {
  name: string;
  email: string;
  contactPerson?: string;
  phone?: string;
  plan?: string;
  users?: number;
  status?: string;
  country?: string;
  industry?: string;
  mrr?: number;
}

export interface CustomerUpdateData {
  name?: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  plan?: string;
  users?: number;
  status?: string;
  country?: string;
  industry?: string;
  mrr?: number;
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  plan?: string;
  sort?: string;
  search?: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  averageTicketsPerDay: number;
  customerRetentionRate: number;
  avgResponseTime: string;
}

export const CustomerService = {
  /**
   * Get customers with optional filtering parameters
   */
  getCustomers: async (params: CustomerQueryParams = {}) => {
    return apiClient.get('/customers', params);
  },
  
  /**
   * Get a specific customer by ID
   */
  getCustomerById: async (id: string) => {
    return apiClient.get(`/customers/${id}`);
  },
  
  /**
   * Create a new customer
   */
  createCustomer: async (customerData: CustomerCreateData) => {
    return apiClient.post('/customers', customerData);
  },
  
  /**
   * Update an existing customer
   */
  updateCustomer: async (id: string, customerData: CustomerUpdateData) => {
    return apiClient.put(`/customers/${id}`, customerData);
  },
  
  /**
   * Delete a customer
   */
  deleteCustomer: async (id: string) => {
    return apiClient.delete(`/customers/${id}`);
  },

  /**
   * Get customer statistics
   */
  getCustomerStats: async () => {
    return apiClient.get<{ data: CustomerStats }>('/customers/stats');
  }
};

export default CustomerService;