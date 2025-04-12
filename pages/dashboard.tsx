import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../src/lib/api-client';

// Import all needed Lucide React icons explicitly
import {
  Search,
  Inbox,
  Users,
  User,
  Settings,
  MessageSquare,
  Phone,
  Video,
  Monitor,
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  Paperclip,
  Image,
  Smile,
  Send,
  ChevronDown,
  PlusCircle,
  ArrowRight,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Filter,
  MoreVertical,
  BarChart2,
  LifeBuoy,
  FileText,
  X,
  ArrowLeft,
  Copy,
  Edit,
  Trash2,
  RefreshCcw,
  EyeOff,
  ChevronUp,
  MessageCircle,
  PenTool,
  Loader,
  CreditCard,
  Eye,
  UserPlus,
  Shield,
  UserX,
  UserCircle,
  Target,
  Award,
  UserCheck,
  ArrowUp,
  Code,
} from 'lucide-react';

// Create a FileText2 component as a renamed version of FileText to avoid naming conflicts
const FileText2 = FileText;

// Define types for dashboard components
interface Customer {
  name?: string;
  email?: string;
  avatar?: string;
  company?: string;
  timezone?: string;
  firstContact?: string;
  totalConversations?: number;
}

interface Agent {
  name: string;
  avatar: string;
}

interface Message {
  id: number | string;
  sender: 'customer' | 'agent' | 'system';
  text: string;
  time: string;
  read: boolean;
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

interface Conversation {
  id: string;
  customer?: Customer;
  subject?: string;
  preview?: string;
  unread?: boolean;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'pending' | 'resolved';
  agent?: Agent | null;
  team?: string;
  lastUpdate: string;
  tags?: string[];
  messages?: Message[];
  relatedTickets?: string[];
}

interface CallState {
  type: 'audio' | 'video';
  duration: number;
  started: Date;
  with: Customer;
  recording: boolean;
  muted: boolean;
  screenshare: boolean;
}

// Format time consistently between server and client
const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Format date consistently
const formatDate = (dateStr: string, options: Intl.DateTimeFormatOptions = {}): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  });
};

