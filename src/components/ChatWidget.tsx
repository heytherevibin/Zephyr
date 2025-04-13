import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Home, HelpCircle, MessageCircle, Volume2, Search, ChevronRight, Clock, Settings, Send, Smile, Paperclip, Image, ThumbsUp, Reply, Star, Copy, Check, CheckCheck, ArrowUp, MessageSquareText, BookOpen, Newspaper, MessageCirclePlus, MessageCircleX, MessageSquareDashed, MessageSquareOff, ArrowLeft } from 'lucide-react';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface FileAttachment {
    id: string;
    name: string;
    type: string;
    url: string;
  previewUrl?: string;
  size: number;
}

interface MessageThread {
  id: string;
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  avatar?: string;
  reactions?: Reaction[];
  attachments?: FileAttachment[];
  threadId?: string;
  isThreadReply?: boolean;
  richText?: {
    format: 'bold' | 'italic' | 'link' | 'code';
    content: string;
  }[];
}

interface QuickReply {
  id: string;
  text: string;
  category: string;
}

interface SavedResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  views: number;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
  read: boolean;
}

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  offset?: number;
  triggerButtonSize?: number;
  headerText?: string;
  primaryColor?: string;
  textColor?: string;
  showNotificationBadge?: boolean;
  notificationCount?: number;
  bubbleAnimation?: boolean;
  mobileFullScreen?: boolean;
  soundEnabled?: boolean;
  darkMode?: boolean;
  enableDepartmentRouting?: boolean;
  enableAnalytics?: boolean;
  enableCannedResponses?: boolean;
  enableMultilingualSupport?: boolean;
  userIdentity?: {
    id: string;
    name: string;
    email: string;
  };
  apiEndpoint?: string;
  onMessageSend?: (message: string) => void;
  onFileUpload?: (file: File) => void;
  enableTypingPreview?: boolean;
  quickReplies?: QuickReply[];
  savedResponses?: SavedResponse[];
  onArticleView?: (articleId: string) => void;
  onNewsRead?: (newsId: string) => void;
  helpArticles?: HelpArticle[];
  newsItems?: NewsItem[];
  showSatisfactionSurvey?: boolean;
  companyName?: string;
  agentName?: string;
  agentAvatar?: string;
}

const globalStyles = `
  /* Webkit scrollbar styles */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #CBD5E1;
  }
  
  /* Firefox scrollbar styles */
  * {
    scrollbar-width: thin;
    scrollbar-color: #E2E8F0 transparent;
  }

  /* Focus styles */
  *:focus-visible {
    outline: 1px solid #000000;
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
  }
  
  ::-moz-selection {
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
  }

  /* Touch-friendly styles */
  @media (hover: none) {
    button, a {
      min-height: 44px;
      min-width: 44px;
    }
  }

  /* Loading skeleton animation */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
`;

