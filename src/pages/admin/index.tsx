import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, Database, CreditCard, BarChart2, Globe, Server, 
  Shield, Bell, Package, LifeBuoy, FileText, AlertTriangle, CheckCircle, 
  ArrowRight, Search, Grid, List, MoreVertical, Download, Filter, Trash2,
  Edit, Eye, UserPlus, Building, DollarSign, RefreshCw, Lock, Unlock,
  Copy, Key, Clock, PlusCircle, AlertCircle, Terminal, ExternalLink, ToggleLeft,
  ToggleRight, Save, Calendar, XCircle, Mail, Phone, Flag, Map, Info, Headset, PhoneCall, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Import our API services
import CustomerService from '../../src/services/customer-service';
import ApiKeyService from '../../src/services/api-key-service';

// Define TypeScript interfaces
interface Customer {
  id: string;
  name: string;
  email?: string;
  plan: string;
  users: number;
  status: 'active' | 'inactive' | 'trial';
  mrr: number;
  joinDate: string;
  contactPerson?: string;
  phone?: string;
  country?: string;
  industry?: string;
  totalConversations?: number;
}

interface ApiKey {
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
  usage?: {
    current?: {
      requestsToday: number;
      requestsThisMonth: number;
    }
  };
}

interface ApiUsageStats {
  total: number;
  data: Array<{
    date?: string;
    week?: string;
    month?: string;
    requests: number;
  }>;
}

interface Alert {
  id: number;
  type: 'warning' | 'critical' | 'info' | 'success';
  message: string;
  time: string;
}

interface StatsData {
  totalCustomers?: number;
  activeSubscriptions?: number;
  monthlyRecurringRevenue?: number;
  averageTicketsPerDay?: number;
  customerRetentionRate?: number;
  avgResponseTime?: string;
}

interface CustomerFormData {
  name: string;
  email: string;
  contactPerson: string;
  phone: string;
  plan: string;
  users: number;
  status: string;
  country: string;
  industry: string;
  mrr: number;
}

interface ApiKeyFormData {
  name: string;
  customerId: string;
  environment: string;
  permissions: string[];
}

interface CustomerFilters {
  status: string;
  plan: string;
  sort: string;
}

// Demo data for the super admin interface - will be replaced with API calls
// We keep this for fallback/loading states
const demoData = {
  stats: {
    totalCustomers: 3482,
    activeSubscriptions: 2947,
    monthlyRecurringRevenue: 289750,
    averageTicketsPerDay: 143,
    customerRetentionRate: 94.2,
    avgResponseTime: '1h 12m',
  },
  recentCustomers: [
    { 
      id: 'CUS-7834', 
      name: 'Acme Corporation', 
      plan: 'Enterprise', 
      users: 58, 
      status: 'active',
      mrr: 2999,
      joinDate: '2024-11-05'
    },
    { 
      id: 'CUS-7835', 
      name: 'Globex Systems', 
      plan: 'Business Pro', 
      users: 27, 
      status: 'active',
      mrr: 1299,
      joinDate: '2025-01-12'
    },
    { 
      id: 'CUS-7836', 
      name: 'Initech LLC', 
      plan: 'Business Pro', 
      users: 24, 
      status: 'active',
      mrr: 1299,
      joinDate: '2025-02-03'
    },
    { 
      id: 'CUS-7837', 
      name: 'Massive Dynamic', 
      plan: 'Enterprise', 
      users: 112, 
      status: 'active',
      mrr: 3999,
      joinDate: '2024-08-21'
    },
    { 
      id: 'CUS-7838', 
      name: 'Stark Industries', 
      plan: 'Enterprise Plus', 
      users: 84, 
      status: 'active',
      mrr: 5299,
      joinDate: '2024-06-14'
    }
  ],
  alerts: [
    {
      id: 1,
      type: 'warning',
      message: 'API usage at 85% of quota for CustomerCare.io',
      time: '2025-04-11T07:22:15Z'
    },
    {
      id: 2,
      type: 'critical',
      message: 'Database performance issues detected in EU region',
      time: '2025-04-11T06:14:33Z'
    },
    {
      id: 3,
      type: 'info',
      message: 'System update scheduled for April 15, 2025 at 02:00 UTC',
      time: '2025-04-10T15:30:00Z'
    },
    {
      id: 4,
      type: 'success',
      message: 'New payment gateway integration successfully deployed',
      time: '2025-04-10T12:45:18Z'
    }
  ]
} as const;