const AnalyticsPanel: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Mock data for analytics
  const analyticsData = {
    conversationsCount: 234,
    avgResponseTime: '3h 12m',
    resolutionRate: '92%',
    customerSatisfaction: '4.8',
    activeConversations: 18,
    resolvedConversations: 216,
    conversationsByDay: [12, 18, 15, 24, 28, 16, 19],
    responseTimes: [4.2, 3.8, 3.5, 3.2, 3.0, 2.9, 3.1],
    tags: [
      { name: 'technical', count: 76 },
      { name: 'billing', count: 45 },
      { name: 'feature', count: 38 },
      { name: 'integration', count: 32 },
      { name: 'bug', count: 27 }
    ],
    topAgents: [
      { name: 'Alex Rivera', conversations: 48, satisfaction: 4.9 },
      { name: 'Morgan Taylor', conversations: 42, satisfaction: 4.7 },
      { name: 'Jamie Wilson', conversations: 39, satisfaction: 4.8 },
      { name: 'Taylor Reed', conversations: 36, satisfaction: 4.6 }
    ]
  };
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [timeframe]);
  
  return (
    <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">Analytics Dashboard</h1>
        <p className="text-slate-500">Monitor your support team performance and conversation metrics</p>
      </div>
      
      {/* Time range selector */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
          <button 
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${timeframe === 'day' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={() => setTimeframe('day')}
          >
            Day
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${timeframe === 'week' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${timeframe === 'month' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${timeframe === 'quarter' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={() => setTimeframe('quarter')}
          >
            Quarter
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all">
            <Calendar size={14} className="mr-1.5" />
            <span>Custom Range</span>
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all">
            <RefreshCcw size={14} />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-32 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-7 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-500 text-sm font-medium">Total Conversations</h3>
                <MessageSquare size={18} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{analyticsData.conversationsCount}</p>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp size={14} className="mr-1" />
                <span>12% from last period</span>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-500 text-sm font-medium">Avg. Response Time</h3>
                <Clock size={18} className="text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{analyticsData.avgResponseTime}</p>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp size={14} className="mr-1" />
                <span>8% improvement</span>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-500 text-sm font-medium">Resolution Rate</h3>
                <CheckCircle size={18} className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{analyticsData.resolutionRate}</p>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp size={14} className="mr-1" />
                <span>4% improvement</span>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-500 text-sm font-medium">Customer Satisfaction</h3>
                <Star size={18} className="text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{analyticsData.customerSatisfaction}/5</p>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp size={14} className="mr-1" />
                <span>0.2 points increase</span>
              </div>
            </div>
          </div>
          
          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-slate-800">Conversations Over Time</h3>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
              {/* Placeholder for chart - in a real app, you'd use a charting library */}
              <div className="h-64 flex items-center justify-center border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex space-x-2">
                  {analyticsData.conversationsByDay.map((value, index) => (
                    <div key={index} className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm shadow-sm" style={{ height: `${value * 2}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-slate-800">Response Times (hours)</h3>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
              {/* Placeholder for chart - in a real app, you'd use a charting library */}
              <div className="h-64 flex items-center justify-center border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex space-x-2">
                  {analyticsData.responseTimes.map((value, index) => (
                    <div key={index} className="w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm shadow-sm" style={{ height: `${value * 10}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional analytics sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="font-medium text-slate-800 mb-4">Top Performing Agents</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left pb-3 text-sm font-medium text-slate-500">Agent</th>
                      <th className="text-left pb-3 text-sm font-medium text-slate-500">Conversations</th>
                      <th className="text-left pb-3 text-sm font-medium text-slate-500">Satisfaction</th>
                      <th className="text-left pb-3 text-sm font-medium text-slate-500">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topAgents.map((agent, index) => (
                      <tr key={index} className="border-b border-slate-100 last:border-none">
                        <td className="py-3">
                          <div className="flex items-center">
                            <img 
                              src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${20 + index}.jpg`} 
                              alt={agent.name}
                              className="w-8 h-8 rounded-full mr-3 border border-slate-200"
                            />
                            <span className="font-medium text-sm">{agent.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm">{agent.conversations}</td>
                        <td className="py-3 text-sm">
                          <div className="flex items-center">
                            <span className="mr-2">{agent.satisfaction}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(agent.satisfaction) ? 'text-yellow-500' : 'text-slate-300'}`} fill="currentColor" />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-sm">
                          <div className="w-full h-2 bg-slate-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${
                                index === 0 ? 'bg-green-500' : 
                                index === 1 ? 'bg-blue-500' : 
                                index === 2 ? 'bg-purple-500' : 
                                'bg-amber-500'
                              }`} 
                              style={{ width: `${85 - (index * 5)}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-medium text-slate-800 mb-4">Popular Conversation Tags</h3>
              {analyticsData.tags.map((tag, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-800">#{tag.name}</span>
                    <span className="text-slate-500">{tag.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-purple-500' : 
                        index === 2 ? 'bg-amber-500' : 
                        index === 3 ? 'bg-green-500' : 
                        'bg-red-500'
                      }`} 
                      style={{ width: `${(tag.count / analyticsData.tags[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const KnowledgeBasePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Sample knowledge base data
  const knowledgeData = {
    categories: [
      { id: 'all', name: 'All Articles', icon: <FileText size={16} /> },
      { id: 'getting-started', name: 'Getting Started', icon: <MessageSquare size={16} /> },
      { id: 'integrations', name: 'Integrations', icon: <RefreshCcw size={16} /> },
      { id: 'troubleshooting', name: 'Troubleshooting', icon: <AlertCircle size={16} /> },
      { id: 'api', name: 'API Reference', icon: <Code size={16} /> },
      { id: 'billing', name: 'Billing & Plans', icon: <CreditCard size={16} /> }
    ],
    articles: [
      {
        id: 1,
        title: 'How to Set Up Your First Chat Widget',
        category: 'getting-started',
        excerpt: 'Learn how to install and configure the Zephyr chat widget on your website in just a few minutes.',
        lastUpdated: '2025-03-18T10:23:42Z',
        readTime: '4 min read',
        views: 12453
      },
      {
        id: 2,
        title: 'Integrating with HubSpot CRM',
        category: 'integrations',
        excerpt: 'Step-by-step guide on connecting your Zephyr account with HubSpot to sync customer data automatically.',
        lastUpdated: '2025-04-02T15:11:28Z',
        readTime: '7 min read',
        views: 8721
      },
      {
        id: 3,
        title: 'Troubleshooting API Connection Issues',
        category: 'troubleshooting',
        excerpt: 'Common problems with API connections and how to resolve them quickly.',
        lastUpdated: '2025-04-09T09:45:33Z',
        readTime: '6 min read',
        views: 5438
      },
      {
        id: 4,
        title: 'Complete Guide to Webhook Setup',
        category: 'api',
        excerpt: 'Learn how to create, test, and manage webhooks to extend your Zephyr functionality.',
        lastUpdated: '2025-03-28T14:22:17Z',
        readTime: '8 min read',
        views: 4219
      },
      {
        id: 5,
        title: 'Managing User Permissions',
        category: 'getting-started',
        excerpt: 'Learn how to set up role-based access control for your team members.',
        lastUpdated: '2025-04-05T11:38:54Z',
        readTime: '5 min read',
        views: 3892
      },
      {
        id: 6,
        title: 'Understanding Usage Limits and Billing',
        category: 'billing',
        excerpt: 'A complete breakdown of our pricing plans, usage limits, and billing practices.',
        lastUpdated: '2025-04-01T08:14:22Z',
        readTime: '3 min read',
        views: 6721
      },
      {
        id: 7,
        title: 'Setting Up Automated Responses with AI',
        category: 'getting-started',
        excerpt: 'Configure AI-powered responses to handle common customer queries without agent intervention.',
        lastUpdated: '2025-04-10T16:53:11Z',
        readTime: '9 min read',
        views: 7834
      },
      {
        id: 8,
        title: 'Salesforce Integration Guide',
        category: 'integrations',
        excerpt: 'Connect your Zephyr account with Salesforce to synchronize customer data and conversations.',
        lastUpdated: '2025-03-25T13:42:09Z',
        readTime: '10 min read',
        views: 4982
      },
      {
        id: 9,
        title: 'Creating Custom Chat Workflows',
        category: 'api',
        excerpt: 'Use our API to create custom chat workflows and automate complex conversation scenarios.',
        lastUpdated: '2025-04-08T10:28:15Z',
        readTime: '12 min read',
        views: 3251
      },
      {
        id: 10,
        title: 'Resolving Widget Display Issues',
        category: 'troubleshooting',
        excerpt: 'Common display and responsiveness issues with the chat widget and how to fix them.',
        lastUpdated: '2025-04-04T09:17:34Z',
        readTime: '5 min read',
        views: 5129
      }
    ],
    popularSearches: [
      'widget installation',
      'api keys',
      'hubspot',
      'billing',
      'permissions',
      'salesforce',
      'mobile responsiveness'
    ]
  };
  
  // Simulated loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter articles based on active category and search query
  const filteredArticles = knowledgeData.articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* Left sidebar with categories */}
      <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto p-4">
        <h2 className="font-semibold text-slate-800 mb-4">Knowledge Base</h2>
        
        <div className="space-y-1">
          {knowledgeData.categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${
                activeCategory === category.id 
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className={activeCategory === category.id ? 'text-blue-600' : 'text-slate-500'}>
                {category.icon}
              </span>
              <span className="ml-3">{category.name}</span>
              {activeCategory === category.id && (
                <span className="ml-auto w-1 h-4 bg-blue-600 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {knowledgeData.popularSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(term)}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-md transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Search header */}
        <div className="bg-white p-4 border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
              />
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Articles list */}
        <div className="max-w-3xl mx-auto p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="flex mt-4 gap-4">
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-slate-800">
                  {activeCategory === 'all' 
                    ? 'All Articles' 
                    : knowledgeData.categories.find(cat => cat.id === activeCategory)?.name || 'Articles'}
                </h1>
                <span className="text-sm text-slate-500">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
                </span>
              </div>
              
              <div className="space-y-4">
                {filteredArticles.map(article => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                        {knowledgeData.categories.find(cat => cat.id === article.category)?.name}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {article.readTime}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center">
                        <Eye size={12} className="mr-1" />
                        {article.views.toLocaleString()}
                      </span>
                    </div>
                    <h2 className="text-lg font-medium text-slate-800 mb-2">{article.title}</h2>
                    <p className="text-sm text-slate-600 mb-3">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">
                        Updated {formatDate(article.lastUpdated)}
                      </span>
                      <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                        Read article
                        <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="text-slate-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No articles found</h3>
              <p className="text-slate-500 mb-6 max-w-md">
                We couldn't find any articles matching your search. Try using different keywords or browse by category.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View all articles
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TeamsPanel: React.FC = () => {
  const [activeTeam, setActiveTeam] = useState<string | null>('technical-support');
  const [showNewTeamModal, setShowNewTeamModal] = useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Sample teams data
  const teamsData = {
    teams: [
      {
        id: 'technical-support',
        name: 'Technical Support',
        description: 'Handles technical issues, API integration, and implementation support',
        members: 12,
        activeConversations: 18,
        performance: 92,
        lead: {
          name: 'Alex Rivera',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          title: 'Senior Support Engineer'
        },
        metrics: {
          avgResponseTime: '2h 38m',
          resolutionRate: '94%',
          customerSatisfaction: 4.8,
          conversationsPerDay: 36
        },
        agents: [
          { name: 'Alex Rivera', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', role: 'Team Lead', status: 'online', conversations: 8 },
          { name: 'Morgan Taylor', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', role: 'Senior Agent', status: 'online', conversations: 5 },
          { name: 'Jamie Wilson', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', role: 'Agent', status: 'busy', conversations: 10 },
          { name: 'Casey Parker', avatar: 'https://randomuser.me/api/portraits/women/45.jpg', role: 'Agent', status: 'away', conversations: 0 }
        ]
      },
      {
        id: 'customer-success',
        name: 'Customer Success',
        description: 'Handles account management, onboarding, and customer relationship',
        members: 8,
        activeConversations: 12,
        performance: 89,
        lead: {
          name: 'Jordan Lee',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          title: 'Customer Success Manager'
        },
        metrics: {
          avgResponseTime: '1h 12m',
          resolutionRate: '92%',
          customerSatisfaction: 4.9,
          conversationsPerDay: 28
        },
        agents: [
          { name: 'Jordan Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'Team Lead', status: 'online', conversations: 3 },
          { name: 'Taylor Reed', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', role: 'Senior Agent', status: 'online', conversations: 7 },
          { name: 'Riley Smith', avatar: 'https://randomuser.me/api/portraits/women/16.jpg', role: 'Agent', status: 'offline', conversations: 0 }
        ]
      },
      {
        id: 'product-support',
        name: 'Product Support',
        description: 'Handles product features, troubleshooting, and bug reporting',
        members: 10,
        activeConversations: 15,
        performance: 87,
        lead: {
          name: 'Sam Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          title: 'Product Specialist'
        },
        metrics: {
          avgResponseTime: '3h 05m',
          resolutionRate: '88%',
          customerSatisfaction: 4.6,
          conversationsPerDay: 42
        },
        agents: [
          { name: 'Sam Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Team Lead', status: 'busy', conversations: 6 },
          { name: 'Avery Williams', avatar: 'https://randomuser.me/api/portraits/women/38.jpg', role: 'Senior Agent', status: 'online', conversations: 4 },
          { name: 'Cameron Davis', avatar: 'https://randomuser.me/api/portraits/men/28.jpg', role: 'Agent', status: 'online', conversations: 8 }
        ]
      }
    ]
  };

  // Find active team details
  const activeTeamDetails = teamsData.teams.find(team => team.id === activeTeam);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* Left sidebar with team list */}
      <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-slate-800">Support Teams</h2>
          <button 
            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors duration-200"
            onClick={() => setShowNewTeamModal(true)}
          >
            <UserPlus size={18} />
          </button>
        </div>
        
        <div className="space-y-2">
          {teamsData.teams.map(team => (
            <button
              key={team.id}
              onClick={() => setActiveTeam(team.id)}
              className={`w-full p-3 rounded-xl flex items-start transition-all duration-200 ${
                activeTeam === team.id
                  ? 'bg-blue-50 border border-blue-100 shadow-sm'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-medium ${activeTeam === team.id ? 'text-blue-700' : 'text-slate-800'}`}>
                    {team.name}
                  </h3>
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                    team.performance >= 90
                      ? 'bg-green-100 text-green-700'
                      : team.performance >= 80
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {team.performance}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2 line-clamp-1">{team.description}</p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="flex items-center">
                    <Users size={12} className="mr-1" />
                    {team.members} members
                  </span>
                  <span className="flex items-center">
                    <MessageSquare size={12} className="mr-1" />
                    {team.activeConversations} active
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader size={30} className="animate-spin text-blue-600" />
          </div>
        ) : activeTeamDetails ? (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-800 mb-1">{activeTeamDetails.name}</h1>
                <p className="text-slate-500">{activeTeamDetails.description}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all text-sm flex items-center"
                  onClick={() => {/* Edit team action */}}
                >
                  <Edit size={14} className="mr-1.5" />
                  Edit Team
                </button>
                <button 
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors text-sm flex items-center"
                  onClick={() => setShowAddMemberModal(true)}
                >
                  <UserPlus size={14} className="mr-1.5" />
                  Add Member
                </button>
              </div>
            </div>
            
            {/* Team leader and metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
                <h3 className="font-medium text-slate-500 text-sm mb-4">Team Lead</h3>
                <div className="flex items-center">
                  <img 
                    src={activeTeamDetails.lead.avatar} 
                    alt={activeTeamDetails.lead.name} 
                    className="w-12 h-12 rounded-full border-2 border-blue-100"
                  />
                  <div className="ml-3">
                    <h4 className="font-medium text-slate-800">{activeTeamDetails.lead.name}</h4>
                    <p className="text-xs text-slate-500">{activeTeamDetails.lead.title}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <button className="text-xs text-blue-600 flex items-center">
                      <MessageSquare size={12} className="mr-1" />
                      Message
                    </button>
                    <button className="text-xs text-blue-600 flex items-center">
                      <UserCircle size={12} className="mr-1" />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-500 text-sm font-medium mb-3">Response Time</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-800">{activeTeamDetails.metrics.avgResponseTime}</span>
                  <Clock size={18} className="text-amber-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Avg. first response time</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-500 text-sm font-medium mb-3">Resolution Rate</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-800">{activeTeamDetails.metrics.resolutionRate}</span>
                  <CheckCircle size={18} className="text-green-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Tickets resolved successfully</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-500 text-sm font-medium mb-3">Satisfaction Score</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-800">{activeTeamDetails.metrics.customerSatisfaction}/5</span>
                  <Star size={18} className="text-yellow-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">From customer ratings</p>
              </div>
            </div>
            
            {/* Team members list */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="flex justify-between items-center p-5 border-b border-slate-200">
                <h3 className="font-medium text-slate-800">Team Members</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500">{activeTeamDetails.agents.length} members</span>
                  <div className="relative">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <table className="w-full">
                <thead className="bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Agent</th>
                    <th className="px-5 py-3 text-left">Role</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-center">Active Conversations</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeTeamDetails.agents.map((agent, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <img 
                              src={agent.avatar} 
                              alt={agent.name} 
                              className="w-8 h-8 rounded-full border border-slate-200 mr-3" 
                            />
                            <span className={`absolute bottom-0 right-2 w-2.5 h-2.5 border-2 border-white rounded-full ${
                              agent.status === 'online' ? 'bg-green-500' : 
                              agent.status === 'busy' ? 'bg-amber-500' : 
                              agent.status === 'away' ? 'bg-slate-500' : 'bg-slate-300'
                            }`}></span>
                          </div>
                          <span className="font-medium text-sm text-slate-800">{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {agent.role === 'Team Lead' ? (
                          <span className="flex items-center">
                            <Shield size={12} className="mr-1 text-blue-600" />
                            {agent.role}
                          </span>
                        ) : agent.role === 'Senior Agent' ? (
                          <span className="flex items-center">
                            <Award size={12} className="mr-1 text-amber-600" />
                            {agent.role}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <UserCheck size={12} className="mr-1 text-slate-600" />
                            {agent.role}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          agent.status === 'online' ? 'bg-green-100 text-green-700' : 
                          agent.status === 'busy' ? 'bg-amber-100 text-amber-700' : 
                          agent.status === 'away' ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {agent.conversations > 0 ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            agent.conversations > 8 ? 'bg-red-100 text-red-700' :
                            agent.conversations > 5 ? 'bg-amber-100 text-amber-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {agent.conversations}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-500 hover:text-slate-700">
                            <MessageSquare size={16} />
                          </button>
                          <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-500 hover:text-slate-700">
                            <Edit size={16} />
                          </button>
                          <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-500 hover:text-red-600">
                            <UserX size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Team goals section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b border-slate-200">
                <h3 className="font-medium text-slate-800">Team Goals</h3>
                <button className="text-xs text-blue-600 flex items-center">
                  <PlusCircle size={14} className="mr-1.5" />
                  Add Goal
                </button>
              </div>
              
              <div className="p-5 space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center">
                      <Target size={16} className="text-purple-600 mr-2" />
                      <h4 className="font-medium text-slate-800">Improve First Response Time</h4>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">In Progress</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                    <span>Target: 2 hours or less</span>
                    <span>Due: May 15, 2025</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-1.5 text-xs">
                    <span className="text-slate-500">Current: 2h 38m</span>
                    <span className="text-purple-600 font-medium">75% complete</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center">
                      <Target size={16} className="text-green-600 mr-2" />
                      <h4 className="font-medium text-slate-800">Achieve 95% Resolution Rate</h4>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">On Track</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                    <span>Target: 95% resolved tickets</span>
                    <span>Due: June 30, 2025</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-1.5 text-xs">
                    <span className="text-slate-500">Current: 94%</span>
                    <span className="text-green-600 font-medium">94% complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md p-6">
              <div className="bg-slate-100 p-5 rounded-full inline-block mb-4">
                <Users size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-2">No team selected</h3>
              <p className="text-slate-500 mb-6">Select a team from the sidebar to view details or create a new team to get started.</p>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                onClick={() => setShowNewTeamModal(true)}
              >
                <div className="flex items-center justify-center">
                  <UserPlus size={16} className="mr-1.5" />
                  <span>Create New Team</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Team Modal - simplified placeholder */}
      <AnimatePresence>
        {showNewTeamModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-800">Create New Team</h3>
                <button 
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowNewTeamModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="team-name">
                    Team Name
                  </label>
                  <input
                    type="text"
                    id="team-name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Technical Support"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="team-description">
                    Description
                  </label>
                  <textarea
                    id="team-description"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe this team's purpose and responsibilities..."
                  ></textarea>
                </div>
              </div>
              <div className="px-5 py-4 bg-slate-50 flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  onClick={() => setShowNewTeamModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setShowNewTeamModal(false)}
                >
                  Create Team
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Team Member Modal - simplified placeholder */}
      <AnimatePresence>
        {showAddMemberModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-800">Add Team Member</h3>
                <button 
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="member-name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="member-name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter team member's name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="member-email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="member-email"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="member-role">
                    Role
                  </label>
                  <select
                    id="member-role"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="agent">Agent</option>
                    <option value="senior-agent">Senior Agent</option>
                    <option value="team-lead">Team Lead</option>
                  </select>
                </div>
              </div>
              <div className="px-5 py-4 bg-slate-50 flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Add Member
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // State management
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('inbox');
  const [userPanelOpen, setUserPanelOpen] = useState<boolean>(true);
  const [activeCall, setActiveCall] = useState<CallState | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAIOptions, setShowAIOptions] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isClient, setIsClient] = useState<boolean>(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<boolean>(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<'open' | 'pending' | 'resolved'>('open');
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [messageTypeDropdownOpen, setMessageTypeDropdownOpen] = useState<boolean>(false);
  const [selectedMessageType, setSelectedMessageType] = useState<'normal' | 'internal' | 'template'>('normal');
  const [messageText, setMessageText] = useState<string>('');
  
  // API-related state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const messageInputRef = useRef<HTMLDivElement>(null);
  
  // Use useEffect to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ data: Conversation[] }>('/conversations');
        setConversations(response.data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchConversations();

    // Polling for new conversations
    const interval = setInterval(fetchConversations, 30000);
    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Fetch conversation details when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;
    
    const fetchConversationDetails = async () => {
      try {
        const response = await apiClient.get<{ data: Conversation }>(`/conversations/${selectedConversation.id}`);
        // Update the selected conversation with fresh data including messages
        setSelectedConversation(response.data);
      } catch (err) {
        console.error("Error fetching conversation details:", err);
      }
    };

    fetchConversationDetails();
    
    // Poll for updates to the current conversation every 5 seconds
    const messagePolling = setInterval(fetchConversationDetails, 5000);
    
    return () => {
      if (messagePolling) clearInterval(messagePolling);
    };
  }, [selectedConversation?.id]);

  // Handler for filtering conversations
  const filteredConversations = conversations.filter(conv => {
    if (filterStatus !== 'all' && conv.status !== filterStatus) return false;
    if (filterPriority !== 'all' && conv.priority !== filterPriority) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (conv.customer?.name?.toLowerCase().includes(query)) ||
        (conv.subject?.toLowerCase().includes(query)) ||
        (conv.preview?.toLowerCase().includes(query)) ||
        (conv.id?.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Demo conversations for the interface - fallback in case API fails
  const demoConversations: Conversation[] = [
    {
      id: 'TKT-2546',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        company: 'Acme Inc.',
        timezone: 'PST (UTC-8)',
        firstContact: '2025-03-28T14:23:01Z',
        totalConversations: 12
      },
      subject: 'Integration with CRM software',
      preview: 'Hi there, I\'m trying to integrate your chat widget with our HubSpot CRM but...',
      unread: true,
      priority: 'high',
      status: 'open',
      agent: {
        name: 'Alex Rivera',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      },
      team: 'Technical Support',
      lastUpdate: '2025-04-11T09:45:12Z',
      tags: ['integration', 'crm', 'api'],
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'Hi there, I\'m trying to integrate your chat widget with our HubSpot CRM but I\'m running into some API connection issues. The documentation mentions a webhook setup, but I can\'t seem to find where to configure this in our admin panel.',
          time: '2025-04-11T09:30:12Z',
          read: true,
        },
        {
          id: 2, 
          sender: 'agent',
          text: 'Hello Sarah, thank you for reaching out. I\'d be happy to help you with the HubSpot integration. The webhook configuration can be found under Settings > Integrations > API Connections. Could you tell me which version of the widget you\'re currently using?',
          time: '2025-04-11T09:45:12Z',
          read: false,
        }
      ],
      relatedTickets: ['TKT-2190', 'TKT-1834']
    },
    {
      id: 'TKT-2545',
      customer: {
        name: 'David Chen',
        email: 'd.chen@techforward.io',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        company: 'TechForward',
        timezone: 'EST (UTC-5)',
        firstContact: '2024-11-15T10:08:22Z',
        totalConversations: 5
      },
      subject: 'Mobile responsiveness issue',
      preview: 'When I open the chat on my iPhone 15 Pro Max, the text gets cut off...',
      unread: false,
      priority: 'medium',
      status: 'pending',
      agent: {
        name: 'Morgan Taylor',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      },
      team: 'Product Support',
      lastUpdate: '2025-04-10T16:22:45Z',
      tags: ['mobile', 'responsive', 'iphone'],
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'When I open the chat on my iPhone 15 Pro Max, the text gets cut off on the right side of the screen. This only happens in landscape mode. I\'ve attached a screenshot for reference.',
          time: '2025-04-10T15:12:33Z',
          read: true,
          attachments: [{
            name: 'screenshot.png',
            type: 'image',
            url: '#'
          }]
        },
        {
          id: 2, 
          sender: 'agent',
          text: 'Hi David, I\'m sorry to hear about this issue. Thank you for the screenshot, that\'s very helpful. Our team is aware of this bug with landscape mode on newer iPhone models and we\'re working on a fix in our next release (v2.8.5) scheduled for next week. In the meantime, would using portrait mode work as a temporary solution for you?',
          time: '2025-04-10T16:22:45Z',
          read: true,
        }
      ]
    },
    {
      id: 'TKT-2544',
      customer: {
        name: 'Emma Rodriguez',
        email: 'emma.r@greenstart.org',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        company: 'GreenStart Foundation',
        timezone: 'CET (UTC+1)',
        firstContact: '2025-01-18T09:45:22Z',
        totalConversations: 3
      },
      subject: 'Chat transcript export',
      preview: 'Our compliance team needs to archive all chat conversations from last quarter...',
      unread: true,
      priority: 'low',
      status: 'open',
      agent: null,
      team: 'Customer Success',
      lastUpdate: '2025-04-11T08:17:22Z',
      tags: ['export', 'compliance', 'data'],
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'Our compliance team needs to archive all chat conversations from last quarter for our annual audit. Is there a way to batch export all transcripts from January through March 2025? We need them in a searchable format, preferably PDF.',
          time: '2025-04-11T08:17:22Z',
          read: false,
        }
      ]
    }
  ];

  // Set first conversation as selected by default when component mounts
  useEffect(() => {
    if ((conversations.length > 0 || loading === false) && !selectedConversation) {
      // If API loaded conversations successfully, select the first one
      if (conversations.length > 0) {
        setSelectedConversation(conversations[0]);
        setSelectedStatus(conversations[0].status || 'open');
        setSelectedPriority(conversations[0].priority || 'high');
      } 
      // If API failed but we're not loading anymore, use demo data
      else if (loading === false && error) {
        setConversations(demoConversations);
        setSelectedConversation(demoConversations[0]);
        setSelectedStatus(demoConversations[0].status);
        setSelectedPriority(demoConversations[0].priority);
      }
    }
  }, [conversations, loading, error]);

  // AI response suggestions (simulated)
  const aiSuggestions: string[] = [
    "I understand you're having trouble with the HubSpot integration. Let me walk you through the webhook setup process step by step.",
    "I'd be happy to help troubleshoot the API connection issues. First, let's verify your API keys are correctly configured.",
    "Thank you for providing that information. Based on your current setup, here's how you can establish the CRM integration:"
  ];

  // Send message function
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    try {
      setSending(true);
      
      // Create message object
      const message = {
        text: messageText,
        type: selectedMessageType, // 'normal', 'internal', or 'template'
        conversationId: selectedConversation.id
      };
      
      // Send message to API
      await apiClient.post(`/conversations/${selectedConversation.id}/messages`, message);
      
      // Clear input
      setMessageText('');
      setSending(false);
      
      // Fetch latest messages immediately
      const response = await apiClient.get<{ data: Conversation }>(`/conversations/${selectedConversation.id}`);
      setSelectedConversation(response.data);
      
    } catch (err) {
      console.error("Error sending message:", err);
      setSending(false);
    }
  };
  
  // Update conversation status
  const updateConversationStatus = async (status: 'open' | 'pending' | 'resolved') => {
    if (!selectedConversation) return;
    
    try {
      await apiClient.put(`/conversations/${selectedConversation.id}`, {
        status: status
      });
      
      // Update local state
      setSelectedStatus(status);
      setSelectedConversation({
        ...selectedConversation,
        status: status
      });
      
      // Update in conversations list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversation.id ? { ...conv, status: status } : conv
        )
      );
      
    } catch (err) {
      console.error("Error updating conversation status:", err);
    }
  };
  
  // Update conversation priority
  const updateConversationPriority = async (priority: 'high' | 'medium' | 'low') => {
    if (!selectedConversation) return;
    
    try {
      await apiClient.put(`/conversations/${selectedConversation.id}`, {
        priority: priority
      });
      
      // Update local state
      setSelectedPriority(priority);
      setSelectedConversation({
        ...selectedConversation,
        priority: priority
      });
      
      // Update in conversations list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversation.id ? { ...conv, priority: priority } : conv
        )
      );
      
    } catch (err) {
      console.error("Error updating conversation priority:", err);
    }
  };
  
  // Handle message keyboard shortcut (Ctrl+Enter or Command+Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handler for starting a call
  const handleStartCall = (type: 'audio' | 'video') => {
    if (!selectedConversation || !selectedConversation.customer) return;
    
    setActiveCall({
      type: type, // 'audio' or 'video'
      duration: 0,
      started: new Date(),
      with: selectedConversation.customer,
      recording: false,
      muted: false,
      screenshare: false
    });
  };

  // Handler for ending a call
  const handleEndCall = () => {
    setActiveCall(null);
  };

  // Handler for toggling user details panel
  const toggleUserPanel = () => {
    setUserPanelOpen(!userPanelOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Main navigation sidebar */}
      <div className="w-16 bg-slate-900 text-white flex flex-col items-center py-6 shadow-lg">
        <div className="mb-8 text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-700 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">Z</div>
        
        <nav className="flex flex-col items-center space-y-6">
          <button 
            className={`p-3 rounded-xl transition-all duration-200 ease-in-out ${currentTab === 'inbox' ? 'bg-blue-600 shadow-md' : 'hover:bg-slate-800'}`}
            onClick={() => setCurrentTab('inbox')}
          >
            <Inbox size={20} />
          </button>
          <button 
            className={`p-3 rounded-xl transition-all duration-200 ease-in-out ${currentTab === 'teams' ? 'bg-blue-600 shadow-md' : 'hover:bg-slate-800'}`}
            onClick={() => setCurrentTab('teams')}
          >
            <Users size={20} />
          </button>
          <button 
            className={`p-3 rounded-xl transition-all duration-200 ease-in-out ${currentTab === 'teammates' ? 'bg-blue-600 shadow-md' : 'hover:bg-slate-800'}`}
            onClick={() => setCurrentTab('teammates')}
          >
            <User size={20} />
          </button>
          <button 
            className={`p-3 rounded-xl transition-all duration-200 ease-in-out ${currentTab === 'analytics' ? 'bg-blue-600 shadow-md' : 'hover:bg-slate-800'}`}
            onClick={() => setCurrentTab('analytics')}
          >
            <BarChart2 size={20} />
          </button>
          <button 
            className={`p-3 rounded-xl transition-all duration-200 ease-in-out ${currentTab === 'knowledge' ? 'bg-blue-600 shadow-md' : 'hover:bg-slate-800'}`}
            onClick={() => setCurrentTab('knowledge')}
          >
            <LifeBuoy size={20} />
          </button>
        </nav>
        
        <div className="mt-auto">
          <button className="p-3 rounded-xl hover:bg-slate-800 transition-colors duration-200">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Secondary navigation - only show when on inbox/chat tab */}
      {currentTab === 'inbox' && (
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm">
          <div className="p-4 h-[73px] flex items-center border-b border-slate-200 bg-white sticky top-0 z-10">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-slate-100 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
            </div>
          </div>

          <div className="p-4 border-b border-slate-200 bg-white sticky top-[73px] z-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-slate-800">Conversations</h2>
              <div className="flex items-center space-x-2">
                <button 
                  className={`p-1.5 rounded-lg transition-colors duration-200 ${filterOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100'}`}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter size={16} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <PlusCircle size={16} />
                </button>
              </div>
            </div>

            {/* Filter dropdown */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div 
                  className="bg-white rounded-xl p-4 mb-3 border border-slate-200 shadow-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Status</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button 
                        className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${filterStatus === 'all' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setFilterStatus('all')}
                      >
                        All
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${filterStatus === 'open' 
                          ? 'bg-green-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setFilterStatus('open')}
                      >
                        Open
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${filterStatus === 'pending' 
                          ? 'bg-amber-500 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setFilterStatus('pending')}
                      >
                        Pending
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${filterStatus === 'resolved' 
                          ? 'bg-blue-500 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setFilterStatus('resolved')}
                      >
                        Resolved
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Priority</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button 
                        className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${filterPriority === 'all' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setFilterPriority('all')}
                      >
                        All
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-xs rounded-full flex items-center transition-all duration-200 ${filterPriority === 'high' 
                          ? 'bg-red-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setFilterPriority('high')}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                        High
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-xs rounded-full flex items-center transition-all duration-200 ${filterPriority === 'medium' 
                          ? 'bg-amber-500 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setFilterPriority('medium')}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                        Medium
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-xs rounded-full flex items-center transition-all duration-200 ${filterPriority === 'low' 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setFilterPriority('low')}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                        Low
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors duration-200"
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterPriority('all');
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="overflow-y-auto flex-grow">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                <Loader size={24} className="animate-spin mb-2" />
                <p className="text-sm">Loading conversations...</p>
              </div>
            ) : error && filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                <AlertCircle size={24} className="mb-2 text-red-500" />
                <p className="text-sm">Error loading conversations</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-blue-500 text-sm hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <motion.div 
                  key={conversation.id}
                  className={`p-3 border-b border-slate-100 cursor-pointer transition-colors duration-200 ${selectedConversation?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                  onClick={() => setSelectedConversation(conversation)}
                  whileHover={{ backgroundColor: selectedConversation?.id === conversation.id ? '#EFF6FF' : '#F8FAFC' }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={conversation.customer?.avatar || 'https://via.placeholder.com/40?text=?'} 
                          alt={conversation.customer?.name || 'Customer'}
                          className="w-9 h-9 rounded-full mr-2 shadow-sm border border-slate-200"
                        />
                        {conversation.status === 'open' && (
                          <span className="absolute bottom-0 right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-sm">{conversation.customer?.name || 'Unknown Customer'}</span>
                        {conversation.unread && (
                          <span className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">New</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {isClient ? formatTime(conversation.lastUpdate) : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500 truncate max-w-[180px]">{conversation.preview}</p>
                    {conversation.priority === 'high' && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500" title="High priority"></span>
                    )}
                    {conversation.priority === 'medium' && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500" title="Medium priority"></span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{conversation.id}</span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium ${
                      conversation.status === 'open' 
                        ? 'bg-green-100 text-green-700' 
                        : conversation.status === 'pending' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {conversation.status === 'open' ? 'Open' : 
                       conversation.status === 'pending' ? 'Pending' : 'Resolved'}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                <Search size={24} className="mb-2" />
                <p className="text-sm">No matching conversations found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content area */}
      {currentTab === 'analytics' ? (
        <AnalyticsPanel />
      ) : currentTab === 'knowledge' ? (
        <KnowledgeBasePanel />
      ) : currentTab === 'teams' ? (
        <TeamsPanel />
      ) : (
        <div className="flex-1 flex flex-col bg-slate-50">
          {selectedConversation ? (
            <>
              {/* Ticket header */}
              <div className="bg-white h-[73px] p-4 border-b border-slate-200 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div>
                  <div className="flex items-center">
                    <h2 className="font-medium text-lg">{selectedConversation.subject}</h2>
                    <span className="ml-2 text-sm text-slate-500 font-mono">#{selectedConversation.id}</span>
                    {selectedConversation.priority === 'high' && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded font-medium">High Priority</span>
                    )}
                  </div>
                  <div className="flex text-xs text-slate-500 mt-0.5 items-center">
                    <span className="font-medium">{selectedConversation.team}</span>
                    <span className="mx-1.5">•</span>
                    <span>Created {isClient ? formatDate(selectedConversation.lastUpdate) : ''}</span>
                    <span className="mx-1.5">•</span>
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {isClient ? formatTime(selectedConversation.lastUpdate) : ''}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {!activeCall && (
                    <>
                      <button 
                        className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors duration-200"
                        onClick={() => handleStartCall('audio')}
                      >
                        <Phone size={14} className="mr-1.5" />
                        <span>Call</span>
                      </button>
                      <button 
                        className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors duration-200"
                        onClick={() => handleStartCall('video')}
                      >
                        <Video size={14} className="mr-1.5" />
                        <span>Video</span>
                      </button>
                    </>
                  )}
                  <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Active call interface */}
              {activeCall && (
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md sticky top-[73px] z-10">
                  <div className="flex items-center">
                    <div className="bg-blue-600 p-2 rounded-full shadow-lg">
                      {activeCall.type === 'video' ? <Video size={16} /> : <Phone size={16} />}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium">
                        {activeCall.type === 'video' ? 'Video call' : 'Voice call'} with {activeCall.with.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center">
                        <Clock size={12} className="mr-1" />
                        <span>00:03:45</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors duration-200">
                      <RefreshCcw size={16} />
                    </button>
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors duration-200">
                      {activeCall.muted ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors duration-200">
                      <Monitor size={16} />
                    </button>
                    <button 
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors duration-200"
                      onClick={handleEndCall}
                    >
                      <PhoneOff size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Chat container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[70%]`}>
                        <div className="flex items-center mb-1.5">
                          <img 
                            src={message.sender === 'customer' 
                              ? selectedConversation.customer?.avatar || 'https://via.placeholder.com/40?text=?' 
                              : selectedConversation.agent?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                            alt={message.sender === 'customer' ? selectedConversation.customer?.name || 'Customer' : selectedConversation.agent?.name || 'Agent'}
                            className="w-6 h-6 rounded-full mr-2 border border-slate-200"
                          />
                          <span className="text-sm font-medium">
                            {message.sender === 'customer' ? selectedConversation.customer?.name || 'Customer' : selectedConversation.agent?.name || 'You'}
                          </span>
                          <span className="ml-2 text-xs text-slate-500">
                            {isClient ? formatTime(message.time) : ''}
                          </span>
                        </div>
                        <div className={`p-4 rounded-2xl shadow-sm ${
                          message.sender === 'customer' 
                            ? 'bg-white border border-slate-200' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          {message.attachments?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.attachments.map((attachment, idx) => (
                                <div key={idx} className={`${message.sender === 'customer' ? 'bg-slate-100 border border-slate-200' : 'bg-blue-700 border border-blue-500'} rounded-lg px-3 py-1.5 text-xs flex items-center`}>
                                  {attachment.type === 'image' ? <Image size={12} className="mr-1.5" /> : <Paperclip size={12} className="mr-1.5" />}
                                  {attachment.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.sender === 'agent' && (
                          <div className="flex mt-1.5 space-x-3 justify-end">
                            <button className="text-xs text-slate-500 hover:text-slate-700 flex items-center transition-colors duration-200">
                              <Edit size={10} className="mr-1" />
                              Edit
                            </button>
                            <button className="text-xs text-slate-500 hover:text-slate-700 flex items-center transition-colors duration-200">
                              <Copy size={10} className="mr-1" />
                              Copy
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-center text-slate-500">
                      <MessageSquare className="mx-auto mb-2" size={24} />
                      <p>No messages available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message input area */}
              <div className="bg-white p-4 border-t border-slate-200 shadow-md">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div 
                    className="min-h-[100px] p-4 focus:outline-none text-slate-800"
                    contentEditable="true"
                    ref={messageInputRef}
                    onInput={(e) => setMessageText(e.currentTarget.textContent || '')}
                    onKeyDown={handleKeyPress}
                  ></div>
                  
                  {/* AI suggestion area */}
                  <AnimatePresence>
                    {showAIOptions && (
                      <motion.div 
                        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-slate-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-medium">AI</span>
                            <span className="ml-1.5 text-xs font-medium text-slate-600">SUGGESTED RESPONSES</span>
                          </div>
                          <button 
                            className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                            onClick={() => setShowAIOptions(false)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="space-y-2">
                          {aiSuggestions.map((suggestion, idx) => (
                            <motion.div 
                              key={idx} 
                              className="bg-white p-3 rounded-lg border border-slate-200 text-sm cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm"
                              whileHover={{ scale: 1.01, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                              onClick={() => {
                                if (messageInputRef.current) {
                                  messageInputRef.current.textContent = suggestion;
                                  setMessageText(suggestion);
                                }
                              }}
                            >
                              {suggestion}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex items-center justify-between p-3 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                        <Paperclip size={18} className="text-slate-500" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                        <Smile size={18} className="text-slate-500" />
                      </button>
                      <button 
                        className="flex items-center px-3 py-1.5 rounded-lg text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200"
                        onClick={() => setShowAIOptions(!showAIOptions)}
                      >
                        <span className="font-medium">AI Assist</span>
                        <ChevronDown size={14} className="ml-1" />
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      {/* Modern Message Type Dropdown - SHOWING UPWARDS */}
                      <div className="relative">
                        <button 
                          onClick={() => setMessageTypeDropdownOpen(!messageTypeDropdownOpen)}
                          className="flex items-center justify-between min-w-[140px] px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border bg-white shadow-sm hover:bg-slate-50"
                        >
                          <span className="flex items-center">
                            {selectedMessageType === 'normal' && (
                              <>
                                <MessageCircle size={14} className="mr-1.5 text-blue-600" />
                                <span>Normal</span>
                              </>
                            )}
                            {selectedMessageType === 'internal' && (
                              <>
                                <FileText2 size={14} className="mr-1.5 text-amber-600" />
                                <span>Internal Note</span>
                              </>
                            )}
                            {selectedMessageType === 'template' && (
                              <>
                                <PenTool size={14} className="mr-1.5 text-purple-600" />
                                <span>Template Response</span>
                              </>
                            )}
                          </span>
                          {messageTypeDropdownOpen ? <ChevronDown size={14} className="ml-1.5" /> : <ChevronUp size={14} className="ml-1.5" />}
                        </button>
                        
                        <AnimatePresence>
                          {messageTypeDropdownOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-slate-200 z-50 w-[180px] py-1"
                            >
                              <button 
                                onClick={() => {
                                  setSelectedMessageType('normal');
                                  setMessageTypeDropdownOpen(false);
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-50 text-left"
                              >
                                <MessageCircle size={14} className="mr-2 text-blue-600" />
                                <span>Normal</span>
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedMessageType('internal');
                                  setMessageTypeDropdownOpen(false);
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-50 text-left"
                              >
                                <FileText2 size={14} className="mr-2 text-amber-600" />
                                <span>Internal Note</span>
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedMessageType('template');
                                  setMessageTypeDropdownOpen(false);
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-50 text-left"
                              >
                                <PenTool size={14} className="mr-2 text-purple-600" />
                                <span>Template Response</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button 
                        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg flex items-center shadow-sm transition-colors duration-200 ${sending ? 'opacity-75 cursor-not-allowed' : ''}`}
                        onClick={sendMessage}
                        disabled={sending || !messageText.trim()}
                      >
                        {sending ? (
                          <Loader size={14} className="animate-spin mr-1.5" />
                        ) : (
                          <Send size={14} className="mr-1.5" />
                        )}
                        <span className="font-medium">{sending ? 'Sending...' : 'Send'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-slate-100 p-5 rounded-full inline-block mb-3">
                  <MessageSquare size={48} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-800">No conversation selected</h3>
                <p className="text-slate-500 mt-1">Select a conversation from the sidebar to view details</p>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200">
                  Create New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right sidebar - Customer details */}
      {selectedConversation && currentTab === 'inbox' && (
        <div className="flex relative">
          {/* Customer details panel */}
          <motion.div 
            className="bg-white border-l border-slate-200 overflow-hidden shadow-sm"
            initial={{ width: 320 }}
            animate={{ width: userPanelOpen ? 320 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ flexShrink: 0 }}
          >
            {userPanelOpen && (
              <div className="w-[320px] overflow-hidden">
                <div className="h-[73px] p-4 border-b border-slate-200 flex justify-between items-center bg-white z-10">
                  <h2 className="font-semibold text-slate-800">Conversation Details</h2>
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors duration-200 text-slate-500 hover:text-slate-700" 
                    onClick={toggleUserPanel}
                    aria-label="Close panel"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center">
                      <img 
                        src={selectedConversation.customer?.avatar || 'https://via.placeholder.com/40?text=?'} 
                        alt={selectedConversation.customer?.name || 'Customer'}
                        className="w-14 h-14 rounded-full mr-3 border-2 border-slate-100 shadow-sm"
                      />
                      <div>
                        <h3 className="font-medium text-slate-800">{selectedConversation.customer?.name || 'Unknown Customer'}</h3>
                        <p className="text-sm text-slate-500">{selectedConversation.customer?.email || 'No email provided'}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-slate-500 font-medium">Company</span>
                        <span className="text-slate-800">{selectedConversation.customer?.company || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Timezone</span>
                        <span className="text-slate-800">{selectedConversation.customer?.timezone || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">First contact</span>
                        <span className="text-slate-800">{isClient && selectedConversation.customer?.firstContact ? formatDate(selectedConversation.customer.firstContact) : 'Unknown'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Conversations</span>
                        <span className="text-slate-800 font-semibold">{selectedConversation.customer?.totalConversations || '1'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-medium text-slate-800 mb-3">Ticket Information</h3>
                    <div className="bg-slate-50 rounded-xl p-3">
                      {/* Status Dropdown - Modern Style */}
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-slate-500 font-medium text-sm">Status</span>
                        <div className="relative">
                          <button 
                            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                            className={`flex items-center justify-between min-w-[120px] px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedStatus === 'open' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : selectedStatus === 'pending' 
                                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            <span className="flex items-center">
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                selectedStatus === 'open' 
                                  ? 'bg-green-600' 
                                  : selectedStatus === 'pending' 
                                  ? 'bg-amber-600' 
                                  : 'bg-blue-600'
                              }`}></span>
                              {selectedStatus === 'open' ? 'Open' : 
                              selectedStatus === 'pending' ? 'Pending' : 'Resolved'}
                            </span>
                            {statusDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          
                          <AnimatePresence>
                            {statusDropdownOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-50 min-w-[150px] py-1"
                              >
                                <button 
                                  onClick={() => {
                                    updateConversationStatus('open');
                                    setStatusDropdownOpen(false);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-50 text-left"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2"></span>
                                  <span className="text-green-700 font-medium">Open</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    updateConversationStatus('pending');
                                    setStatusDropdownOpen(false);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-50 text-left"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2"></span>
                                  <span className="text-amber-700 font-medium">Pending</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    updateConversationStatus('resolved');
                                    setStatusDropdownOpen(false);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-50 text-left"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
                                  <span className="text-blue-700 font-medium">Resolved</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      {/* Priority Dropdown - Modern Style */}
                      <div className="flex justify-between items-center py-1.5 border-t border-slate-100">
                        <span className="text-slate-500 font-medium text-sm">Priority</span>
                        <div className="relative">
                          <button 
                            onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
                            className={`flex items-center justify-between min-w-[120px] px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedPriority === 'high' 
                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                : selectedPriority === 'medium' 
                                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            <span className="flex items-center">
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                selectedPriority === 'high' 
                                  ? 'bg-red-600' 
                                  : selectedPriority === 'medium' 
                                  ? 'bg-amber-600' 
                                  : 'bg-emerald-600'
                              }`}></span>
                              {selectedPriority === 'high' ? 'High' : 
                              selectedPriority === 'medium' ? 'Medium' : 'Low'}
                            </span>
                            {priorityDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          
                          <AnimatePresence>
                            {priorityDropdownOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-50 min-w-[150px] py-1"
                              >
                                <button 
                                  onClick={() => {
                                    updateConversationPriority('high');
                                    setPriorityDropdownOpen(false);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-50 text-left"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2"></span>
                                  <span className="text-red-700 font-medium">High</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    updateConversationPriority('medium');
                                    setPriorityDropdownOpen(false);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-50 text-left"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2"></span>
                                  <span className="text-amber-700 font-medium">Medium</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    updateConversationPriority('low');
                                    setPriorityDropdownOpen(false);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-slate-50 text-left"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-2"></span>
                                  <span className="text-emerald-700 font-medium">Low</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      {/* ...existing code for Assigned to... */}
                      <div className="flex justify-between items-center py-1.5 border-t border-slate-100">
                        <span className="text-slate-500 font-medium text-sm">Assigned to</span>
                        <div>
                          {selectedConversation.agent ? (
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
                              <img 
                                src={selectedConversation.agent.avatar} 
                                alt={selectedConversation.agent.name}
                                className="w-5 h-5 rounded-full mr-1.5"
                              />
                              <span className="text-sm">{selectedConversation.agent.name}</span>
                            </div>
                          ) : (
                            <button className="text-blue-600 text-sm font-medium bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm hover:bg-blue-100 transition-colors duration-200">
                              Assign
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* ...existing code for Team... */}
                      <div className="flex justify-between items-center py-1.5 border-t border-slate-100">
                        <span className="text-slate-500 font-medium text-sm">Team</span>
                        <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-lg font-medium">{selectedConversation.team}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-slate-800">Tags</h3>
                      <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                        <PlusCircle size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedConversation.tags && selectedConversation.tags.map(tag => (
                        <span key={tag} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedConversation.relatedTickets?.length > 0 && (
                    <div className="p-4 border-b border-slate-200">
                      <h3 className="font-medium text-slate-800 mb-3">Related Tickets</h3>
                      <div className="space-y-2">
                        {selectedConversation.relatedTickets.map(ticketId => (
                          <div key={ticketId} className="bg-slate-50 p-3 rounded-lg text-sm flex items-center hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
                            <FileText size={14} className="mr-2 text-slate-500" />
                            <span className="font-mono text-xs">{ticketId}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <button className="text-slate-500 hover:text-red-600 text-sm flex items-center transition-colors duration-200 px-3 py-1.5 hover:bg-slate-100 rounded-lg">
                      <Trash2 size={14} className="mr-1.5" />
                      Delete conversation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Toggle button that is positioned at the panel intersection */}
          <div 
            className="absolute top-4 right-0 transform translate-x-1/2 z-20"
            style={{ visibility: userPanelOpen ? 'hidden' : 'visible' }}
          >
            <button 
              onClick={toggleUserPanel}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors duration-200 text-slate-500 hover:text-slate-700"
              aria-label="Show conversation details"
            >
              <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;