// Add the TypingIndicator component near the top of the file after the interfaces
const TypingIndicator = () => (
  <div className="flex items-end gap-1 px-4 py-3 bg-gray-100 rounded-2xl w-fit">
    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = 'bottom-right',
  offset = 20,
  triggerButtonSize = 60,
  headerText = 'Support Team',
  primaryColor = '#000000',
  textColor = '#ffffff',
  showNotificationBadge = true,
  notificationCount = 0,
  bubbleAnimation = true,
  mobileFullScreen = false,
  soundEnabled = true,
  darkMode = false,
  enableDepartmentRouting = true,
  enableAnalytics = true,
  enableCannedResponses = true,
  enableMultilingualSupport = true,
  userIdentity,
  apiEndpoint,
  onMessageSend,
  onFileUpload,
  enableTypingPreview = true,
  quickReplies = [],
  savedResponses = [],
  onArticleView,
  onNewsRead,
  helpArticles = [],
  newsItems = [],
  showSatisfactionSurvey = true,
  companyName = 'Support Team',
  agentName = 'Sarah',
  agentAvatar,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'help' | 'news'>('home');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showSavedResponses, setShowSavedResponses] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);
  const [isRichTextEnabled, setIsRichTextEnabled] = useState(false);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<Date>(new Date());
  const [groupedMessages, setGroupedMessages] = useState<{ [key: string]: Message[] }>({});
  const [searchResults, setSearchResults] = useState<{
    messages: Message[];
    articles: HelpArticle[];
    news: NewsItem[];
  }>({ messages: [], articles: [], news: [] });
  
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [activeNewsItem, setActiveNewsItem] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isHomeLoading, setIsHomeLoading] = useState(true);
  const [hasHomeLoaded, setHasHomeLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pullToRefreshRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const [recentConversations, setRecentConversations] = useState<{
    id: string;
    title: string;
    preview: string;
    timestamp: Date;
    avatar?: string;
    unread: boolean;
  }[]>([
    {
      id: '1',
      title: 'Billing inquiry',
      preview: "Thanks for reaching out! I've checked your account and can see the payment was processed successfully.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unread: false
    },
    {
      id: '2',
      title: 'Feature request',
      preview: "That's a great suggestion! I'll pass this along to our product team for consideration.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unread: true
    }
  ]);

  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<{
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
    unread: boolean;
    messages: Message[];
  }[]>([
    {
      id: '1',
      title: 'General Support',
      lastMessage: "Hi there! How can I help you today?",
      timestamp: new Date(),
      unread: false,
      messages: []
    },
    {
      id: '2',
      title: 'Technical Support',
      lastMessage: "Could you provide more details about the issue?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unread: true,
      messages: []
    }
  ]);

  // Add state for showing department suggestions
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] = useState(false);
  
  // Add state for bot conversation flow
  const [botConversationStep, setBotConversationStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [needsHumanSupport, setNeedsHumanSupport] = useState<boolean | null>(null);
  
  // Add departments data
  const departments = [
    { id: 'sales', name: 'Sales', icon: '💼', description: 'Questions about pricing, plans, or purchasing' },
    { id: 'technical', name: 'Technical Support', icon: '🔧', description: 'Help with technical issues or bugs' },
    { id: 'billing', name: 'Billing', icon: '💰', description: 'Inquiries about invoices, payments, or refunds' },
    { id: 'product', name: 'Product Feedback', icon: '💡', description: 'Suggestions or feedback about our products' },
    { id: 'account', name: 'Account Management', icon: '👤', description: 'Help with account settings or access' }
  ];
  
  // Add subcategories for each department
  const subcategories = {
    sales: [
      { id: 'pricing', name: 'Pricing & Plans' },
      { id: 'features', name: 'Feature Comparison' },
      { id: 'upgrade', name: 'Upgrade Options' },
      { id: 'demo', name: 'Request a Demo' }
    ],
    technical: [
      { id: 'login', name: 'Login Issues' },
      { id: 'performance', name: 'Performance Problems' },
      { id: 'integration', name: 'Integration Help' },
      { id: 'bug', name: 'Report a Bug' }
    ],
    billing: [
      { id: 'invoice', name: 'Invoice Questions' },
      { id: 'payment', name: 'Payment Methods' },
      { id: 'refund', name: 'Refund Request' },
      { id: 'subscription', name: 'Subscription Management' }
    ],
    product: [
      { id: 'suggestion', name: 'Feature Suggestion' },
      { id: 'feedback', name: 'Product Feedback' },
      { id: 'roadmap', name: 'Product Roadmap' },
      { id: 'comparison', name: 'Competitor Comparison' }
    ],
    account: [
      { id: 'settings', name: 'Account Settings' },
      { id: 'access', name: 'Access Issues' },
      { id: 'security', name: 'Security Concerns' },
      { id: 'profile', name: 'Profile Management' }
    ]
  };

  // Group messages by date
  useEffect(() => {
    const grouped = messages.reduce((acc, message) => {
      const date = message.timestamp.toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {} as { [key: string]: Message[] });
    setGroupedMessages(grouped);
  }, [messages]);

  // Search messages
  useEffect(() => {
    if (searchQuery) {
      const filtered = messages.filter(message =>
        message.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages([]);
    }
  }, [searchQuery, messages]);

  // Memoized message groups
  const groupedMessagesMemo = useMemo(() => {
    return messages.reduce((acc, message) => {
      const date = message.timestamp.toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {} as { [key: string]: Message[] });
  }, [messages]);

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setIsSearching(true);
    setSearchQuery(query);

    const results = {
      messages: messages.filter(msg => 
        msg.text.toLowerCase().includes(query.toLowerCase())
      ),
      articles: helpArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase())
      ),
      news: newsItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase())
      )
    };

    setSearchResults(results);
    setIsSearching(false);
  }, [messages, helpArticles, newsItems]);

  // Handle article view
  const handleArticleClick = useCallback((articleId: string) => {
    setActiveArticle(articleId);
    onArticleView?.(articleId);
  }, [onArticleView]);

  // Handle news item click
  const handleNewsClick = useCallback((newsId: string) => {
    setActiveNewsItem(newsId);
    onNewsRead?.(newsId);
  }, [onNewsRead]);

  const getPositionStyles = () => ({
    position: 'fixed' as const,
    zIndex: 9999,
    [position === 'bottom-right' ? 'right' : 'left']: offset,
    bottom: offset,
    width: '100%',
    maxWidth: '400px'
  });

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current && activeTab === 'messages') {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, inputText, activeTab]);

  // Update the handleSendMessage function to handle department selection
  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() && selectedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      attachments: selectedFiles,
      threadId: activeThread || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setSelectedFiles([]);
    
    // Reset textarea height to minimum after sending
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = '52px';
    }
    
    onMessageSend?.(inputText);

    // Update message status after sending
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: 'delivered' } 
          : msg
      ));
    }, 1000);

    // Simulate agent typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you shortly.",
        sender: 'agent',
        timestamp: new Date(),
        avatar: agentAvatar,
        status: 'sent'
      };
      setMessages(prev => [...prev, response]);
      setLastReadTimestamp(new Date());
      
      // Update original message status to read
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'read' } 
            : msg
        ));
      }, 1000);
    }, 2000);
  }, [inputText, selectedFiles, activeThread, agentAvatar, onMessageSend]);

  // Add function to handle department selection
  const handleDepartmentSelect = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    if (!department) return;
    
    setSelectedCategory(departmentId);
    setBotConversationStep(1);
    
    // Create a new message with the department selection
    const newMessage: Message = {
      id: Date.now().toString(),
      text: `I need help with ${department.name}`,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update message status after sending
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: 'delivered' } 
          : msg
      ));
    }, 1000);
    
    // Simulate agent typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: `I understand you need help with ${department.name.toLowerCase()}. Could you please specify what you need assistance with?`,
        sender: 'agent',
        timestamp: new Date(),
        avatar: agentAvatar,
        status: 'sent'
      };
      setMessages(prev => [...prev, response]);
      setLastReadTimestamp(new Date());
      
      // Update original message status to read
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'read' } 
            : msg
        ));
      }, 1000);
    }, 2000);
  };
  
  // Add function to handle subcategory selection
  const handleSubcategorySelect = (subcategoryId: string) => {
    if (!selectedCategory) return;
    
    const subcategory = subcategories[selectedCategory as keyof typeof subcategories].find(s => s.id === subcategoryId);
    if (!subcategory) return;
    
    setSelectedSubcategory(subcategoryId);
    setBotConversationStep(2);
    
    // Create a new message with the subcategory selection
    const newMessage: Message = {
      id: Date.now().toString(),
      text: `I need help with ${subcategory.name}`,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update message status after sending
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: 'delivered' } 
          : msg
      ));
    }, 1000);
    
    // Simulate agent typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: `I've found some helpful information about ${subcategory.name.toLowerCase()}. Would you like to speak with a human representative for more personalized assistance?`,
        sender: 'agent',
        timestamp: new Date(),
        avatar: agentAvatar,
        status: 'sent'
      };
      setMessages(prev => [...prev, response]);
      setLastReadTimestamp(new Date());
      
      // Update original message status to read
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'read' } 
            : msg
        ));
      }, 1000);
    }, 2000);
  };
  
  // Add function to handle human support selection
  const handleHumanSupportSelect = (needsSupport: boolean) => {
    setNeedsHumanSupport(needsSupport);
    
    if (needsSupport) {
      setBotConversationStep(3);
      setShowDepartmentSuggestions(false);
      
      // Create a new message with the human support request
      const newMessage: Message = {
        id: Date.now().toString(),
        text: "Yes, I'd like to speak with a human representative",
        sender: 'user',
        timestamp: new Date(),
        status: 'sending',
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update message status after sending
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        ));
      }, 1000);
      
      // Simulate agent typing and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "I've connected you with a human representative. They'll be with you shortly. In the meantime, feel free to provide any additional details about your issue.",
          sender: 'agent',
          timestamp: new Date(),
          avatar: agentAvatar,
          status: 'sent'
        };
        setMessages(prev => [...prev, response]);
        setLastReadTimestamp(new Date());
        
        // Update original message status to read
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'read' } 
              : msg
          ));
        }, 1000);
      }, 2000);
    } else {
      // User doesn't need human support, show typing area
      setShowDepartmentSuggestions(false);
      
      // Create a new message with the no human support request
      const newMessage: Message = {
        id: Date.now().toString(),
        text: "No, I don't need human support",
        sender: 'user',
        timestamp: new Date(),
        status: 'sending',
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update message status after sending
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        ));
      }, 1000);
      
      // Simulate agent typing and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "I understand. Is there anything else I can help you with?",
          sender: 'agent',
          timestamp: new Date(),
          avatar: agentAvatar,
          status: 'sent'
        };
        setMessages(prev => [...prev, response]);
        setLastReadTimestamp(new Date());
        
        // Update original message status to read
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'read' } 
              : msg
          ));
        }, 1000);
      }, 2000);
    }
  };

  // Enhanced file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      const newFiles: FileAttachment[] = await Promise.all(
        Array.from(files).map(async (file) => {
          // Create object URL for preview
          const previewUrl = file.type.startsWith('image/') 
            ? URL.createObjectURL(file)
            : undefined;

          return {
            id: Date.now().toString(),
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
            previewUrl,
            size: file.size
          };
        })
      );

      setSelectedFiles(prev => [...prev, ...newFiles]);
      if (onFileUpload && files[0]) {
        onFileUpload(files[0]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      // Here you could add proper error handling UI
    }
  }, [onFileUpload]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [selectedFiles]);

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions?.find(r => r.emoji === emoji);
        const reactions = message.reactions || [];
        
        if (existingReaction) {
          return {
            ...message,
            reactions: reactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, 'user'] }
                : r
            )
          };
        } else {
          return {
            ...message,
            reactions: [...reactions, { emoji, count: 1, users: ['user'] }]
          };
        }
      }
      return message;
    }));
  };

  const handleThreadReply = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    if (message.threadId) {
      setActiveThread(message.threadId);
    } else {
      const newThread: MessageThread = {
        id: Date.now().toString(),
        messages: [message]
      };
      setThreads(prev => [...prev, newThread]);
      setActiveThread(newThread.id);
    }
  };

  const renderMessage = (message: Message) => (
    <div
      key={message.id}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group mb-1`}
    >
      <div className="flex flex-col">
        <div className={`max-w-[240px] ${message.sender === 'user' ? 'bg-[#000000] text-white' : 'bg-gray-100 text-gray-900'} rounded-[16px] px-3 py-2 relative`}>
          <p className="text-[14px] leading-[1.4]">{message.text}</p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {message.attachments.map(file => (
                <div key={file.id} className="rounded-lg overflow-hidden">
                  {file.type.startsWith('image/') && file.previewUrl ? (
                    <img src={file.previewUrl} alt={file.name} className="max-h-40 w-auto rounded" />
                  ) : (
                    <div className="bg-black/5 p-2 rounded-lg flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="text-[13px] truncate">{file.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-1 right-0 translate-x-full pl-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            <button
              onClick={() => handleReaction(message.id, '👍')}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ThumbsUp size={12} />
            </button>
            <button
              onClick={() => handleThreadReply(message.id)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Reply size={12} />
            </button>
          </div>
        </div>
        
        {/* Message Meta - Outside the message bubble */}
        <div className={`flex items-center gap-1.5 mt-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[11px] text-gray-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.sender === 'user' && message.status && (
            <span className="text-[11px] text-gray-500 flex items-center">
              {message.status === 'read' && (
                <CheckCheck size={12} className="text-black" />
              )}
              {message.status === 'delivered' && (
                <Check size={12} />
              )}
              {message.status === 'sending' && (
                <Clock size={12} className="animate-pulse" />
              )}
            </span>
          )}
          </div>
        </div>
    </div>
  );

  const renderMessageGroup = (date: string, messages: Message[]) => (
    <div key={date} className="space-y-3">
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">
          {new Date(date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
      {messages.map(renderMessage)}
    </div>
  );

  const renderHelpTab = () => (
    <div className="flex flex-col h-full">
      <div className="relative bg-gradient-to-b from-[#1F1F1F] via-[#000000] to-white text-white p-6 pb-12">
        <div className="pt-8 pb-4">
          <h1 className="text-[28px] font-semibold leading-tight mb-2">Help Center</h1>
          <p className="text-[15px] text-white/80">
            Search our knowledge base or browse popular topics
          </p>
        </div>
        
        <div className="relative mt-4">
            <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search help articles..."
            className="w-full h-11 bg-white text-gray-900 placeholder-gray-500 rounded-xl py-2.5 pl-11 pr-4 outline-none transition-all text-[15px] shadow-md"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
        </div>
        </div>
        
      <div className="flex-1 overflow-y-auto -mt-6">
        <div className="p-6">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
            </div>
          ) : searchQuery ? (
            <div className="space-y-4">
              <h2 className="text-[16px] font-semibold text-gray-900">
                Search Results ({searchResults.articles.length})
              </h2>
              {searchResults.articles.map((article) => (
        <button
                  key={article.id}
                  onClick={() => handleArticleClick(article.id)}
                  className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl text-left transition-all"
                >
                  <h3 className="text-[15px] font-medium text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-[14px] text-gray-600 line-clamp-2">{article.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <span className="text-[13px]">{article.category}</span>
                    <span className="text-[13px]">•</span>
                    <span className="text-[13px]">{article.views} views</span>
                  </div>
        </button>
              ))}
            </div>
          ) : (
            <>
              {/* Categories */}
              <div className="mb-8">
                <div className="flex items-center justify-between px-1 mb-3">
                  <h2 className="text-[16px] font-semibold text-gray-900">Categories</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Getting Started', 'Account & Billing', 'Features', 'Troubleshooting'].map((category) => (
                    <button
                      key={category}
                      className="bg-white hover:bg-gray-50 p-4 rounded-2xl text-left border border-gray-200 group relative overflow-hidden transition-all duration-300"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <BookOpen className="w-5 h-5 text-gray-900" />
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform duration-500" />
                        </div>
                        <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-500 ease-in-out mb-1">{category}</h3>
                        <p className="text-[14px] text-gray-600 transition-colors duration-500 ease-in-out">View articles</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Articles */}
              <div>
                <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Popular articles</h2>
                <div className="space-y-2">
                  {helpArticles.slice(0, 5).map((article) => (
                    <button
                      key={article.id}
                      onClick={() => handleArticleClick(article.id)}
                      className="w-full group bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl text-left transition-all"
                    >
                      <h3 className="text-[15px] text-gray-900">{article.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-500">
                        <span className="text-[13px]">{article.category}</span>
                        <span className="text-[13px]">•</span>
                        <span className="text-[13px]">{article.views} views</span>
                </div>
                    </button>
                  ))}
                  </div>
                </div>
            </>
              )}
            </div>
        </div>
        </div>
  );

  const renderNewsTab = () => (
    <>
      <div className="relative bg-gradient-to-b from-[#1F1F1F] via-[#000000] to-white text-white p-6 pb-12">
        <div className="pt-8 pb-4">
          <h1 className="text-[28px] font-semibold leading-tight mb-2">What's New</h1>
          <p className="text-[15px] text-white/80">
            Stay up to date with our latest updates and features
          </p>
        </div>

        <div className="relative mt-4">
        <input
          type="text"
          value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search updates..."
            className="w-full h-11 bg-white text-gray-900 placeholder-gray-500 rounded-xl py-2.5 pl-11 pr-4 outline-none transition-all text-[15px] shadow-md"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
            </div>
          ) : searchQuery ? (
            <div className="space-y-4">
              <h2 className="text-[16px] font-semibold text-gray-900">
                Search Results ({searchResults.news.length})
              </h2>
              {searchResults.news.map((item) => (
          <button
                  key={item.id}
                  onClick={() => handleNewsClick(item.id)}
                  className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl text-left transition-all"
                >
                  <h3 className="text-[15px] font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-[14px] text-gray-600 line-clamp-2">{item.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <span className="text-[13px]">{item.category}</span>
                    <span className="text-[13px]">•</span>
                    <span className="text-[13px]">
                      {item.date.toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
          </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {newsItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNewsClick(item.id)}
                  className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl text-left transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0">
                      <Volume2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-[15px] text-gray-900">{item.title}</p>
                        {!item.read && (
                          <span className="w-2 h-2 bg-black rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[14px] text-gray-600 line-clamp-2">{item.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-gray-500">
                        <span className="text-[13px]">{item.category}</span>
                        <span className="text-[13px]">•</span>
                        <span className="text-[13px]">
                          {item.date.toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
        
  const renderHomeTab = () => (
    <>
      {isHomeLoading ? (
        <div className="flex flex-col h-full bg-white">
          <div className="flex-1 flex items-center justify-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Background track with gradient */}
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#000000]/10 to-[#1A1A1A]/5"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Spinning track */}
              <motion.div 
                className="absolute top-0 left-0 w-10 h-10 rounded-full border-[1.5px] border-[#000000] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ 
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
                }}
              />
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="relative bg-gradient-to-b from-[#1F1F1F] via-[#000000] to-white text-white p-6">
            <div className="pt-8 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-[28px] font-semibold leading-tight">Hi there 👋</h1>
                  <p className="text-[15px] text-white/80 font-normal">We typically reply within an hour</p>
                </div>
              </div>
              <p className="text-[16px] text-white/90 leading-relaxed font-normal">
                Ask us anything, or browse through our most popular topics below.
              </p>
            </div>
            
            <div className="relative mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search our help articles..."
                className="w-full h-11 bg-white text-gray-900 placeholder-gray-500 rounded-xl py-2.5 pl-11 pr-4 outline-none transition-all text-[15px] shadow-md"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6">
              {/* Recent Conversations */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[16px] font-semibold text-gray-900">Recent conversations</h2>
          <button 
                    onClick={() => setActiveTab('messages')}
                    className="text-[14px] text-[#000000] hover:text-gray-800 font-medium"
          >
                    View all
          </button>
                </div>
                <div className="space-y-2">
                  {recentConversations.map((conversation) => (
                    <button 
                      key={conversation.id}
                      onClick={() => {
                        setActiveTab('messages');
                        // You could also set the active conversation here if implementing conversation switching
                      }}
                      className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl text-left transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0">
                          {conversation.avatar ? (
                            <img src={conversation.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-medium text-[15px]">
                              {conversation.title.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-[15px] text-gray-900">{conversation.title}</p>
                            {conversation.unread && (
                              <span className="w-2 h-2 bg-black rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[14px] text-gray-600 line-clamp-2">{conversation.preview}</p>
                          <div className="flex items-center gap-2 mt-2 text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[13px]">
                              {formatTimeAgo(conversation.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Quick actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { 
                      title: 'Start new', 
                      desc: 'Send us a message', 
                      icon: MessageSquare, 
                      action: () => {
                        setActiveTab('messages');
                        const newConversation = {
                          id: Date.now().toString(),
                          title: 'New Conversation',
                          lastMessage: '',
                          timestamp: new Date(),
                          unread: false,
                          messages: []
                        };
                        setConversations(prev => [newConversation, ...prev]);
                        setActiveConversation(newConversation.id);
                        setNeedsHumanSupport(true);
                        setBotConversationStep(3);
                        
                        const greeting: Message = {
                          id: Date.now().toString(),
                          text: "Hi there! 👋 How can I help you today?",
                          sender: 'agent',
                          timestamp: new Date(),
                          avatar: agentAvatar,
                          status: 'sent'
                        };
                        
                        setMessages([greeting]);
                      },
                      primary: true
                    },
                    { 
                      title: 'Help Center', 
                      desc: 'Search articles', 
                      icon: HelpCircle,
                      action: () => setActiveTab('help')
                    },
                    { 
                      title: 'Product News', 
                      desc: 'Latest updates', 
                      icon: Volume2,
                      action: () => setActiveTab('news'),
                      badge: newsItems.filter(item => !item.read).length
                    },
                    { 
                      title: 'Settings', 
                      desc: 'Preferences', 
                      icon: Settings,
                      action: () => {
                        console.log('Settings clicked');
                      }
                    }
                  ].map((action) => (
                    <button 
                      key={action.title}
                      onClick={action.action}
                      className="bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-2xl text-left transition-all group"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <action.icon className="w-5 h-5 text-gray-900" />
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform duration-500" />
                        </div>
                        <p className="font-medium text-[15px] text-gray-900">
                          {action.title}
                        </p>
                        <p className="text-[14px] text-gray-600 mt-0.5">{action.desc}</p>
                        {action.badge && (
                          <span className="absolute top-3 right-3 bg-black text-white text-[12px] w-5 h-5 rounded-full flex items-center justify-center">
                            {action.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Help Articles */}
              <div>
                <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Popular articles</h2>
                <div className="space-y-2">
                  {helpArticles.slice(0, 4).map((article) => (
                    <button 
                      key={article.id}
                      onClick={() => {
                        setActiveTab('help');
                        handleArticleClick(article.id);
                      }}
                      className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-2xl text-left transition-all group"
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-[15px] text-gray-900 truncate">{article.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[13px] text-gray-600">{article.category}</span>
                            <span className="text-[13px] text-gray-600">•</span>
                            <span className="text-[13px] text-gray-600">{article.views} views</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform duration-500 flex-shrink-0 ml-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <div className="flex items-center justify-between px-1 mb-3">
                  <h2 className="text-[16px] font-semibold text-gray-900">Categories</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Getting Started', 'Account & Billing', 'Features', 'Troubleshooting'].map((category) => (
                    <button
                      key={category}
                      className="bg-white hover:bg-gray-50 p-4 rounded-2xl text-left border border-gray-200 group relative overflow-hidden transition-all duration-300"
                    >
                      <div className="relative z-10">
                        <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-500 ease-in-out mb-1">{category}</h3>
                        <div className="flex items-center text-gray-600">
                          <span className="text-[14px] transition-colors duration-500 ease-in-out">View articles</span>
                          <ChevronRight className="w-4 h-4 ml-1 text-gray-600 group-hover:translate-x-0.5 transition-transform duration-500" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div className="space-y-4">
                  {searchResults.articles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => handleArticleClick(article.id)}
                      className="w-full bg-black hover:bg-slate-700 p-4 rounded-2xl text-left border border-gray-800 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                      <div className="relative z-10">
                        <h3 className="text-[15px] font-medium text-white transition-colors duration-500 ease-in-out mb-1">{article.title}</h3>
                        <p className="text-[14px] text-white/80 transition-colors duration-500 ease-in-out line-clamp-2">{article.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[13px] text-white/80 transition-colors duration-500 ease-in-out">{article.category}</span>
                          <span className="text-[13px] text-white/80">•</span>
                          <span className="text-[13px] text-white/80 transition-colors duration-500 ease-in-out">{article.views} views</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* News Items */}
              <div className="space-y-3">
                {newsItems.slice(0, 2).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNewsClick(item.id)}
                    className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl text-left transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0">
                        <Volume2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-[15px] text-gray-900">{item.title}</p>
                          {!item.read && (
                            <span className="w-2 h-2 bg-black rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[14px] text-gray-600 line-clamp-2">{item.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-gray-500">
                          <span className="text-[13px]">{item.category}</span>
                          <span className="text-[13px]">•</span>
                          <span className="text-[13px]">
                            {item.date.toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Helper function to format timestamps
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };

  // Update the handleTextareaResize function
  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    
    // Reset height to auto first to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height with a minimum of 52px and maximum of 150px
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 52), 150);
    textarea.style.height = `${newHeight}px`;
    
    // Only scroll the messages container if we're in the messages tab
    if (activeTab === 'messages') {
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  };

  // Add effect to handle home tab loading with progress
  useEffect(() => {
    if (activeTab === 'home' && !hasHomeLoaded) {
      setIsHomeLoading(true);
      setLoadingProgress(0);
      
      const duration = 2000; // 2 seconds total
      const interval = 20; // Update every 20ms
      const steps = duration / interval;
      const increment = 100 / steps;
      
      const progressTimer = setInterval(() => {
        setLoadingProgress(prev => {
          const next = Math.min(prev + increment, 100);
          if (next === 100) {
            clearInterval(progressTimer);
      setTimeout(() => {
              setIsHomeLoading(false);
              setHasHomeLoaded(true);
            }, 200); // Small delay before hiding
          }
          return next;
        });
      }, interval);

      return () => clearInterval(progressTimer);
    }
  }, [activeTab, hasHomeLoaded]);

  // Reset loading state when widget is closed
  useEffect(() => {
    if (!isOpen) {
      setHasHomeLoaded(false);
      setIsHomeLoading(true);
      setLoadingProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = globalStyles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
    }, []);
    
  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  // Add pull-to-refresh functionality
  const handleTouchStart = (e: TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const pullDistance = currentY.current - startY.current;
    
    if (pullDistance > 0 && window.scrollY === 0) {
      e.preventDefault();
      if (pullToRefreshRef.current) {
        pullToRefreshRef.current.style.transform = `translateY(${Math.min(pullDistance * 0.5, 100)}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullToRefreshRef.current) {
      const pullDistance = currentY.current - startY.current;
      if (pullDistance > 100) {
        setIsRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
          setIsRefreshing(false);
          if (pullToRefreshRef.current) {
            pullToRefreshRef.current.style.transform = '';
        }
      }, 1000);
        } else {
        pullToRefreshRef.current.style.transform = '';
      }
    }
  };

  // Add cleanup for touch events
  useEffect(() => {
    if (pullToRefreshRef.current) {
      const element = pullToRefreshRef.current;
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchmove', handleTouchMove);
      element.addEventListener('touchend', handleTouchEnd);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, []);

  // Cleanup for message container scroll position
  useEffect(() => {
    const messageContainer = messagesContainerRef.current;
    if (messageContainer && activeTab === 'messages') {
      const handleScroll = () => {
        // Store scroll position logic here
        localStorage.setItem('chatScrollPosition', messageContainer.scrollTop.toString());
      };
      
      messageContainer.addEventListener('scroll', handleScroll);
      return () => messageContainer.removeEventListener('scroll', handleScroll);
    }
  }, [activeTab]);

  // Cleanup for file input change event
  useEffect(() => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      const handleNativeFileChange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if (!files) return;

        try {
          const newFiles: FileAttachment[] = await Promise.all(
            Array.from(files).map(async (file) => {
              const previewUrl = file.type.startsWith('image/') 
                ? URL.createObjectURL(file)
                : undefined;

              return {
                id: Date.now().toString(),
                name: file.name,
                type: file.type,
                url: URL.createObjectURL(file),
                previewUrl,
                size: file.size
              };
            })
          );

          setSelectedFiles(prev => [...prev, ...newFiles]);
          if (onFileUpload && files[0]) {
            onFileUpload(files[0]);
          }
        } catch (error) {
          console.error('Error uploading files:', error);
        }
      };

      fileInput.addEventListener('change', handleNativeFileChange);
      return () => fileInput.removeEventListener('change', handleNativeFileChange);
    }
  }, [onFileUpload]);

  // Cleanup for home tab loading progress
  useEffect(() => {
    let progressTimer: NodeJS.Timeout | null = null;
    
    if (activeTab === 'home' && !hasHomeLoaded) {
      setIsHomeLoading(true);
      setLoadingProgress(0);
      
      const duration = 2000;
      const interval = 20;
      const steps = duration / interval;
      const increment = 100 / steps;
      
      progressTimer = setInterval(() => {
        setLoadingProgress(prev => {
          const next = Math.min(prev + increment, 100);
          if (next === 100) {
            if (progressTimer) clearInterval(progressTimer);
            setTimeout(() => {
              setIsHomeLoading(false);
              setHasHomeLoaded(true);
            }, 200);
          }
          return next;
        });
      }, interval);
    }

    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [activeTab, hasHomeLoaded]);

  // Cleanup for keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent handling if input is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  // Cleanup for object URLs
  useEffect(() => {
    const urls = selectedFiles.map(file => file.url).filter(Boolean);
    const previewUrls = selectedFiles.map(file => file.previewUrl).filter(Boolean);
    
    return () => {
      [...urls, ...previewUrls].forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [selectedFiles]);

  // Cleanup for message typing indicator
  useEffect(() => {
    let typingTimer: NodeJS.Timeout | null = null;
    
    if (isTyping) {
      typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 3000); // Reset typing indicator after 3 seconds of inactivity
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [isTyping]);

  // Tooltip component
  const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 500); // 500ms delay
    };
    
    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsVisible(false);
    };
    
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);
    
    return (
      <div 
        className="group relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        <div 
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap transition-opacity duration-200 pointer-events-none ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {text}
        </div>
      </div>
    );
  };

  // Loading skeleton component with improved animation
  const LoadingSkeleton = () => (
          <motion.div 
      className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="h-4 bg-gray-200 rounded w-3/4"
        animate={{ 
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
              <motion.div 
        className="h-4 bg-gray-200 rounded w-1/2"
        animate={{ 
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      <motion.div 
        className="h-4 bg-gray-200 rounded w-5/6"
        animate={{ 
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4
        }}
      />
              </motion.div>
  );

  // Update tab change handler with simpler logic
  const handleTabChange = (tab: 'home' | 'messages' | 'help' | 'news') => {
    if (activeTab === tab) return;
    
    // Set new tab immediately
    setActiveTab(tab);
    
    // Reset states based on tab
    if (tab === 'messages') {
      setShowEmojiPicker(false);
      setShowQuickReplies(false);
      setShowSavedResponses(false);
    } else if (tab === 'help') {
      setSearchQuery('');
      setSearchResults({ messages: [], articles: [], news: [] });
    }
  };

  // Add function to handle close button click
  const handleCloseButtonClick = () => {
    if (activeTab === 'messages') {
      // Return to home tab instead of closing
      setActiveTab('home');
    } else {
      // Close the widget for other tabs
      setIsOpen(false);
    }
  };

  // Update the renderMessagesTab function to show department suggestions
  const renderMessagesTab = () => (
    <div className="flex flex-col h-full">
      {!activeConversation ? (
        // Conversations List View
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 relative bg-white text-gray-900 p-5 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <button
                onClick={handleCloseButtonClick}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Return to home"
              >
                <X size={22} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-3">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className="w-full bg-white hover:bg-gray-50 p-4 rounded-xl text-left transition-all border border-gray-100 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-[15px]">
                        {conversation.title.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-[15px] text-gray-900">{conversation.title}</h3>
                        <span className="text-[13px] text-gray-500">{formatTimeAgo(conversation.timestamp)}</span>
                      </div>
                      <p className="text-[14px] text-gray-600 line-clamp-2">{conversation.lastMessage}</p>
                      {conversation.unread && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="w-2 h-2 bg-black rounded-full" />
                          <span className="text-[13px] text-gray-500">Unread</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-5">
            <button
              onClick={() => {
                const newConversation = {
                  id: Date.now().toString(),
                  title: 'New Conversation',
                  lastMessage: '',
                  timestamp: new Date(),
                  unread: false,
                  messages: []
                };
                setConversations(prev => [newConversation, ...prev]);
                setActiveConversation(newConversation.id);
                setShowDepartmentSuggestions(true);
                setBotConversationStep(0);
                setSelectedCategory(null);
                setSelectedSubcategory(null);
                setNeedsHumanSupport(null);
                
                const greeting: Message = {
                  id: Date.now().toString(),
                  text: "Hi there! 👋 How can I help you today?",
                  sender: 'agent',
                  timestamp: new Date(),
                  avatar: agentAvatar,
                  status: 'sent'
                };
                
                setMessages([greeting]);
              }}
              className="w-full bg-black hover:bg-slate-700 px-4 py-3 rounded-2xl text-left border border-gray-800 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCirclePlus size={18} className="text-white" />
                  <span className="text-[14px] font-medium text-white">Ask a question</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-500" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        // Individual Chat View
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex-shrink-0 relative bg-white text-gray-900 p-5 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={22} className="text-gray-700" />
                </button>
                <h2 className="text-lg font-medium text-gray-900">
                  {conversations.find(c => c.id === activeConversation)?.title || 'Chat'}
                </h2>
              </div>
              <button
                onClick={handleCloseButtonClick}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X size={22} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Messages Area with Improved Scrolling */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-none"
            style={{ 
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                    message.sender === 'user' 
                      ? 'bg-[#000000] text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-[14px] sm:text-[15px] leading-relaxed">{message.text}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 mt-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                    <span className="text-[10px] sm:text-[11px] text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'user' && message.status && (
                      <span className="text-[10px] sm:text-[11px] text-gray-500 flex items-center">
                        {message.status === 'read' && (
                          <CheckCheck size={11} className="text-black" />
                        )}
                        {message.status === 'delivered' && (
                          <Check size={11} />
                        )}
                        {message.status === 'sending' && (
                          <Clock size={11} className="animate-pulse" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Show typing indicator when isTyping is true */}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <TypingIndicator />
                </div>
              )}

              {/* Enhanced Suggestions */}
              {messages.length > 0 && messages[messages.length - 1].sender === 'agent' && (
                <div className="mt-4">
                  {/* Initial Department Selection */}
                  {showDepartmentSuggestions && !selectedCategory && (
                    <div className="flex flex-wrap gap-2">
                      {departments
                        .filter(dept => !messages.some(msg => 
                          msg.text.toLowerCase().includes(dept.name.toLowerCase())
                        ))
                        .map((dept) => (
                          <button
                            key={dept.id}
                            onClick={() => handleDepartmentSelect(dept.id)}
                            className="bg-black hover:bg-slate-700 px-3 py-2 rounded-2xl text-left border border-gray-800 group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                            <div className="flex items-center gap-2 relative z-10">
                              <span className="text-[15px] text-white transition-colors duration-500 ease-in-out group-hover:text-white">
                                {dept.id === 'billing' && '💳'}
                                {dept.id === 'technical' && '🔧'}
                                {dept.id === 'account' && '👤'}
                                {dept.id === 'general' && '💬'}
                                {dept.id === 'sales' && '💼'}
                                {dept.id === 'product' && '💡'}
                              </span>
                              <span className="text-[13px] font-medium text-white transition-colors duration-500 ease-in-out group-hover:text-white">{dept.name}</span>
                            </div>
                          </button>
                      ))}
                      <button
                        onClick={() => {
                          setShowDepartmentSuggestions(false);
                          setNeedsHumanSupport(true);
                          setBotConversationStep(3);
                          const newMessage: Message = {
                            id: Date.now().toString(),
                            text: "I'd like to chat with a human representative",
                            sender: 'user',
                            timestamp: new Date(),
                            status: 'sending',
                          };
                          setMessages(prev => [...prev, newMessage]);
                          
                          // Simulate agent response
                          setIsTyping(true);
                          setTimeout(() => {
                            setIsTyping(false);
                            const response: Message = {
                              id: (Date.now() + 1).toString(),
                              text: "I'm connecting you with a human representative. How can we help you today?",
                              sender: 'agent',
                              timestamp: new Date(),
                              avatar: agentAvatar,
                              status: 'sent'
                            };
                            setMessages(prev => [...prev, response]);
                          }, 1000);
                        }}
                        className="bg-black hover:bg-slate-700 px-3 py-2 rounded-2xl text-left border border-gray-800 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                        <div className="flex items-center gap-2 relative z-10">
                          <span className="text-[15px] text-white transition-colors duration-500 ease-in-out group-hover:text-white">🤝</span>
                          <span className="text-[13px] font-medium text-white transition-colors duration-500 ease-in-out group-hover:text-white">Chat with a human</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Subcategory Selection */}
                  {selectedCategory && !selectedSubcategory && !needsHumanSupport && (
                    <div className="flex flex-wrap gap-2">
                      {subcategories[selectedCategory as keyof typeof subcategories]
                        .filter(sub => !messages.some(msg => 
                          msg.text.toLowerCase().includes(sub.name.toLowerCase())
                        ))
                        .map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleSubcategorySelect(sub.id)}
                            className="bg-black hover:bg-slate-700 px-3 py-2 rounded-2xl text-left border border-gray-800 group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                            <div className="flex items-center gap-2 relative z-10">
                              <span className="text-[15px] text-white transition-colors duration-500 ease-in-out group-hover:text-white">
                                {sub.id.includes('payment') && '💰'}
                                {sub.id.includes('subscription') && '📅'}
                                {sub.id.includes('refund') && '↩️'}
                                {sub.id.includes('invoice') && '📄'}
                                {sub.id.includes('setup') && '⚙️'}
                                {sub.id.includes('error') && '⚠️'}
                                {sub.id.includes('access') && '🔑'}
                                {sub.id.includes('login') && '🔒'}
                                {!sub.id.match(/(payment|subscription|refund|invoice|setup|error|access|login)/) && '📝'}
                              </span>
                              <span className="text-[13px] font-medium text-white transition-colors duration-500 ease-in-out group-hover:text-white">{sub.name}</span>
                            </div>
                          </button>
                      ))}
                    </div>
                  )}

                  {/* Final Actions */}
                  {selectedSubcategory && !needsHumanSupport && (
                    <div className="flex flex-wrap gap-2">
                      {!messages.some(msg => msg.text.toLowerCase().includes('chat with agent')) && (
                        <button
                          onClick={() => handleHumanSupportSelect(true)}
                          className="bg-black hover:bg-slate-700 px-3 py-2 rounded-2xl text-left border border-gray-800 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                          <div className="flex items-center gap-2 relative z-10">
                            <span className="text-[15px] text-white transition-colors duration-500 ease-in-out group-hover:text-white">👥</span>
                            <span className="text-[13px] font-medium text-white transition-colors duration-500 ease-in-out group-hover:text-white">Chat with an agent</span>
                          </div>
                        </button>
                      )}
                      {!messages.some(msg => msg.text.toLowerCase().includes('view help guide')) && (
                        <button
                          onClick={() => handleSuggestionClick({ id: 'self_help', text: 'View help guide' })}
                          className="bg-black hover:bg-slate-700 px-3 py-2 rounded-2xl text-left border border-gray-800 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                          <div className="flex items-center gap-2 relative z-10">
                            <span className="text-[15px] text-white transition-colors duration-500 ease-in-out group-hover:text-white">📚</span>
                            <span className="text-[13px] font-medium text-white transition-colors duration-500 ease-in-out group-hover:text-white">View help guide</span>
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Input Area - Only show if human support is selected */}
          {needsHumanSupport === true && (
            <div className="flex-shrink-0 p-3 sm:p-4 border-t border-transparent">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full bg-[#F8F9FB] rounded-[30px] py-3 sm:py-3.5 pl-4 pr-[120px] outline-none text-[14px] sm:text-[15px] placeholder-gray-400 text-gray-900 resize-none max-h-[150px] min-h-[52px] transition-all duration-200"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#CBD5E1 transparent',
                    overflowY: inputText ? 'auto' : 'hidden'
                  }}
                />
                <div className="absolute right-[0.48rem] top-[45%] -translate-y-1/2 flex items-center justify-center gap-1">
                  {!inputText.trim() ? (
                    <>
                      <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Smile size={20} />
                      </button>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Paperclip size={20} />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Image size={20} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleSendMessage}
                      className="p-2 text-white hover:text-white/90 transition-colors bg-black rounded-full hover:bg-black/90 flex items-center justify-center w-10 h-10"
                      style={{ marginTop: '1px' }}
                    >
                      <ArrowUp size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Add quick suggestions data
  const quickSuggestions = [
    { id: 'order_status', text: 'Order status' },
    { id: 'cancel_order', text: 'Cancel order' },
    { id: 'return_request', text: 'Return request' },
    { id: 'refund_status', text: 'Refund status' },
    { id: 'shipping_info', text: 'Shipping info' },
    { id: 'payment_issue', text: 'Payment issue' }
  ];

  // Update the handleSuggestionClick function
  const handleSuggestionClick = (suggestion: { id: string; text: string }) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: suggestion.text,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update message status after sending
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: 'delivered' } 
          : msg
      ));
    }, 1000);
    
    // Simulate agent typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'll help you with your ${suggestion.text.toLowerCase()}. How would you like to proceed?`,
        sender: 'agent',
        timestamp: new Date(),
        avatar: agentAvatar,
        status: 'sent'
      };
      setMessages(prev => [...prev, response]);
      setLastReadTimestamp(new Date());
      
      setBotConversationStep(2);
      
      // Update original message status to read
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'read' } 
            : msg
        ));
      }, 1000);
    }, 2000);
  };

  return (
    <div style={getPositionStyles()} className="font-sans">
      {/* Launcher Button */}
      <Tooltip text="Press ⌘K to open chat">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-[60px] h-[60px] bg-[#000000] text-white rounded-full shadow-lg hover:shadow-xl transition-all relative z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={false}
          aria-label="Open chat"
          style={{
            position: 'absolute',
            right: position === 'bottom-right' ? offset : 'auto',
            left: position === 'bottom-left' ? offset : 'auto',
            bottom: offset
          }}
        >
          {isOpen ? (
            <MessageSquareOff size={28} className="text-white" />
          ) : (
            <MessageSquareDashed size={28} className="text-white" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[12px] w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </motion.button>
      </Tooltip>

      {/* Chat Window */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              mass: 0.8
            }}
            className="absolute bottom-[76px] right-0 w-full max-w-[400px] h-[700px] bg-white rounded-[16px] shadow-2xl flex flex-col sm:max-w-[400px] md:max-w-[400px] xs:bottom-0 xs:right-0 xs:w-full xs:h-[100vh] xs:rounded-none xs:max-h-[100vh]"
            style={{ 
              overflow: 'hidden',
              marginBottom: '16px'
            }}
          >
            {/* Pull to refresh indicator */}
            {isRefreshing && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-black">
                <div className="h-full bg-gray-800 animate-pulse"></div>
                  </div>
                )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Simplified tab content rendering without AnimatePresence */}
              {activeTab === 'messages' && renderMessagesTab()}
              {activeTab === 'help' && renderHelpTab()}
              {activeTab === 'news' && renderNewsTab()}
              {activeTab === 'home' && renderHomeTab()}
            </div>

            {/* Bottom Navigation - Only show when not in messages tab */}
            {activeTab !== 'messages' && (
              <motion.div 
                className="border-t border-gray-200 w-[400px] h-[81px] flex-shrink-0"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-center justify-around h-full px-4">
                  {[
                    { icon: Home, label: 'Home', tab: 'home', shortcut: '⌘1' },
                    { icon: MessageSquareText, label: 'Messages', tab: 'messages', shortcut: '⌘2' },
                    { icon: BookOpen, label: 'Help', tab: 'help', shortcut: '⌘3' },
                    { icon: Newspaper, label: 'News', tab: 'news', shortcut: '⌘4' }
                  ].map(({ icon: Icon, label, tab, shortcut }) => (
                    <Tooltip key={tab} text={`${label} (${shortcut})`}>
                  <button
                        onClick={() => handleTabChange(tab as any)}
                        className={`flex flex-col items-center gap-1.5 min-w-[64px] transition-all duration-150 ${
                          activeTab === tab 
                            ? 'text-[#000000] scale-105' 
                            : 'text-gray-500 hover:text-gray-700 hover:scale-102'
                        }`}
                        aria-label={`Switch to ${label} tab`}
                        aria-current={activeTab === tab ? 'page' : undefined}
                      >
                        <Icon size={20} strokeWidth={2} />
                        <span className="text-[12px] font-medium">{label}</span>
                  </button>
                    </Tooltip>
                ))}
            </div>
          </motion.div>
        )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;