import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  avatar?: string;
  attachments?: FileAttachment[];
  threadId?: string;
  reactions?: MessageReaction[];
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  messages: Message[];
  status: 'active' | 'archived' | 'deleted';
  assignedTo?: string;
  tags?: string[];
}

interface MessageThread {
  id: string;
  messages: Message[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
  participants: string[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  previewUrl?: string;
  size: number;
  status: 'uploading' | 'uploaded' | 'error';
  error?: string;
}

interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface SearchResults {
  messages: Message[];
  articles: HelpArticle[];
  news: NewsItem[];
}

// @ts-ignore - Interface parameters are used in implementation
interface ChatState {
  // UI State
  isOpen: boolean;
  activeTab: 'home' | 'messages' | 'help' | 'news';
  isTyping: boolean;
  showEmojiPicker: boolean;
  isHomeLoading: boolean;
  hasHomeLoaded: boolean;
  loadingProgress: number;
  isRefreshing: boolean;
  isTabTransitioning: boolean;
  showDepartmentSuggestions: boolean;
  error: string | null;
  
  // Chat Data
  messages: Message[];
  conversations: Conversation[];
  recentConversations: Conversation[];
  activeConversation: string | null;
  threads: MessageThread[];
  activeThread: string | null;
  unreadCount: number;
  inputText: string;
  selectedFiles: FileAttachment[];
  lastReadTimestamp: Date;
  
  // Bot Flow State
  botConversationStep: number;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  needsHumanSupport: boolean | null;
  
  // Search State
  searchQuery: string;
  filteredMessages: Message[];
  searchResults: SearchResults;
  isSearching: boolean;
  
  // New Conversation Management
  updateConversationStatus: (conversationId: string, status: 'active' | 'archived' | 'deleted') => void;
  updateConversationPriority: (conversationId: string, priority: 'high' | 'medium' | 'low') => void;
  assignConversation: (conversationId: string, userId: string) => void;
  addTagToConversation: (conversationId: string, tag: string) => void;
  removeTagFromConversation: (conversationId: string, tag: string) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  markConversationAsUnread: (conversationId: string) => void;
  updateRecentConversations: () => void;
  
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: 'home' | 'messages' | 'help' | 'news') => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setTyping: (isTyping: boolean) => void;
  setInputText: (text: string) => void;
  addConversation: (conversation: Conversation) => void;
  setActiveConversation: (conversationId: string | null) => void;
  markAsRead: () => void;
  handleSearch: (query: string) => void;
  setBotStep: (step: number) => void;
  setCategory: (category: string | null) => void;
  setNeedsHumanSupport: (needs: boolean | null) => void;
  resetChat: () => void;
  
  // New Actions
  createThread: (messageId: string, title: string) => void;
  addMessageToThread: (threadId: string, message: Message) => void;
  updateThread: (threadId: string, updates: Partial<MessageThread>) => void;
  deleteThread: (threadId: string) => void;
  addReaction: (messageId: string, reaction: MessageReaction) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  setError: (error: string | null) => void;
}

const initialState = {
  isOpen: false,
  activeTab: 'home' as const,
  isTyping: false,
  showEmojiPicker: false,
  isHomeLoading: true,
  hasHomeLoaded: false,
  loadingProgress: 0,
  isRefreshing: false,
  isTabTransitioning: false,
  showDepartmentSuggestions: false,
  error: null,
  
  messages: [],
  conversations: [],
  recentConversations: [],
  activeConversation: null,
  threads: [],
  activeThread: null,
  unreadCount: 0,
  inputText: '',
  selectedFiles: [],
  lastReadTimestamp: new Date(),
  
  botConversationStep: 0,
  selectedCategory: null,
  selectedSubcategory: null,
  needsHumanSupport: null,
  
  searchQuery: '',
  filteredMessages: [],
  searchResults: {
    messages: [],
    articles: [],
    news: []
  },
  isSearching: false,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // UI Actions
      setIsOpen: (isOpen) => set({ isOpen }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setTyping: (isTyping) => set({ isTyping }),
      setError: (error) => set({ error }),
      
      // Message Actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          ...message,
          timestamp: message.timestamp ? (message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)) : new Date()
        }]
      })),
      
      updateMessage: (messageId, updates) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { 
            ...msg, 
            ...updates,
            timestamp: updates.timestamp ? (updates.timestamp instanceof Date ? updates.timestamp : new Date(updates.timestamp)) : msg.timestamp
          } : msg
        )
      })),
      
      updateMessageStatus: (messageId, status) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { ...msg, status } : msg
        )
      })),
      
      setInputText: (text) => set({ inputText: text }),
      
      // Conversation Actions
      addConversation: (conversation) => {
        const newConversation = {
          ...conversation,
          timestamp: conversation.timestamp instanceof Date ? conversation.timestamp : new Date(conversation.timestamp),
          messages: conversation.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
          }))
        };
        set((state) => ({
          conversations: [...state.conversations, newConversation]
        }));
        get().updateRecentConversations();
      },
      
      setActiveConversation: (conversationId) => set({ activeConversation: conversationId }),
      
      markAsRead: () => set({ unreadCount: 0 }),
      
      // Thread Actions
      createThread: (messageId, title) => set((state) => ({
        threads: [...state.threads, {
          id: crypto.randomUUID(),
          messageId,
          title,
          messages: [],
          participants: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),
      
      addMessageToThread: (threadId, message) => set((state) => ({
        threads: state.threads.map(thread =>
          thread.id === threadId
            ? {
                ...thread,
                messages: [...thread.messages, message],
                updatedAt: new Date()
              }
            : thread
        )
      })),
      
      updateThread: (threadId, updates) => set((state) => ({
        threads: state.threads.map(thread =>
          thread.id === threadId
            ? { ...thread, ...updates, updatedAt: new Date() }
            : thread
        )
      })),
      
      deleteThread: (threadId) => set((state) => ({
        threads: state.threads.filter(thread => thread.id !== threadId)
      })),
      
      // Reaction Actions
      addReaction: (messageId, reaction) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: [...(msg.reactions || []), reaction]
              }
            : msg
        )
      })),
      
      removeReaction: (messageId, emoji, userId) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: (msg.reactions || []).map(reaction =>
                  reaction.emoji === emoji
                    ? {
                        ...reaction,
                        users: reaction.users.filter(id => id !== userId),
                        count: reaction.count - 1
                      }
                    : reaction
                ).filter(reaction => reaction.count > 0)
              }
            : msg
        )
      })),
      
      // Search Actions
      handleSearch: (query) => set({ searchQuery: query, isSearching: true }),
      
      // Bot Flow Actions
      setBotStep: (step) => set({ botConversationStep: step }),
      setCategory: (category) => set({ selectedCategory: category }),
      setNeedsHumanSupport: (needs) => set({ needsHumanSupport: needs }),
      
      // Reset Action
      resetChat: () => set(initialState),

      // Conversation Management Actions
      updateConversationStatus: (conversationId, status) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, status } : conv
          )
        }));
        get().updateRecentConversations();
      },

      updateConversationPriority: (conversationId, priority) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, priority } : conv
          )
        }));
        get().updateRecentConversations();
      },

      assignConversation: (conversationId, userId) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, assignedTo: userId } : conv
          )
        }));
        get().updateRecentConversations();
      },

      addTagToConversation: (conversationId, tag) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? { ...conv, tags: [...(conv.tags || []), tag] }
              : conv
          )
        }));
        get().updateRecentConversations();
      },

      removeTagFromConversation: (conversationId, tag) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? { ...conv, tags: (conv.tags || []).filter(t => t !== tag) }
              : conv
          )
        }));
        get().updateRecentConversations();
      },

      updateConversationTitle: (conversationId, title) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, title } : conv
          )
        }));
        get().updateRecentConversations();
      },

      deleteConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.filter(conv => conv.id !== conversationId)
        }));
        get().updateRecentConversations();
      },

      markConversationAsRead: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, unread: false } : conv
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
        get().updateRecentConversations();
      },

      markConversationAsUnread: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, unread: true } : conv
          ),
          unreadCount: state.unreadCount + 1
        }));
        get().updateRecentConversations();
      },

      updateRecentConversations: () => {
        const recent = get().conversations
          .map(conv => ({
            ...conv,
            timestamp: conv.timestamp instanceof Date ? conv.timestamp : new Date(conv.timestamp),
            messages: conv.messages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
            }))
          }))
          .sort((a, b) => {
            const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
            const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 2);
        set({ recentConversations: recent });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        recentConversations: state.recentConversations,
        threads: state.threads,
        messages: state.messages,
        activeConversation: state.activeConversation,
        lastReadTimestamp: state.lastReadTimestamp,
        unreadCount: state.unreadCount
      }),
    }
  )
); 