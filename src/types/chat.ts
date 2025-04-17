export interface Attachment {
  id: string;
  url: string;
  filename: string;
  size?: number;
  type?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  avatar?: string;
  reactions?: Reaction[];
  attachments?: Attachment[];
  threadId?: string;
  isThreadReply?: boolean;
  richText?: {
    format: 'bold' | 'italic' | 'link' | 'code';
    content: string;
  }[];
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  previewUrl?: string;
  size: number;
}

export interface MessageThread {
  id: string;
  messages: Message[];
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
  category?: string;
  useCount?: number;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  tags?: string[];
  helpful?: number;
  notHelpful?: number;
  lastUpdated?: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
  image?: string;
  link?: string;
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