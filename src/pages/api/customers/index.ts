/**
 * Customers API Endpoint
 * Handles GET (list) and POST (create) operations
 */
import { NextApiRequest, NextApiResponse } from 'next';

// Define interface for customers
export interface Customer {
  id: string;
  name: string;
  plan: string;
  users: number;
  status: 'active' | 'inactive' | 'trial';
  mrr: number;
  joinDate: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  country?: string;
  industry?: string;
}

interface CustomerCreateData {
  name: string;
  plan?: string;
  users?: number;
  status?: 'active' | 'inactive' | 'trial';
  mrr?: number;
  email?: string;
  contactPerson?: string;
  phone?: string;
  country?: string;
  industry?: string;
}

interface AuthResult {
  authenticated: boolean;
  role: string;
}

interface GetCustomersResult {
  success: boolean;
  data: Customer[];
  total: number;
  page: number;
  totalPages: number;
}

// Mock customer data - in a real app, this would come from a database
export const customers: Customer[] = [
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
      return handleGetCustomers(req, res);
    case 'POST':
      return handleCreateCustomer(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

const handleGetCustomers = (req: NextApiRequest, res: NextApiResponse): void => {
  try {
    // Extract query parameters for filtering, sorting, pagination
    const { limit = '100', sort, page = '1' } = req.query;
    
    let result = [...customers];
    
    // Apply sorting if specified (simple example)
    if (sort && typeof sort === 'string') {
      const [field, direction] = sort.split(':');
      result.sort((a, b) => {
        if (direction === 'desc') {
          return (a[field as keyof Customer] < b[field as keyof Customer]) ? 1 : -1;
        }
        return (a[field as keyof Customer] > b[field as keyof Customer]) ? 1 : -1;
      });
    }
    
    // Apply pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedResult = result.slice(startIndex, startIndex + limitNum);
    
    const response: GetCustomersResult = {
      success: true,
      data: paginatedResult,
      total: customers.length,
      page: pageNum,
      totalPages: Math.ceil(customers.length / limitNum)
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
};

const handleCreateCustomer = (req: NextApiRequest, res: NextApiResponse): void => {
  try {
    const customerData = req.body as CustomerCreateData;
    
    // Validate required fields
    if (!customerData.name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    
    // Generate a new customer ID
    const newId = `CUS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCustomer: Customer = {
      id: newId,
      name: customerData.name,
      plan: customerData.plan || 'Basic',
      users: customerData.users || 1,
      status: customerData.status || 'active',
      mrr: customerData.mrr || 0,
      joinDate: new Date().toISOString().split('T')[0],
      email: customerData.email,
      contactPerson: customerData.contactPerson,
      phone: customerData.phone,
      country: customerData.country,
      industry: customerData.industry
    };
    
    // In a real app, we would save to the database here
    customers.push(newCustomer);
    
    res.status(201).json({
      success: true,
      data: newCustomer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};