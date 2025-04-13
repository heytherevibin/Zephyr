import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Home, HelpCircle, MessageCircle, Volume2, Search, ChevronRight, Clock, Settings, Send, Smile, Paperclip, Image, ThumbsUp, Reply, Star, Copy, Check, CheckCheck, ArrowUp, MessageSquareText, BookOpen, Newspaper, MessageCirclePlus, MessageCircleX, MessageSquareDashed, MessageSquareOff } from 'lucide-react';

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
  companyName?: string;
  agentName?: string;
  agentAvatar?: string;
  primaryColor?: string;
  onMessageSend?: (message: string) => void;
  onFileUpload?: (file: File) => void;
  enableTypingPreview?: boolean;
  quickReplies?: QuickReply[];
  savedResponses?: SavedResponse[];
  onArticleView?: (articleId: string) => void;
  onNewsRead?: (newsId: string) => void;
  helpArticles?: HelpArticle[];
  newsItems?: NewsItem[];
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

const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = 'bottom-right',
  offset = 20,
  companyName = 'Support Team',
  agentName = 'Sarah',
  agentAvatar,
  primaryColor = '#000000',
  onMessageSend,
  onFileUpload,
  enableTypingPreview = true,
  quickReplies = [],
  savedResponses = [],
  onArticleView,
  onNewsRead,
  helpArticles = [],
  newsItems = [],
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

  // Enhanced message sending
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
              <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} className="text-white/90" />
              </button>
        
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
                <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Categories</h2>
                <div className="grid grid-cols-2 gap-3">
                  {['Getting Started', 'Account & Billing', 'Features', 'Troubleshooting'].map((category) => (
                    <button
                      key={category}
                      className="bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl text-left transition-all group"
                    >
                      <h3 className="text-[15px] font-medium text-gray-900 mb-1">{category}</h3>
                      <div className="flex items-center text-gray-600">
                        <span className="text-[14px]">View articles</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
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
      <div className="relative bg-gradient-to-b from-[#1F1F1F] via-[#000000] to-white text-white p-6">
          <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} className="text-white/90" />
          </button>
        
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
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    item.read ? 'bg-gray-50' : 'bg-gray-100'
                  } hover:bg-gray-200`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.read ? 'bg-gray-100' : 'bg-gray-200'
                    }`}>
                      <Volume2 className={`w-5 h-5 ${item.read ? 'text-gray-600' : 'text-gray-800'}`} />
        </div>
                    <div>
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
          <div className="flex-1 flex items-center justify-center pb-[81px]">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background track with gradient */}
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#000000]/5 to-[#1A1A1A]/5"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Spinning track */}
              <motion.div 
                className="absolute top-0 left-0 w-12 h-12 rounded-full border-[2px] border-[#000000] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ 
                  boxShadow: '0 0 12px rgba(0, 0, 0, 0.15)'
                }}
              />
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="relative bg-gradient-to-b from-[#1F1F1F] via-[#000000] to-white text-white p-6">
      <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2.5 hover:bg-gray-100 rounded-full transition-colors z-20"
      >
              <X size={22} className="text-white/90" />
      </button>
            
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
                      action: () => setActiveTab('messages'),
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
                        // Handle settings click
                        console.log('Settings clicked');
                      }
                    }
                  ].map((action) => (
          <button 
                      key={action.title}
                      onClick={action.action}
                      className={`relative bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl text-left transition-all group ${
                        action.primary ? 'bg-gray-100 hover:bg-gray-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <action.icon className={`w-5 h-5 ${action.primary ? 'text-gray-900' : 'text-gray-700'}`} />
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className={`font-medium text-[15px] ${action.primary ? 'text-gray-900' : 'text-gray-900'}`}>
                        {action.title}
                      </p>
                      <p className="text-[14px] text-gray-600 mt-0.5">{action.desc}</p>
                      {action.badge && (
                        <span className="absolute top-3 right-3 bg-black text-white text-[12px] w-5 h-5 rounded-full flex items-center justify-center">
                          {action.badge}
                        </span>
                      )}
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
                      className="w-full group bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl text-left transition-all flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-[15px] text-gray-900 truncate">{article.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-gray-500">
                          <span className="text-[13px]">{article.category}</span>
                          <span className="text-[13px]">•</span>
                          <span className="text-[13px]">{article.views} views</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-3" />
          </button>
                  ))}
      </div>
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

  useEffect(() => {
    const element = pullToRefreshRef.current;
    if (element) {
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

  // Tooltip component
  const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
    <div className="group relative">
      {children}
          <motion.div 
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.2,
          ease: "easeOut"
        }}
      >
        {text}
          </motion.div>
              </div>
        );

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

  const renderMessagesTab = () => (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0 relative bg-white text-gray-900 p-5 pb-4 border-b border-gray-200">
        <button
          onClick={handleCloseButtonClick}
          className="absolute top-5 right-5 p-2.5 hover:bg-gray-100 rounded-lg transition-colors z-20"
          aria-label="Return to home"
        >
          <X size={22} className="text-gray-700" />
        </button>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
            {agentAvatar ? (
              <img src={agentAvatar} alt={agentName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-gray-700 text-xl font-semibold">S</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">{agentName}</h2>
            <p className="text-sm text-gray-500">
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-5 scrollbar-none"
        style={{ 
          scrollBehavior: 'smooth',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          msOverflowStyle: 'none',  /* IE and Edge */
          scrollbarWidth: 'none'     /* Firefox */
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }
        `}</style>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender === 'user' 
                  ? 'bg-[#000000] text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-[15px] leading-relaxed">{message.text}</p>
              </div>
              <div className={`flex items-center gap-1.5 mt-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
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
          ))}
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-transparent">
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
            className="w-full bg-[#F8F9FB] rounded-[30px] py-3.5 pl-4 pr-[120px] outline-none text-[15px] placeholder-gray-400 resize-none max-h-[150px] min-h-[52px] transition-all duration-200"
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
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          multiple
        />
      </div>
    </div>
  );

  return (
    <div style={getPositionStyles()} className="font-sans">
      {/* Launcher Button */}
      <Tooltip text="Press ⌘K to open chat">
          <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-[60px] h-[60px] bg-[#000000] text-white rounded-full shadow-lg hover:shadow-xl transition-all relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={false}
            aria-label="Open chat"
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute bottom-[76px] right-0 w-[400px] h-[700px] bg-white rounded-[28px] shadow-2xl flex flex-col"
            style={{ overflow: 'hidden' }}
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
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
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