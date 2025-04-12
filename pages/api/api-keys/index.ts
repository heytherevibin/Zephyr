/**
 * API Keys Endpoint
 * Handles API key operations (GET, POST)
 */
import { NextApiRequest, NextApiResponse } from 'next';

// Define interface types
interface RateLimit {
  requestsPerMinute: number;
  requestsPerDay: number;
}

interface UsageData {
  date: string;
  requests: number;
}

interface Usage {
  current: {
    requestsToday: number;
    requestsThisMonth: number;
  };
  history: UsageData[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  customerId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
  rateLimit: RateLimit;
  usage: Usage;
}

interface AuthResult {
  authenticated: boolean;
  role: string;
}

interface CreateApiKeyBody {
  name: string;
  customerId: string;
  permissions?: string[];
  environment?: 'development' | 'testing' | 'production';
}

// Mock data for API keys
export const apiKeys: ApiKey[] = [
  {
    id: "key_1a2b3c4d5e6f",
    name: "Production API Key",
    key: "zphyr_prod_1a2b3c4d5e6f7g8h9i0j",
    customerId: "cust_001",
    status: "active",
    createdAt: "2025-01-15T10:30:00Z",
    lastUsed: "2025-04-10T08:45:12Z",
    permissions: ["read", "write"],
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerDay: 10000
    },
    usage: {
      current: {
        requestsToday: 4532,
        requestsThisMonth: 87654
      },
      history: [
        { date: "2025-04-10", requests: 4532 },
        { date: "2025-04-09", requests: 5621 },
        { date: "2025-04-08", requests: 4892 }
      ]
    }
  },
  {
    id: "key_7g8h9i0j1k2l",
    name: "Development API Key",
    key: "zphyr_dev_7g8h9i0j1k2l3m4n5o6p",
    customerId: "cust_001",
    status: "active",
    createdAt: "2025-02-20T14:15:00Z",
    lastUsed: "2025-04-10T09:12:34Z",
    permissions: ["read"],
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerDay: 5000
    },
    usage: {
      current: {
        requestsToday: 1204,
        requestsThisMonth: 23456
      },
      history: [
        { date: "2025-04-10", requests: 1204 },
        { date: "2025-04-09", requests: 1587 },
        { date: "2025-04-08", requests: 1342 }
      ]
    }
  },
  {
    id: "key_3e4f5g6h7i8j",
    name: "Testing API Key",
    key: "zphyr_test_3e4f5g6h7i8j9k0l1m2n",
    customerId: "cust_002",
    status: "inactive",
    createdAt: "2025-03-05T09:45:00Z",
    lastUsed: "2025-03-25T16:30:45Z",
    permissions: ["read", "write"],
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerDay: 3000
    },
    usage: {
      current: {
        requestsToday: 0,
        requestsThisMonth: 12453
      },
      history: [
        { date: "2025-03-25", requests: 879 },
        { date: "2025-03-24", requests: 967 },
        { date: "2025-03-23", requests: 1032 }
      ]
    }
  }
];

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

  switch (method) {
    case 'GET':
      return handleGetApiKeys(req, res);
    case 'POST':
      return handleCreateApiKey(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

const handleGetApiKeys = (req: NextApiRequest, res: NextApiResponse): void => {
  try {
    // Get query parameters for filtering
    const { customerId, status } = req.query;
    
    let filteredKeys = [...apiKeys];
    
    // Apply filters if provided
    if (customerId && typeof customerId === 'string') {
      filteredKeys = filteredKeys.filter(key => key.customerId === customerId);
    }
    
    if (status && typeof status === 'string') {
      filteredKeys = filteredKeys.filter(key => key.status === status);
    }
    
    // Return filtered API keys (without exposing full key string in list view)
    const sanitizedKeys = filteredKeys.map(key => {
      const { key: fullKey, ...rest } = key;
      return {
        ...rest,
        keySuffix: fullKey.substring(fullKey.length - 4)
      };
    });
    
    res.status(200).json({
      success: true,
      count: sanitizedKeys.length,
      data: sanitizedKeys
    });
  } catch (error) {
    console.error('Error getting API keys:', error);
    res.status(500).json({ error: 'Failed to get API keys' });
  }
};

const handleCreateApiKey = (req: NextApiRequest, res: NextApiResponse): void => {
  try {
    const { name, customerId, permissions = ["read"] } = req.body as CreateApiKeyBody;
    
    // Validate required fields
    if (!name || !customerId) {
      res.status(400).json({ error: 'Name and customer ID are required' });
      return;
    }
    
    // Generate new API key ID and key string
    const keyId = `key_${generateRandomString(12)}`;
    const keyString = `zphyr_${generateEnvironmentPrefix(req.body)}${generateRandomString(24)}`;
    
    // Create new API key object
    const newApiKey: ApiKey = {
      id: keyId,
      name,
      key: keyString,
      customerId,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: null,
      permissions: permissions,
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerDay: 5000
      },
      usage: {
        current: {
          requestsToday: 0,
          requestsThisMonth: 0
        },
        history: []
      }
    };
    
    // In a real app, we would save to the database here
    apiKeys.push(newApiKey);
    
    res.status(201).json({
      success: true,
      data: newApiKey
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
};

// Helper function to generate a random string
const generateRandomString = (length: number): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Helper function to determine environment prefix
const generateEnvironmentPrefix = (data: CreateApiKeyBody): string => {
  const environment = data.environment || 'production';
  switch (environment) {
    case 'development':
      return 'dev_';
    case 'testing':
      return 'test_';
    case 'production':
    default:
      return 'prod_';
  }
};