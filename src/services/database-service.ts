/**
 * Database Service
 * Handles persistent storage for conversations, messages, and analytics
 */
import { Message, MessageThread, HelpArticle, NewsItem } from '../types';

// Define interfaces for database operations
export interface DatabaseConfig {
  type: 'localStorage' | 'indexedDB' | 'api';
  apiEndpoint?: string;
}

export interface ConversationRecord {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  messages: Message[];
  status: 'active' | 'archived' | 'deleted';
}

export interface AnalyticsRecord {
  id: string;
  type: 'message' | 'article_view' | 'news_read';
  timestamp: Date;
  data: Record<string, any>;
}

class DatabaseService {
  private config: DatabaseConfig;
  private isInitialized = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * Initialize the database connection
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (this.config.type === 'localStorage') {
        // Check if localStorage is available
        if (typeof window !== 'undefined' && window.localStorage) {
          this.isInitialized = true;
        } else {
          throw new Error('localStorage is not available');
        }
      } else if (this.config.type === 'indexedDB') {
        // Initialize IndexedDB
        // This would be implemented in a real application
        this.isInitialized = true;
      } else if (this.config.type === 'api') {
        // Test API connection
        if (!this.config.apiEndpoint) {
          throw new Error('API endpoint is required for API storage type');
        }
        this.isInitialized = true;
      } else {
        throw new Error(`Unsupported database type: ${this.config.type}`);
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Save a conversation to the database
   */
  async saveConversation(conversation: ConversationRecord): Promise<void> {
    await this.initialize();

    try {
      if (this.config.type === 'localStorage') {
        const conversations = this.getConversationsFromStorage();
        const existingIndex = conversations.findIndex(c => c.id === conversation.id);
        
        if (existingIndex >= 0) {
          conversations[existingIndex] = conversation;
        } else {
          conversations.push(conversation);
        }
        
        localStorage.setItem('conversations', JSON.stringify(conversations));
      } else if (this.config.type === 'api') {
        // Make API call to save conversation
        await fetch(`${this.config.apiEndpoint}/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(conversation),
        });
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations from the database
   */
  async getConversations(): Promise<ConversationRecord[]> {
    await this.initialize();

    try {
      if (this.config.type === 'localStorage') {
        return this.getConversationsFromStorage();
      } else if (this.config.type === 'api') {
        const response = await fetch(`${this.config.apiEndpoint}/conversations`);
        return await response.json();
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get conversations:', error);
      return [];
    }
  }

  /**
   * Get conversations from localStorage
   */
  private getConversationsFromStorage(): ConversationRecord[] {
    try {
      const data = localStorage.getItem('conversations');
      if (!data) return [];
      
      const conversations = JSON.parse(data);
      return conversations.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Failed to parse conversations from storage:', error);
      return [];
    }
  }

  /**
   * Save analytics data
   */
  async saveAnalytics(record: AnalyticsRecord): Promise<void> {
    await this.initialize();

    try {
      if (this.config.type === 'localStorage') {
        const analytics = this.getAnalyticsFromStorage();
        analytics.push(record);
        localStorage.setItem('analytics', JSON.stringify(analytics));
      } else if (this.config.type === 'api') {
        await fetch(`${this.config.apiEndpoint}/analytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(record),
        });
      }
    } catch (error) {
      console.error('Failed to save analytics:', error);
      // Don't throw error for analytics failures
    }
  }

  /**
   * Get analytics from localStorage
   */
  private getAnalyticsFromStorage(): AnalyticsRecord[] {
    try {
      const data = localStorage.getItem('analytics');
      if (!data) return [];
      
      const analytics = JSON.parse(data);
      return analytics.map((record: any) => ({
        ...record,
        timestamp: new Date(record.timestamp),
      }));
    } catch (error) {
      console.error('Failed to parse analytics from storage:', error);
      return [];
    }
  }

  /**
   * Clear all data from the database
   */
  async clearAllData(): Promise<void> {
    await this.initialize();

    try {
      if (this.config.type === 'localStorage') {
        localStorage.removeItem('conversations');
        localStorage.removeItem('analytics');
      } else if (this.config.type === 'api') {
        await fetch(`${this.config.apiEndpoint}/clear-all`, {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const databaseService = new DatabaseService({
  type: 'localStorage', // Default to localStorage
});

export default databaseService; 