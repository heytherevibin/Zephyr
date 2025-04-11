import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, Database, CreditCard, BarChart2, Globe, Server, 
  Shield, Bell, Package, LifeBuoy, FileText, AlertTriangle, CheckCircle, 
  ArrowRight, Search, Grid, List, MoreVertical, Download, Filter, Trash2,
  Edit, Eye, UserPlus, Building, DollarSign, RefreshCw, Lock, Unlock
} from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Demo data for the super admin interface
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
  recentServiceProviders: [
    {
      id: 'SP-1234',
      name: 'Support Heroes Inc.',
      customers: 47,
      agents: 38,
      activeTickets: 192,
      status: 'active',
      plan: 'Partner',
      lastLogin: '2025-04-10T08:23:15Z'
    },
    {
      id: 'SP-1235',
      name: 'CustomerCare.io',
      customers: 31,
      agents: 22,
      activeTickets: 129,
      status: 'active',
      plan: 'Professional',
      lastLogin: '2025-04-11T09:45:22Z'
    },
    {
      id: 'SP-1236',
      name: 'Quick Response Team',
      customers: 18,
      agents: 12,
      activeTickets: 76,
      status: 'active',
      plan: 'Professional',
      lastLogin: '2025-04-09T14:12:08Z'
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
};

const SuperAdminPanel = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hrs ago`;
    } else {
      return formatDate(dateString);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Zephyr Chat | Super Admin</title>
        <meta name="description" content="Super admin panel for Zephyr Chat SaaS platform" />
      </Head>

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
            <a 
              href="#" 
              className={`flex items-center px-3 py-2.5 rounded-lg ${currentTab === 'dashboard' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setCurrentTab('dashboard')}
            >
              <Grid size={18} className="mr-3" />
              Dashboard
            </a>
            <a 
              href="#" 
              className={`flex items-center px-3 py-2.5 rounded-lg ${currentTab === 'customers' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setCurrentTab('customers')}
            >
              <Building size={18} className="mr-3" />
              Customers
            </a>
            <a 
              href="#" 
              className={`flex items-center px-3 py-2.5 rounded-lg ${currentTab === 'serviceProviders' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setCurrentTab('serviceProviders')}
            >
              <Users size={18} className="mr-3" />
              Service Providers
            </a>
            <a 
              href="#" 
              className={`flex items-center px-3 py-2.5 rounded-lg ${currentTab === 'billing' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setCurrentTab('billing')}
            >
              <CreditCard size={18} className="mr-3" />
              Billing & Subscriptions
            </a>
            <a 
              href="#" 
              className={`flex items-center px-3 py-2.5 rounded-lg ${currentTab === 'analytics' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setCurrentTab('analytics')}
            >
              <BarChart2 size={18} className="mr-3" />
              Analytics
            </a>
            
            <div className="pt-4 pb-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">System</div>
            </div>
            
            <a 
              href="#" 
              className={`flex items-center px-3 py-2.5 rounded-lg ${currentTab === 'apiManagement' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setCurrentTab('apiManagement')}
            >
              <Server size={18} className="mr-3" />
              API Management
            </a>
            <a 
              href="#" 
              className={`flex items-center px-3 py-2.5 rounded-lg ${currentTab === 'security' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setCurrentTab('security')}
            >
              <Shield size={18} className="mr-3" />
              Security & Compliance
            </a>
            <a 
              href="#" 
              className={`flex items-center px-3 py-2.5 rounded-lg ${currentTab === 'notifications' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setCurrentTab('notifications')}
            >
              <Bell size={18} className="mr-3" />
              Notifications
            </a>
            <a 
              href="#" 
              className={`flex items-center px-3 py-2.5 rounded-lg ${currentTab === 'systemSettings' ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setCurrentTab('systemSettings')}
            >
              <Settings size={18} className="mr-3" />
              System Settings
            </a>
          </nav>
          
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center">
              <img 
                src="https://randomuser.me/api/portraits/men/76.jpg"
                alt="Admin"
                className="w-8 h-8 rounded-full mr-3"
              />
              <div>
                <div className="text-sm font-medium">Adam Torres</div>
                <div className="text-xs text-gray-400">Super Admin</div>
              </div>
              <button className="ml-auto text-gray-400 hover:text-white">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-800">
                {currentTab === 'dashboard' && 'Dashboard'}
                {currentTab === 'customers' && 'Customers'}
                {currentTab === 'serviceProviders' && 'Service Providers'}
                {currentTab === 'billing' && 'Billing & Subscriptions'}
                {currentTab === 'analytics' && 'Analytics'}
                {currentTab === 'apiManagement' && 'API Management'}
                {currentTab === 'security' && 'Security & Compliance'}
                {currentTab === 'notifications' && 'Notifications'}
                {currentTab === 'systemSettings' && 'System Settings'}
              </h2>
              {currentTab !== 'dashboard' && (
                <div className="ml-6 relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-72"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2 text-gray-400" size={16} />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {currentTab !== 'dashboard' && (
                <div className="flex border border-gray-300 rounded-md">
                  <button 
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} />
                  </button>
                  <button 
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </button>
                </div>
              )}
              <button className="text-gray-600 hover:text-gray-900">
                <Bell size={18} />
              </button>
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                Exit Admin
              </Link>
            </div>
          </header>
          
          {/* Dashboard content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {currentTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">Customer Overview</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                        +3.2% this month
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Total Customers</span>
                        <span className="mt-1 block text-2xl font-semibold">{demoData.stats.totalCustomers.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Active Subscriptions</span>
                        <span className="mt-1 block text-2xl font-semibold">{demoData.stats.activeSubscriptions.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '84.6%' }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">84.6% retention rate</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">Revenue</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                        +12.8% this month
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Monthly Recurring Revenue</span>
                        <span className="mt-1 block text-2xl font-semibold">{formatCurrency(demoData.stats.monthlyRecurringRevenue)}</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Avg. Revenue per Customer</span>
                        <span className="mt-1 block text-lg font-semibold">
                          {formatCurrency(demoData.stats.monthlyRecurringRevenue / demoData.stats.activeSubscriptions)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">Support Activity</h3>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Report</button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Avg. Tickets/Day</span>
                        <span className="mt-1 block text-2xl font-semibold">{demoData.stats.averageTicketsPerDay}</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Avg. Response Time</span>
                        <span className="mt-1 block text-2xl font-semibold">{demoData.stats.avgResponseTime}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Customer Satisfaction</span>
                        <span className="font-medium">97.3%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '97.3%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* System alerts */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">System Alerts</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {demoData.alerts.map(alert => (
                      <div key={alert.id} className="flex items-start p-4">
                        <div className="flex-shrink-0 mr-3">
                          {alert.type === 'warning' && (
                            <AlertTriangle className="text-yellow-500" size={20} />
                          )}
                          {alert.type === 'critical' && (
                            <AlertTriangle className="text-red-500" size={20} />
                          )}
                          {alert.type === 'info' && (
                            <Bell className="text-blue-500" size={20} />
                          )}
                          {alert.type === 'success' && (
                            <CheckCircle className="text-green-500" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                          <span className="text-xs text-gray-500">{formatRelativeTime(alert.time)}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent customers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">Recent Customers</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      View All <ArrowRight size={16} className="ml-1" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRR</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {demoData.recentCustomers.map(customer => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                                  {customer.name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                  <div className="text-xs text-gray-500">{customer.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{customer.plan}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{customer.users}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(customer.mrr)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {customer.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(customer.joinDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Recent service providers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">Service Providers</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      View All <ArrowRight size={16} className="ml-1" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                    {demoData.recentServiceProviders.map(provider => (
                      <div key={provider.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium">
                              {provider.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                              <div className="text-xs text-gray-500">{provider.id}</div>
                            </div>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            provider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {provider.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-500">Customers</div>
                            <div className="font-medium">{provider.customers}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Agents</div>
                            <div className="font-medium">{provider.agents}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Active Tickets</div>
                            <div className="font-medium">{provider.activeTickets}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Last Login</div>
                            <div className="font-medium">{formatRelativeTime(provider.lastLogin)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Placeholder for other tabs */}
            {currentTab !== 'dashboard' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentTab === 'customers' && 'Customer Management'}
                  {currentTab === 'serviceProviders' && 'Service Provider Management'}
                  {currentTab === 'billing' && 'Billing & Subscription Management'}
                  {currentTab === 'analytics' && 'Platform Analytics & Insights'}
                  {currentTab === 'apiManagement' && 'API Management Console'}
                  {currentTab === 'security' && 'Security & Compliance Controls'}
                  {currentTab === 'notifications' && 'Notification Settings'}
                  {currentTab === 'systemSettings' && 'System Configuration'}
                </h3>
                <p className="text-gray-500">This section is under development. Dashboard features are fully functional.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPanel;