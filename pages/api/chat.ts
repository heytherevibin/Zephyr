import { NextApiRequest, NextApiResponse } from 'next';

// Define types for our data structures
interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  url: string;
  tags: string[];
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface AnalyticsEvent {
  event: string;
  userId: string;
  timestamp: string;
  serverTimestamp?: Date;
  metadata?: Record<string, any>;
}

// Knowledge base articles for demo
const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 1,
    title: "Getting Started with Zephyr Chat",
    content: "Learn how to integrate Zephyr Chat into your website or application.",
    url: "/help/getting-started",
    tags: ["setup", "integration", "installation"]
  },
  {
    id: 2,
    title: "Customizing Your Chat Widget",
    content: "Discover all the customization options available for your chat widget.",
    url: "/help/customization",
    tags: ["design", "styling", "branding"]
  },
  {
    id: 3,
    title: "Setting Up Departments",
    content: "Learn how to configure departments and route conversations effectively.",
    url: "/help/departments",
    tags: ["routing", "teams", "organization"]
  },
  {
    id: 4,
    title: "Analytics Dashboard Guide",
    content: "How to interpret and utilize the analytics dashboard for your chat system.",
    url: "/help/analytics",
    tags: ["reporting", "metrics", "performance"]
  },
  {
    id: 5,
    title: "Troubleshooting Common Issues",
    content: "Solutions for common problems users encounter with the chat widget.",
    url: "/help/troubleshooting",
    tags: ["problems", "errors", "fixes"]
  }
];

// Analytics storage (in-memory for demo, would use a database in production)
const analyticsEvents: AnalyticsEvent[] = [];

// In-memory conversation storage for demo
const conversations: Record<string, ChatMessage[]> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Handle OPTIONS requests for CORS
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Only accept POST requests for chat API
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Parse the body if it's a string
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Handle different API routes based on the endpoint path
    const path = req.url?.replace('/api/chat', '') || '';
    
    // Route to appropriate handler
    switch(path) {
      case '/knowledge-search':
        return handleKnowledgeSearch(req, res);
      case '/analytics':
        return handleAnalytics(req, res);
      default:
        // Main chat handler
        return handleChat(req, res);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}

function handleKnowledgeSearch(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid query parameter' 
    });
  }
  
  // Simple search algorithm - in production, use a more sophisticated search
  const results = knowledgeArticles.filter(article => {
    const searchText = query.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchText) ||
      article.content.toLowerCase().includes(searchText) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchText))
    );
  });
  
  // Return results
  res.status(200).json({ 
    success: true, 
    articles: results
  });
}

function handleAnalytics(req: NextApiRequest, res: NextApiResponse) {
  const analyticsData = req.body as AnalyticsEvent;
  
  if (!analyticsData || !analyticsData.event) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid analytics data' 
    });
  }
  
  // Store analytics event
  analyticsEvents.push({
    ...analyticsData,
    serverTimestamp: new Date()
  });
  
  // In production, you would store this in a database
  console.log('Analytics event received:', analyticsData);
  
  res.status(200).json({ 
    success: true, 
    eventsStored: analyticsEvents.length
  });
}

function handleChat(req: NextApiRequest, res: NextApiResponse) {
  // Process incoming chat messages
  // In a real app, you would store messages in a database
  // and potentially trigger notifications to agents
  
  const { message, conversationId = 'default' } = req.body || {};
  
  // Initialize conversation if it doesn't exist
  if (!conversations[conversationId]) {
    conversations[conversationId] = [];
  }
  
  // If there's a message, add it to the conversation
  if (message?.text) {
    // Add user message to conversation
    const userMessage: ChatMessage = {
      id: message.id || `user-${Date.now()}`,
      text: message.text,
      sender: 'user',
      timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
      status: 'delivered'
    };
    
    conversations[conversationId].push(userMessage);
    
    // Create a response message
    let responseText = "Thank you for your message. How can I help you today?";
    
    // Simple keyword-based responses
    const lowerText = message.text.toLowerCase();
    if (lowerText.includes('pricing') || lowerText.includes('cost')) {
      responseText = "Zephyr Chat offers flexible pricing plans starting at $29/month for small businesses. Would you like to see our full pricing page?";
    } else if (lowerText.includes('integration') || lowerText.includes('install')) {
      responseText = "Integrating Zephyr Chat is simple! You can use our JavaScript SDK or WordPress plugin. Would you like to see the documentation?";
    } else if (lowerText.includes('support') || lowerText.includes('help')) {
      responseText = "Our support team is available 24/7. Would you like me to connect you with a support agent?";
    }
    
    // Add bot response to conversation
    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      status: 'delivered'
    };
    
    conversations[conversationId].push(botMessage);
    
    // Return the bot response
    res.status(200).json({
      success: true,
      message: botMessage,
      conversationId
    });
  } else {
    // If no message, return the conversation history
    res.status(200).json({
      success: true,
      messages: conversations[conversationId],
      conversationId
    });
  }
}