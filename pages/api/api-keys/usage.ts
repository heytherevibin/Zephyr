/**
 * API Usage Statistics Endpoint
 * Provides usage data for API keys
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { apiKeys, ApiKey } from './index';

interface AuthResult {
  authenticated: boolean;
  role: string;
}

interface UsageDataPoint {
  date: string;
  requests: number;
}

interface WeeklyUsageDataPoint {
  week: string;
  requests: number;
}

interface MonthlyUsageDataPoint {
  month: string;
  requests: number;
}

interface DailyUsageStats {
  timeframe: 'day';
  total: number;
  data: UsageDataPoint[];
}

interface WeeklyUsageStats {
  timeframe: 'week';
  total: number;
  data: WeeklyUsageDataPoint[];
}

interface MonthlyUsageStats {
  timeframe: 'month';
  total: number;
  data: MonthlyUsageDataPoint[];
}

type UsageStats = DailyUsageStats | WeeklyUsageStats | MonthlyUsageStats;

// Simple middleware to simulate authentication
const authenticate = (req: NextApiRequest, res: NextApiResponse): AuthResult => {
  // In a real app, this would validate JWT tokens, session cookies, etc.
  return { authenticated: true, role: 'admin' };
};

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  // Check authentication
  const user = authenticate(req, res);
  if (!user.authenticated) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { method } = req;

  if (method === 'GET') {
    return handleGetUsageStats(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

const handleGetUsageStats = (req: NextApiRequest, res: NextApiResponse): void => {
  try {
    const { customerId, apiKeyId, timeframe = 'day' } = req.query;
    
    // Filter by customer or specific API key if provided
    let relevantKeys = [...apiKeys];
    
    if (customerId && typeof customerId === 'string') {
      relevantKeys = relevantKeys.filter(key => key.customerId === customerId);
    }
    
    if (apiKeyId && typeof apiKeyId === 'string') {
      relevantKeys = relevantKeys.filter(key => key.id === apiKeyId);
    }
    
    // Generate appropriate stats based on requested timeframe
    let usageStats: UsageStats;
    
    switch (timeframe) {
      case 'day':
        usageStats = getUsageByDay(relevantKeys);
        break;
      case 'week':
        usageStats = getUsageByWeek(relevantKeys);
        break;
      case 'month':
        usageStats = getUsageByMonth(relevantKeys);
        break;
      default:
        usageStats = getUsageByDay(relevantKeys);
    }
    
    // Return usage statistics
    res.status(200).json({
      success: true,
      data: usageStats
    });
  } catch (error) {
    console.error('Error getting API usage stats:', error);
    res.status(500).json({ error: 'Failed to get API usage stats' });
  }
};

// Helper function to get usage by day
const getUsageByDay = (keys: ApiKey[]): DailyUsageStats => {
  // Aggregate daily usage from all relevant keys
  const dailyUsage: Record<string, number> = {};
  
  keys.forEach(key => {
    if (key.usage && key.usage.history) {
      key.usage.history.forEach(day => {
        if (!dailyUsage[day.date]) {
          dailyUsage[day.date] = 0;
        }
        dailyUsage[day.date] += day.requests;
      });
    }
  });
  
  // Convert to array format for easier frontend processing
  const formattedData = Object.entries(dailyUsage).map(([date, requests]) => ({
    date,
    requests
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return {
    timeframe: 'day',
    total: formattedData.reduce((sum, day) => sum + day.requests, 0),
    data: formattedData
  };
};

// Helper function to get usage by week
const getUsageByWeek = (keys: ApiKey[]): WeeklyUsageStats => {
  // This would aggregate data by week
  // Simplified implementation for mock data
  return {
    timeframe: 'week',
    total: 45678,
    data: [
      { week: '2025-W14', requests: 21345 },
      { week: '2025-W13', requests: 24333 }
    ]
  };
};

// Helper function to get usage by month
const getUsageByMonth = (keys: ApiKey[]): MonthlyUsageStats => {
  // This would aggregate data by month
  // Simplified implementation for mock data
  return {
    timeframe: 'month',
    total: 123456,
    data: [
      { month: '2025-04', requests: 87654 },
      { month: '2025-03', requests: 35802 }
    ]
  };
};