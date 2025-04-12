/**
 * Customer Statistics API Endpoint
 * Provides metrics and aggregated data about customers
 */
import { NextApiRequest, NextApiResponse } from 'next';

interface AuthResult {
  authenticated: boolean;
  role: string;
}

interface CustomersByPlan {
  [plan: string]: number;
}

interface RevenueByMonth {
  [month: string]: number;
}

interface CustomerStats {
  totalCustomers: number;
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  averageTicketsPerDay: number;
  customerRetentionRate: number;
  avgResponseTime: string;
  customersByPlan: CustomersByPlan;
  revenueByMonth: RevenueByMonth;
  growthRate: number;
}

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

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    // In a real app, these statistics would be calculated from real database data
    const customerStats: CustomerStats = {
      totalCustomers: 3482,
      activeSubscriptions: 2947,
      monthlyRecurringRevenue: 289750,
      averageTicketsPerDay: 143,
      customerRetentionRate: 94.2,
      avgResponseTime: '1h 12m',
      customersByPlan: {
        'Free': 527,
        'Starter': 1238,
        'Business Pro': 986,
        'Enterprise': 628,
        'Enterprise Plus': 103
      },
      revenueByMonth: {
        'Jan 2025': 271450,
        'Feb 2025': 278900,
        'Mar 2025': 284350,
        'Apr 2025': 289750
      },
      growthRate: 6.8
    };

    res.status(200).json({
      success: true,
      data: customerStats
    });
  } catch (error) {
    console.error('Error getting customer stats:', error);
    res.status(500).json({ error: 'Failed to get customer statistics' });
  }
}