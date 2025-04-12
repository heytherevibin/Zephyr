/**
 * Individual Customer API Endpoint
 * Handles GET, PUT, DELETE operations for a specific customer
 */
import { NextApiRequest, NextApiResponse } from 'next';

// Import our mock customer data and interfaces
import { customers, Customer } from './index';

interface AuthResult {
  authenticated: boolean;
  role: string;
}

interface CustomerUpdateData {
  name?: string;
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

  // Get the customer ID from the URL
  const { id } = req.query;
  const { method } = req;
  
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid customer ID' });
    return;
  }

  switch (method) {
    case 'GET':
      return handleGetCustomer(req, res, id);
    case 'PUT':
      return handleUpdateCustomer(req, res, id);
    case 'DELETE':
      return handleDeleteCustomer(req, res, id);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

const handleGetCustomer = (req: NextApiRequest, res: NextApiResponse, id: string): void => {
  try {
    // Find the customer by ID
    const customer = customers.find(c => c.id === id);
    
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error getting customer:', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
};

const handleUpdateCustomer = (req: NextApiRequest, res: NextApiResponse, id: string): void => {
  try {
    // Find the customer index
    const customerIndex = customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    
    // Update the customer
    const updatedCustomer: Customer = {
      ...customers[customerIndex],
      ...(req.body as CustomerUpdateData),
      id // Ensure ID doesn't change
    };
    
    // In a real app, we would update in the database here
    customers[customerIndex] = updatedCustomer;
    
    res.status(200).json({
      success: true,
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

const handleDeleteCustomer = (req: NextApiRequest, res: NextApiResponse, id: string): void => {
  try {
    // Find the customer index
    const customerIndex = customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    
    // Remove the customer
    // In a real app, we might soft delete or archive instead
    const deletedCustomer = customers[customerIndex];
    customers.splice(customerIndex, 1);
    
    res.status(200).json({
      success: true,
      data: deletedCustomer
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};