const SuperAdminPanel: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Add state for API data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<StatsData>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // API Management tab state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [apiUsageStats, setApiUsageStats] = useState<ApiUsageStats | null>(null);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [apiKeyDetailMode, setApiKeyDetailMode] = useState<'view' | 'edit' | 'create' | null>(null);
  const [usageTimeframe, setUsageTimeframe] = useState<'day' | 'week' | 'month'>('day');
  
  // API Key creation form
  const [newApiKeyForm, setNewApiKeyForm] = useState<ApiKeyFormData>({
    name: '',
    customerId: '',
    environment: 'production',
    permissions: ['read']
  });
  
  // API Key edit form
  const [editApiKeyForm, setEditApiKeyForm] = useState<ApiKey | null>(null);

  // Customers tab state
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDetailMode, setCustomerDetailMode] = useState<'view' | 'edit' | 'create' | null>(null);
  const [customerPage, setCustomerPage] = useState<number>(1);
  const [customerTotalPages, setCustomerTotalPages] = useState<number>(1);
  const [customerFilters, setCustomerFilters] = useState<CustomerFilters>({
    status: '',
    plan: '',
    sort: 'joinDate:desc'
  });
  
  // Customer creation/edit form
  const [customerForm, setCustomerForm] = useState<CustomerFormData>({
    name: '',
    email: '',
    contactPerson: '',
    phone: '',
    plan: 'Starter',
    users: 1,
    status: 'active',
    country: '',
    industry: '',
    mrr: 0
  });

  // Load data when the component mounts or when the current tab changes
  useEffect(() => {
    // Only fetch data for the dashboard tab initially
    if (currentTab === 'dashboard') {
      fetchDashboardData();
    } else if (currentTab === 'apiManagement') {
      fetchApiManagementData();
    } else if (currentTab === 'customers') {
      fetchCustomersData();
    }
  }, [currentTab]);

  // Function to fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch customer stats
      const customerStats = await CustomerService.getCustomerStats();
      setStats(customerStats.data);
      
      // Fetch recent customers
      const recentCustomersResponse = await CustomerService.getCustomers({ 
        limit: 5, 
        sort: 'joinDate:desc' 
      });
      setCustomers(recentCustomersResponse.data);
      
      // For now, use demo alerts until we create an alerts API
      setAlerts(demoData.alerts);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
      
      // Fallback to demo data if API fails
      setStats(demoData.stats);
      setCustomers(demoData.recentCustomers);
      setAlerts(demoData.alerts);
    }
  };
  
  // Function to fetch API management data
  const fetchApiManagementData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch API keys
      const apiKeysResponse = await ApiKeyService.getApiKeys();
      setApiKeys(apiKeysResponse.data);
      
      // Fetch API usage statistics
      const apiUsageResponse = await ApiKeyService.getApiUsageStats({
        timeframe: usageTimeframe
      });
      setApiUsageStats(apiUsageResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching API management data:', err);
      setError('Failed to load API management data. Please try again.');
      setLoading(false);
    }
  };

  // Function to fetch customers data
  const fetchCustomersData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare query parameters
      const queryParams = {
        page: customerPage,
        limit: 10,
        ...customerFilters
      };
      
      if (searchQuery) {
        queryParams.search = searchQuery;
      }
      
      // Fetch customers
      const customersResponse = await CustomerService.getCustomers(queryParams);
      setCustomersList(customersResponse.data);
      setCustomerTotalPages(customersResponse.totalPages || 1);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers data:', err);
      setError('Failed to load customers data. Please try again.');
      setLoading(false);
      
      // Fallback to demo data if API fails
      setCustomersList(demoData.recentCustomers as Customer[]);
    }
  };

  // Re-fetch customers when filters, page or search query changes
  useEffect(() => {
    if (currentTab === 'customers') {
      fetchCustomersData();
    }
  }, [customerPage, customerFilters, searchQuery, currentTab]);

  // Handle API key creation
  const handleCreateApiKey = async () => {
    try {
      setLoading(true);
      
      const response = await ApiKeyService.createApiKey(newApiKeyForm);
      
      // Add new key to the list and reset form
      setApiKeys([...apiKeys, response.data]);
      setNewApiKeyForm({
        name: '',
        customerId: '',
        environment: 'production',
        permissions: ['read']
      });
      
      setApiKeyDetailMode(null);
      setLoading(false);
      
      // Show a success message
      // This could be implemented with a toast notification system
    } catch (err) {
      console.error('Error creating API key:', err);
      setError('Failed to create API key. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle API key update
  const handleUpdateApiKey = async () => {
    if (!editApiKeyForm) return;
    
    try {
      setLoading(true);
      
      const response = await ApiKeyService.updateApiKey(
        editApiKeyForm.id,
        editApiKeyForm
      );
      
      // Update the key in the list
      const updatedKeys = apiKeys.map(key => 
        key.id === response.data.id ? response.data : key
      );
      
      setApiKeys(updatedKeys);
      setApiKeyDetailMode(null);
      setSelectedApiKey(response.data);
      setLoading(false);
      
      // Show a success message
    } catch (err) {
      console.error('Error updating API key:', err);
      setError('Failed to update API key. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle API key deletion
  const handleDeleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      await ApiKeyService.deleteApiKey(keyId);
      
      // Remove the key from the list
      const filteredKeys = apiKeys.filter(key => key.id !== keyId);
      setApiKeys(filteredKeys);
      
      if (selectedApiKey && selectedApiKey.id === keyId) {
        setSelectedApiKey(null);
        setApiKeyDetailMode(null);
      }
      
      setLoading(false);
      
      // Show a success message
    } catch (err) {
      console.error('Error deleting API key:', err);
      setError('Failed to delete API key. Please try again.');
      setLoading(false);
    }
  };

  // Handle customer creation
  const handleCreateCustomer = async () => {
    try {
      setLoading(true);
      
      const response = await CustomerService.createCustomer(customerForm);
      
      // Add new customer to the list and reset form
      setCustomersList([response.data, ...customersList]);
      setCustomerForm({
        name: '',
        email: '',
        contactPerson: '',
        phone: '',
        plan: 'Starter',
        users: 1,
        status: 'active',
        country: '',
        industry: '',
        mrr: 0
      });
      
      setCustomerDetailMode(null);
      setLoading(false);
      
      // Show a success message (could be implemented with toast)
    } catch (err) {
      console.error('Error creating customer:', err);
      setError('Failed to create customer. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle customer update
  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;
    
    try {
      setLoading(true);
      
      const response = await CustomerService.updateCustomer(
        selectedCustomer.id,
        customerForm
      );
      
      // Update the customer in the list
      const updatedCustomers = customersList.map(customer => 
        customer.id === response.data.id ? response.data : customer
      );
      
      setCustomersList(updatedCustomers);
      setCustomerDetailMode(null);
      setSelectedCustomer(response.data);
      setLoading(false);
      
      // Show a success message
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('Failed to update customer. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle customer deletion
  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      await CustomerService.deleteCustomer(customerId);
      
      // Remove the customer from the list
      const filteredCustomers = customersList.filter(customer => customer.id !== customerId);
      setCustomersList(filteredCustomers);
      
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer(null);
        setCustomerDetailMode(null);
      }
      
      setLoading(false);
      
      // Show a success message
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer. Please try again.');
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount?: number): string => {
    if (amount === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format relative time
  const formatRelativeTime = (dateString?: string): string => {
    if (!dateString) return 'Never used';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hrs ago`;
    } else {
      return formatDate(dateString);
    }
  };
  
  // Format large numbers with commas
  const formatNumber = (num?: number): string => {
    return num?.toLocaleString() || '0';
  };
  
  // Copy API key to clipboard
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show a temporary success message (could be implemented with a toast notification)
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  };

  // View for API Management tab
  const renderApiManagementTab = () => {
    if (apiKeyDetailMode === 'create') {
      return renderCreateApiKeyForm();
    }
    
    if (selectedApiKey && apiKeyDetailMode === 'edit') {
      return renderEditApiKeyForm();
    }
    
    if (selectedApiKey && apiKeyDetailMode === 'view') {
      return renderApiKeyDetail();
    }
    
    return (
      <div className="space-y-6">
        {/* API Usage Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">API Usage Overview</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setUsageTimeframe('day')}
                className={`px-3 py-1 text-sm rounded-md ${usageTimeframe === 'day' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'}`}
              >
                Daily
              </button>
              <button 
                onClick={() => setUsageTimeframe('week')}
                className={`px-3 py-1 text-sm rounded-md ${usageTimeframe === 'week' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setUsageTimeframe('month')}
                className={`px-3 py-1 text-sm rounded-md ${usageTimeframe === 'month' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'}`}
              >
                Monthly
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : apiUsageStats ? (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Total Requests ({usageTimeframe})</div>
                    <div className="text-3xl font-semibold">{formatNumber(apiUsageStats.total)}</div>
                  </div>
                  
                  {/* Simple fake chart using bars for demo purposes */}
                  <div className="flex items-end h-16 space-x-1">
                    {apiUsageStats.data.map((item, index) => (
                      <div 
                        key={index} 
                        className="w-8 bg-blue-500 rounded-t"
                        style={{ 
                          height: `${(item.requests / Math.max(...apiUsageStats.data.map(d => d.requests))) * 100}%`,
                          minHeight: '10%'
                        }}
                        title={`${item.date || item.week || item.month}: ${item.requests.toLocaleString()} requests`}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Average Daily Requests</div>
                    <div className="text-xl font-semibold mt-1">
                      {formatNumber(Math.round(apiUsageStats.total / apiUsageStats.data.length))}
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Active API Keys</div>
                    <div className="text-xl font-semibold mt-1">
                      {formatNumber(apiKeys.filter(key => key.status === 'active').length)}
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="text-sm text-gray-500">API Health</div>
                    <div className="text-xl font-semibold mt-1 flex items-center text-green-600">
                      <CheckCircle size={18} className="mr-1" />
                      100% Uptime
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No usage data available
              </div>
            )}
          </div>
        </div>
        
        {/* API Keys Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">API Keys</h3>
            <button 
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center hover:bg-blue-700 transition-colors"
              onClick={() => setApiKeyDetailMode('create')}
            >
              <PlusCircle size={16} className="mr-1" />
              Create New Key
            </button>
          </div>
          
          {/* Search and filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search API keys..."
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              
              <button className="px-3 py-2 border border-gray-300 rounded-md flex items-center text-gray-600 hover:bg-gray-50">
                <Filter size={16} className="mr-1" />
                Filter
              </button>
            </div>
          </div>
          
          {/* API keys list */}
          <div className="overflow-x-auto">
            {/* ...existing code... */}
          </div>
        </div>
        
        {/* API Documentation & Resources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* ...existing code... */}
        </div>
      </div>
    );
  };

  // View for Customers tab
  const renderCustomersTab = () => {
    if (customerDetailMode === 'create') {
      return renderCreateCustomerForm();
    }
    
    if (selectedCustomer && customerDetailMode === 'edit') {
      return renderEditCustomerForm();
    }
    
    if (selectedCustomer && customerDetailMode === 'view') {
      return renderCustomerDetail();
    }
    
    return (
      <div className="space-y-6">
        {/* Customers Overview */}
        {/* ...existing code... */}
      </div>
    );
  };

  // Placeholder methods for form renders
  const renderCreateApiKeyForm = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Create New API Key</h3>
      {/* Form would be implemented here */}
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
          onClick={() => setApiKeyDetailMode(null)}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleCreateApiKey}
        >
          Create Key
        </button>
      </div>
    </div>
  );

  const renderEditApiKeyForm = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Edit API Key</h3>
      {/* Form would be implemented here */}
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
          onClick={() => setApiKeyDetailMode('view')}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleUpdateApiKey}
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderApiKeyDetail = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">API Key Details</h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            setSelectedApiKey(null);
            setApiKeyDetailMode(null);
          }}
        >
          <XCircle size={18} />
        </button>
      </div>
      {/* Key details would be implemented here */}
    </div>
  );

  const renderCreateCustomerForm = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Customer</h3>
      {/* Form would be implemented here */}
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
          onClick={() => setCustomerDetailMode(null)}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleCreateCustomer}
        >
          Create Customer
        </button>
      </div>
    </div>
  );

  const renderEditCustomerForm = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Customer</h3>
      {/* Form would be implemented here */}
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
          onClick={() => setCustomerDetailMode('view')}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleUpdateCustomer}
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderCustomerDetail = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Customer Details</h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            setSelectedCustomer(null);
            setCustomerDetailMode(null);
          }}
        >
          <XCircle size={18} />
        </button>
      </div>
      {/* Customer details would be implemented here */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Zephyr Chat | Super Admin</title>
        <meta name="description" content="Super admin panel for Zephyr Chat SaaS platform" />
      </Head>

      {/* Show error notification if API request failed */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50">
          <div className="flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            <p>{error}</p>
            <button 
              className="ml-4 text-red-700 hover:text-red-900" 
              onClick={() => setError(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Side navigation */}
        <div className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-lg mr-3">
                <span className="font-bold text-lg">Z</span>
              </div>
              <div>
                <h1 className="font-medium text-lg">Zephyr Admin</h1>
                <span className="text-xs text-gray-400">Super Admin Panel</span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* ...existing code... */}
          </nav>
          
          <div className="p-4 border-t border-gray-800">
            {/* ...existing code... */}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ...existing code... */}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPanel;