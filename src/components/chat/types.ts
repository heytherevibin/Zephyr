export interface Reaction {
  id: string;
  emoji: string;
  count: number;
  users: string[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  previewUrl?: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress?: number;
  error?: string;
}

export interface MessageThread {
  id: string;
  messages: Message[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
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

export interface QuickReply {
  id: string;
  text: string;
  category: string;
}

export interface SavedResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  views: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
  read: boolean;
}

export interface SearchResults {
  articles: HelpArticle[];
  news: NewsItem[];
}

export interface ChatState {
  messages: Message[];
  threads: MessageThread[];
  activeThread: string | null;
  quickReplies: QuickReply[];
  savedResponses: SavedResponse[];
  helpArticles: HelpArticle[];
  newsItems: NewsItem[];
  searchResults: SearchResults;
  isSearching: boolean;
  searchQuery: string;
  activeTab: 'home' | 'messages' | 'help' | 'news';
  isWidgetOpen: boolean;
  isMinimized: boolean;
  unreadCount: number;
  isTyping: boolean;
  selectedFiles: File[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export interface ChatWidgetProps {
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

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  messages: Message[];
  status: 'active' | 'archived' | 'deleted';
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  assignedTo?: string;
  avatar?: string;
} 