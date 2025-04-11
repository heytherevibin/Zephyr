// This is a mock API endpoint for demonstration purposes
// In a production environment, you would connect this to a database

// Knowledge base articles for demo
const knowledgeArticles = [
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
const analyticsEvents = [];

export default function handler(req, res) {
  // Parse the body if it's a string
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  // Handle different API routes based on the endpoint path
  const path = req.url.replace('/api/chat', '');
  
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
}

function handleKnowledgeSearch(req, res) {
  const { query } = req.body;
  
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

function handleAnalytics(req, res) {
  const analyticsData = req.body;
  
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

function handleChat(req, res) {
  // Process incoming chat messages
  // In a real app, you would store messages in a database
  // and potentially trigger notifications to agents
  
  const { message } = req.body || {};
  
  // Echo back a response for demo purposes
  res.status(200).json({
    success: true,
    message: message ? {
      id: `server-${Date.now()}`,
      text: `This is a server response to: "${message.text}"`,
      sender: 'bot',
      timestamp: new Date(),
      status: 'delivered'
    } : null,
    conversationId: 'demo-conversation'
  });
}