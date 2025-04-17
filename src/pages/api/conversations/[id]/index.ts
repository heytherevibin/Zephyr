/**
 * Individual Conversation API Endpoint
 * Handles GET, PUT, DELETE operations for a specific conversation
 */
import { NextApiRequest, NextApiResponse } from 'next';

// Mock data for conversations
const conversations: Record<string, any> = {};

interface AuthResult {
  authenticated: boolean;
  role: string;
}

// Simple middleware to simulate authentication
const authenticate = (req: NextApiRequest, res: NextApiResponse): AuthResult => {
  // In a real app, this would validate JWT tokens, session cookies, etc.
  return { authenticated: true, role: 'admin' };
};

// This is an API route, not a page, so we don't need getStaticPaths
// API routes are handled differently from pages in Next.js

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  // Check authentication
  const user = authenticate(req, res);
  if (!user.authenticated) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Get the conversation ID from the URL
  const { id } = req.query;
  const { method } = req;
  
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid conversation ID' });
    return;
  }

  switch (method) {
    case 'GET':
      return handleGetConversation(req, res, id);
    case 'PUT':
      return handleUpdateConversation(req, res, id);
    case 'DELETE':
      return handleDeleteConversation(req, res, id);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

const handleGetConversation = (req: NextApiRequest, res: NextApiResponse, id: string): void => {
  try {
    // Find the conversation by ID
    const conversation = conversations[id];
    
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

const handleUpdateConversation = (req: NextApiRequest, res: NextApiResponse, id: string): void => {
  try {
    // Find the conversation
    if (!conversations[id]) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    
    // Update the conversation
    conversations[id] = {
      ...conversations[id],
      ...req.body,
      id // Ensure ID doesn't change
    };
    
    res.status(200).json({
      success: true,
      data: conversations[id]
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
};

const handleDeleteConversation = (req: NextApiRequest, res: NextApiResponse, id: string): void => {
  try {
    // Find the conversation
    if (!conversations[id]) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    
    // Remove the conversation
    const deletedConversation = conversations[id];
    delete conversations[id];
    
    res.status(200).json({
      success: true,
      data: deletedConversation
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
}; 