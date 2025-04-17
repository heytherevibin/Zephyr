import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Home, HelpCircle, MessageCircle, Volume2, Search, ChevronRight, Clock, Settings, Send, Smile, Paperclip, Image, ThumbsUp, Reply, Star, Copy, Check, CheckCheck, ArrowUp, MessageSquareText, BookOpen, Newspaper, MessageCirclePlus, MessageCircleX, MessageSquareDashed, MessageSquareOff, ArrowLeft } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import type { ChatWidgetProps, Message, MessageThread, FileAttachment, HelpArticle, NewsItem, Reaction, QuickReply, SavedResponse } from './chat/types';
import type { Conversation } from '../store/chatStore';
import { TypingIndicator } from './chat/TypingIndicator';
import { Tooltip } from './chat/Tooltip';
import { LoadingSkeleton } from './chat/LoadingSkeleton';
import { MessagesTab } from './chat/tabs/MessagesTab';
import { HelpTab } from './chat/tabs/HelpTab';
import { NewsTab } from './chat/tabs/NewsTab';
import { HomeTab } from './chat/tabs/HomeTab';
import { MessageList } from './chat/messages/MessageList';
import { MessageInput } from './chat/messages/MessageInput';
import { AttachmentPreview } from './chat/messages/AttachmentPreview';
import { useSound } from './chat/hooks/useSound';
import { CHAT_CONSTANTS } from './chat/constants';
import { CHAT_STYLES, ANIMATIONS } from './chat/styles';

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
  const { isEnabled: isSoundEnabled } = useSound({
    enabled: soundEnabled,
    soundUrl: CHAT_CONSTANTS.SOUND.NOTIFICATION_URL
  });
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'help' | 'news'>('home');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
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
  const [botStep, setBotStep] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [needsHumanSupport, setNeedsHumanSupport] = useState<boolean | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pullToRefreshRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const { recentConversations, addMessage } = useChatStore();
  
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

  // Add bot flow steps
  const botSteps = [
    {
      id: 'welcome',
      message: "Hi! I'm here to help. What can I assist you with today?",
      options: departments.map(dept => ({
        id: dept.id,
        text: `${dept.icon} ${dept.name}`,
        description: dept.description
      }))
    },
    {
      id: 'department_selected',
      message: "Great! I'll help you with that. Would you like to:",
      options: [
        { id: 'continue_bot', text: "Continue with AI Assistant", description: "Get instant help from our AI" },
        { id: 'human_agent', text: "Talk to Human Agent", description: "Connect with a support agent" }
      ]
    }
  ];

  // Group messages by date
  useEffect(() => {
    const grouped = messages.reduce((acc, message) => {
      const timestamp = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp);
      const date = timestamp.toDateString();
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
      const timestamp = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp);
      const date = timestamp.toDateString();
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
    width: mobileFullScreen ? '100%' : '400px',
    maxWidth: mobileFullScreen ? '100%' : '400px',
    height: mobileFullScreen ? '100vh' : '700px'
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
  }, [messages, inputValue, activeTab]);

  // Handle department selection
  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setBotStep(1);
    
    const department = departments.find(d => d.id === departmentId);
    const message: Message = {
      id: Date.now().toString(),
      text: `I'll help you with ${department?.name.toLowerCase()} related questions.`,
      sender: 'bot',
      timestamp: new Date(),
        status: 'sent'
      };
    setMessages(prev => [...prev, message]);
  };

  // Handle support type selection
  const handleSupportTypeSelect = (type: 'continue_bot' | 'human_agent') => {
    if (type === 'human_agent') {
      setNeedsHumanSupport(true);
      const message: Message = {
      id: Date.now().toString(),
        text: "I'll connect you with a human agent. Please wait a moment...",
        sender: 'bot',
      timestamp: new Date(),
        status: 'sent'
    };
      setMessages(prev => [...prev, message]);
    
      // Simulate agent connection
    setTimeout(() => {
        const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
          text: `Hi! I'm ${agentName}, how can I help you today?`,
        sender: 'agent',
        timestamp: new Date(),
        avatar: agentAvatar,
        status: 'sent'
      };
        setMessages(prev => [...prev, agentMessage]);
    }, 2000);
    } else {
      setNeedsHumanSupport(false);
      const message: Message = {
      id: Date.now().toString(),
        text: "I'll continue helping you. What specific question do you have?",
        sender: 'bot',
      timestamp: new Date(),
        status: 'sent'
      };
      setMessages(prev => [...prev, message]);
    }
  };

  // Update the handleSendMessage function
  const handleSendMessage = (text: string | { format: string; content: string }) => {
    const messageText = typeof text === 'string' ? text : text.content;
    if (!messageText.trim() && selectedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      attachments: selectedFiles.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url,
        status: 'uploaded'
      }))
    };

    // Update local state immediately
    setMessages(prev => [...prev, newMessage]);

    // Add message to store
    const store = useChatStore.getState();
    store.addMessage(newMessage);

    // Simulate message delivery
    setTimeout(() => {
      store.updateMessageStatus(newMessage.id, 'sent');
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 1000);

    // Simulate message being delivered
    setTimeout(() => {
      store.updateMessageStatus(newMessage.id, 'delivered');
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 2000);

    // Simulate message being read and trigger bot response
    setTimeout(() => {
      store.updateMessageStatus(newMessage.id, 'read');
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));

      // Show typing indicator
      setIsTyping(true);

      // Simulate bot response after a delay
      setTimeout(() => {
        setIsTyping(false);

        // Generate bot response based on user message
        let botResponse: Message;
        if (needsHumanSupport) {
          botResponse = {
            id: Date.now().toString(),
            text: "I've notified our support team. They'll get back to you as soon as possible. In the meantime, is there anything specific you'd like to know?",
            sender: 'bot',
            timestamp: new Date(),
            status: 'sent'
          };
        } else {
          // Default bot responses based on common patterns
          if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) {
            botResponse = {
              id: Date.now().toString(),
              text: "Hello! How can I assist you today?",
              sender: 'bot',
              timestamp: new Date(),
              status: 'sent'
            };
          } else if (messageText.toLowerCase().includes('help')) {
            botResponse = {
              id: Date.now().toString(),
              text: "I'm here to help! Could you please specify what you need assistance with?",
              sender: 'bot',
              timestamp: new Date(),
              status: 'sent'
            };
          } else if (messageText.toLowerCase().includes('thank')) {
            botResponse = {
              id: Date.now().toString(),
              text: "You're welcome! Is there anything else you need help with?",
              sender: 'bot',
              timestamp: new Date(),
              status: 'sent'
            };
          } else {
            botResponse = {
              id: Date.now().toString(),
              text: "I understand. Could you please provide more details about your request so I can better assist you?",
              sender: 'bot',
              timestamp: new Date(),
              status: 'sent'
            };
          }
        }

        // Add bot response to messages and store
        setMessages(prev => [...prev, botResponse]);
        store.addMessage(botResponse);
      }, 1500); // Delay before bot responds
    }, 3000);

    // Clear input
    setInputValue('');
    setSelectedFiles([]);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newAttachments: FileAttachment[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
            name: file.name,
            type: file.type,
      size: file.size,
            url: URL.createObjectURL(file),
      status: 'uploading'
    }));

    setSelectedFiles(prev => [...prev, ...newAttachments]);

    // Simulate file upload
    for (const attachment of newAttachments) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSelectedFiles(prev => 
        prev.map(f => f.id === attachment.id 
          ? { ...f, status: 'uploaded' }
          : f
        )
      );
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.url) URL.revokeObjectURL(fileToRemove.url);
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleFileUpload = (file: File) => {
    if (!onFileUpload) return;
    onFileUpload(file);
  };

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
      const handleNativeFileChange = async (event: Event) => {
        const fileInput = event.target as HTMLInputElement;
        const files = fileInput.files;
        if (!files || files.length === 0) return;

        try {
          const newFiles: FileAttachment[] = await Promise.all(
            Array.from(files).map(async (file) => ({
                id: Date.now().toString(),
                name: file.name,
                type: file.type,
                url: URL.createObjectURL(file),
              size: file.size,
              status: 'uploading'
            }))
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

  // Update cleanup for object URLs
  useEffect(() => {
    const urls = selectedFiles.map(file => file.url).filter(Boolean);
    return () => {
      urls.forEach(url => {
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

  const handleAttachmentClick = useCallback((attachmentId: string) => {
    const attachment = selectedFiles.find(f => f.id === attachmentId);
    if (attachment) {
      window.open(attachment.url, '_blank');
    }
  }, [selectedFiles]);

  const handleRemoveAttachment = useCallback((id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
    }, []);
    
  const handleReaction = (messageId: string, reaction: Reaction) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              reactions: msg.reactions ? [...msg.reactions, reaction] : [reaction]
            }
          : msg
      )
    );
  };

  const handleRemoveReaction = (messageId: string, reactionId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              reactions: msg.reactions?.filter(r => r.id !== reactionId)
            }
          : msg
      )
    );
  };

  const handleConversationSelect = (conversationId: string) => {
    // Find any existing bot conversation
    const existingBotConversation = recentConversations.find(conv => 
      conv.messages.some(msg => msg.sender === 'bot') && 
      !conv.messages.some(msg => msg.sender === 'agent')
    );

    if (conversationId) {
      // If a conversation is selected, set it as active
      setActiveConversation(conversationId);
      // Load messages for this conversation
      const conversation = recentConversations.find(c => c.id === conversationId);
      if (conversation) {
        // Convert MessageReaction to Reaction type and ensure timestamps are Date objects
        const convertedMessages = conversation.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
          reactions: msg.reactions?.map(reaction => ({
            id: reaction.emoji,
            emoji: reaction.emoji,
            count: reaction.count,
            users: reaction.users
          }))
        }));
        setMessages(convertedMessages);
      }
    } else if (existingBotConversation) {
      // If there's an existing bot conversation, use that
      setActiveConversation(existingBotConversation.id);
      const convertedMessages = existingBotConversation.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
        reactions: msg.reactions?.map(reaction => ({
          id: reaction.emoji,
          emoji: reaction.emoji,
          count: reaction.count,
          users: reaction.users
        }))
      }));
      setMessages(convertedMessages);
    } else {
      // Create a new bot conversation
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
                  title: 'New Conversation',
                  lastMessage: '',
                  timestamp: new Date(),
                  unread: false,
        messages: [],
        status: 'active'
      };
      
      // Create welcome message
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        text: "Hello! How can I help you today?",
        sender: 'bot',
                  timestamp: new Date(),
                  status: 'sent'
                };
                
      // Add the welcome message to the conversation
      newConversation.messages = [welcomeMessage];
      
      // Add the new conversation to the store
      useChatStore.getState().addConversation(newConversation);
      
      // Set it as active and initialize with the welcome message
      setActiveConversation(newConversation.id);
      setMessages([welcomeMessage]);
    }
    
    // Always open the chat widget and switch to messages tab
    setIsOpen(true);
    setActiveTab('messages');
  };

  const renderMessagesTab = () => (
    <MessagesTab
      messages={messages}
      isTyping={isTyping}
      onSendMessage={handleSendMessage}
      onFileUpload={handleFileUpload}
      onReaction={handleReaction}
      onAttachmentClick={handleAttachmentClick}
      onRemoveAttachment={handleRemoveAttachment}
      onRemoveReaction={handleRemoveReaction}
      quickReplies={quickReplies}
      savedResponses={savedResponses}
      recentConversations={recentConversations
        .map(conv => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map(msg => ({
            ...msg,
            reactions: msg.reactions?.map(reaction => ({
              id: reaction.emoji,
              emoji: reaction.emoji,
              count: reaction.count,
              users: reaction.users
            }))
          }))
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())}
      onConversationSelect={handleConversationSelect}
      onClose={handleCloseButtonClick}
    />
  );

  const renderHelpTab = () => (
    <HelpTab
      searchQuery={searchQuery}
      onSearch={handleSearch}
      isSearching={isSearching}
      helpArticles={helpArticles}
      onArticleClick={handleArticleClick}
      activeArticle={activeArticle}
      searchResults={searchResults.articles}
    />
  );

  const renderNewsTab = () => (
    <NewsTab
      searchQuery={searchQuery}
      onSearch={handleSearch}
      isSearching={isSearching}
      newsItems={newsItems}
      onNewsClick={handleNewsClick}
      activeNewsItem={activeNewsItem}
      searchResults={searchResults.news}
    />
  );

  const renderHomeTab = () => (
    <HomeTab
      isLoading={isHomeLoading}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      onTabChange={setActiveTab}
      recentConversations={(recentConversations || []).map(conv => ({
        id: conv.id,
        title: conv.title || 'New Conversation',
        preview: conv.lastMessage || 'No messages yet',
        timestamp: conv.timestamp || new Date(),
        unread: conv.unread || false
      }))}
      helpArticles={helpArticles}
      newsItems={newsItems}
      onArticleClick={handleArticleClick}
      onNewsClick={handleNewsClick}
      onConversationSelect={handleConversationSelect}
    />
  );

  return (
    <div className={`fixed ${position} z-50`} style={{ margin: offset }}>
      {/* Trigger Button */}
      <Tooltip text={isOpen ? 'Close chat' : 'Open chat'}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-[60px] h-[60px] bg-[#000000] text-white rounded-full shadow-lg hover:shadow-xl transition-all relative z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={false}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            mass: 0.8
          }}
          aria-label="Open chat"
          style={{
            position: 'fixed',
            right: position === 'bottom-right' ? offset : 'auto',
            left: position === 'bottom-left' ? offset : 'auto',
            bottom: offset,
            zIndex: 50
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

      {/* File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept="image/*,application/pdf"
      />

      {/* Chat Window */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              mass: 0.8
            }}
            className="fixed bottom-[76px] right-0 w-full max-w-[400px] h-[700px] bg-white rounded-[16px] shadow-2xl flex flex-col sm:max-w-[400px] md:max-w-[400px] xs:bottom-0 xs:right-0 xs:w-full xs:h-[100vh] xs:rounded-none xs:max-h-[100vh] overflow-hidden"
            style={{ 
              overflow: 'hidden',
              marginBottom: '16px',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              right: position === 'bottom-right' ? offset : 'auto',
              left: position === 'bottom-left' ? offset : 'auto',
              zIndex: 50,
              borderRadius: '16px'
            }}
          >
            {/* Pull to refresh indicator */}
            {isRefreshing && (
              <div key="refresh-indicator" className="absolute top-0 left-0 right-0 h-1 bg-black">
                <div className="h-full bg-gray-800 animate-pulse"></div>
                  </div>
                )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Simplified tab content rendering without AnimatePresence */}
              {activeTab === 'messages' && <div key="messages-tab">{renderMessagesTab()}</div>}
              {activeTab === 'help' && <div key="help-tab">{renderHelpTab()}</div>}
              {activeTab === 'news' && <div key="news-tab">{renderNewsTab()}</div>}
              {activeTab === 'home' && <div key="home-tab">{renderHomeTab()}</div>}
            </div>

            {/* Bottom Navigation - Only show when not in messages tab */}
            {activeTab !== 'messages' && (
              <motion.div 
                key="bottom-nav"
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

      {/* Add bot flow UI */}
      {activeTab === 'messages' && botStep === 0 && !selectedDepartment && (
        <div key="bot-flow-0" className="p-4 space-y-4">
          <div className="text-center text-gray-600 mb-4">
            {botSteps[0].message}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {botSteps[0].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleDepartmentSelect(option.id)}
                className="flex items-start p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all group text-left"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.text}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'messages' && botStep === 1 && selectedDepartment && !needsHumanSupport && (
        <div key="bot-flow-1" className="p-4 space-y-4">
          <div className="text-center text-gray-600 mb-4">
            {botSteps[1].message}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {botSteps[1].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleSupportTypeSelect(option.id as 'continue_bot' | 'human_agent')}
                className="flex items-start p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all group text-left"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.text}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;