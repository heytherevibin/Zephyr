/**
 * Common Type Definitions
 * This file contains shared type definitions used across the application
 */

// Re-export all types from chat.ts
export * from './chat';

// Re-export all types from enterprise directory
export * from './enterprise';

// Common types used across the application
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastActive?: Date;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  sound: boolean;
  language: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: {
    path: string;
    views: number;
  }[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
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

export interface Message {
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

export interface MessageThread {
  id: string;
  messages: Message[];
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
  participants?: string[];
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
  helpful?: number;
  notHelpful?: number;
  tags?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
} 