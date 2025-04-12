/**
 * Individual API Key Endpoint
 * Handles GET, PUT, DELETE operations for a specific API key
 */
import { NextApiRequest, NextApiResponse } from 'next';

// Import our mock API key data and interfaces
import { apiKeys, ApiKey } from './index';

interface AuthResult {
  authenticated: boolean;
  role: string;
}

interface UpdateApiKeyBody {
  name?: string;
  status?: 'active' | 'inactive';
  permissions?: string[];
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

  // Get the API key ID from the URL
  const { id } = req.query;
  const { method } = req;

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid API key ID' });
    return;
  }

  switch (method) {
    case 'GET':
      return handleGetApiKey(req, res, id);
    case 'PUT':
      return handleUpdateApiKey(req, res, id);
    case 'DELETE':
      return handleDeleteApiKey(req, res, id);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

const handleGetApiKey = (req: NextApiRequest, res: NextApiResponse, id: string): void => {
  try {
    // Find the API key by ID
    const apiKey = apiKeys.find(key => key.id === id);
    if (!apiKey) {
      res.status(404).json({ error: 'API key not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: apiKey
    });
  } catch (error) {
    console.error('Error getting API key:', error);
    res.status(500).json({ error: 'Failed to get API key' });
  }
};

const handleUpdateApiKey = (req: NextApiRequest, res: NextApiResponse, id: string): void => {
  try {
    // Find the API key index
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    if (keyIndex === -1) {
      res.status(404).json({ error: 'API key not found' });
      return;
    }

    // Fields that cannot be updated
    const { key, id: keyId, createdAt, usage } = apiKeys[keyIndex];
    
    // Update the API key with proper type casting
    const updatedKey: ApiKey = {
      ...apiKeys[keyIndex],
      ...(req.body as UpdateApiKeyBody),
      // Preserve fields that shouldn't be updated via this endpoint
      key,
      id: keyId,
      createdAt,
      usage
    };

    // In a real app, we would update in the database here
    apiKeys[keyIndex] = updatedKey;

    res.status(200).json({
      success: true,
      data: updatedKey
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({ error: 'Failed to update API key' });
  }
};

const handleDeleteApiKey = (req: NextApiRequest, res: NextApiResponse, id: string): void => {
  try {
    // Find the API key index
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    if (keyIndex === -1) {
      res.status(404).json({ error: 'API key not found' });
      return;
    }

    // Remove the API key
    const deletedKey = apiKeys[keyIndex];
    apiKeys.splice(keyIndex, 1);

    res.status(200).json({
      success: true,
      data: deletedKey
    });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
};