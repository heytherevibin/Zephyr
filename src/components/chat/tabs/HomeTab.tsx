import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, HelpCircle, Volume2, Settings, ChevronRight, Search, Clock, Star, Archive, Trash2, MoreVertical, User, Tag, Calendar, MessageSquarePlus, MessageCircle } from 'lucide-react';
import type { HelpArticle, NewsItem, Conversation } from '../types';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { CHAT_CONSTANTS } from '../constants';

interface HomeTabProps {
  isLoading: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
  onTabChange: (tab: 'messages' | 'help' | 'news') => void;
  recentConversations?: Array<{
    id: string;
    title: string;
    preview: string;
    timestamp: Date;
    avatar?: string;
    unread: boolean;
    status?: 'active' | 'archived' | 'deleted';
    priority?: 'high' | 'medium' | 'low';
    tags?: string[];
    assignedTo?: string;
  }>;
  helpArticles?: HelpArticle[];
  newsItems?: NewsItem[];
  onArticleClick: (articleId: string) => void;
  onNewsClick: (newsId: string) => void;
  onConversationSelect?: (conversationId: string) => void;
  onConversationStatusChange?: (conversationId: string, status: 'active' | 'archived' | 'deleted') => void;
  onConversationPriorityChange?: (conversationId: string, priority: 'high' | 'medium' | 'low') => void;
  onConversationAssign?: (conversationId: string, userId: string) => void;
  onConversationTag?: (conversationId: string, tag: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  isLoading,
  searchQuery,
  onSearch,
  onTabChange,
  recentConversations = [],
  helpArticles = [],
  newsItems = [],
  onArticleClick,
  onNewsClick,
  onConversationSelect,
  onConversationStatusChange,
  onConversationPriorityChange,
  onConversationAssign,
  onConversationTag,
}) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showConversationMenu, setShowConversationMenu] = useState<string | null>(null);

  const formatTimeAgo = (date: Date | string | number) => {
    const now = new Date();
    const dateObj = date instanceof Date ? date : new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    onConversationSelect?.(conversationId);
  };

  const handleStatusChange = (conversationId: string, status: 'active' | 'archived' | 'deleted') => {
    onConversationStatusChange?.(conversationId, status);
    setShowConversationMenu(null);
  };

  const handlePriorityChange = (conversationId: string, priority: 'high' | 'medium' | 'low') => {
    onConversationPriorityChange?.(conversationId, priority);
    setShowConversationMenu(null);
  };

  const filteredConversations = recentConversations
    .map(conv => ({
      ...conv,
      timestamp: new Date(conv.timestamp)
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 1);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="relative bg-gradient-to-b from-black via-black to-white text-white p-8">
        <div className="pt-4 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-[32px] font-semibold leading-tight tracking-tight">Hi there 👋</h1>
              <p className="text-[16px] text-white/80 font-normal mt-1">We typically reply within an hour</p>
            </div>
          </div>
          <p className="text-[17px] text-white/90 leading-relaxed font-normal max-w-2xl">
            Ask us anything, or browse through our most popular topics below.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative mt-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search our help articles..."
            className="w-full h-12 bg-white/10 backdrop-blur-sm text-black placeholder-black/50 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all text-[16px] border border-white/10 focus:border-white/20 focus:bg-white/15"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/50" />
        </div>

        {/* Quick Action Button */}
        <div className="mt-6">
          <button
            onClick={() => {
              onTabChange('messages');
              onConversationSelect?.('');
            }}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-black px-6 py-4 rounded-2xl text-left transition-all group flex items-center justify-between border border-white/10 hover:border-white/20"
          >
            <div className="flex items-center gap-4">
              <Volume2 className="w-6 h-6 text-black" />
              <div>
                <p className="font-medium text-[17px] text-black">Ask a question</p>
                <p className="text-[15px] text-black/60 group-hover:text-black/80">Get help from our support team</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-black/60 group-hover:text-black/80 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-8 py-8 space-y-8">
          {/* Recent Conversations */}
          {filteredConversations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-gray-900">Recent conversations</h2>
                <button 
                  onClick={() => onTabChange('messages')}
                  className="text-[14px] text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className="w-full bg-white hover:bg-gray-50 p-3 rounded-xl text-left transition-all group relative border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0 shadow-md">
                        {conversation.avatar ? (
                          <img src={conversation.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-white font-medium text-[16px]">
                            {conversation.title.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-[15px] text-gray-900">{conversation.title}</p>
                          {conversation.unread && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[14px] text-gray-600 line-clamp-1">{conversation.preview}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[13px]">
                            {formatTimeAgo(conversation.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-[20px] font-semibold text-gray-900">Quick actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  title: 'Start new', 
                  desc: 'Send us a message', 
                  icon: MessageSquarePlus, 
                  action: () => onTabChange('messages'),
                  primary: true
                },
                { 
                  title: 'Help Center', 
                  desc: 'Search articles', 
                  icon: HelpCircle,
                  action: () => onTabChange('help')
                },
                { 
                  title: 'Product News', 
                  desc: 'Latest updates', 
                  icon: Volume2,
                  action: () => onTabChange('news'),
                  badge: newsItems.filter(item => !item.read).length
                },
                { 
                  title: 'Settings', 
                  desc: 'Preferences', 
                  icon: Settings,
                  action: () => console.log('Settings clicked')
                }
              ].map((action) => (
                <button 
                  key={action.title}
                  onClick={action.action}
                  className="bg-white hover:bg-gray-50 px-5 py-4 rounded-2xl text-left transition-all group relative border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <action.icon className="w-5.5 h-5.5 text-gray-900" />
                        {action.badge && (
                          <span className="bg-blue-500 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                            {action.badge}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <p className="font-medium text-[16px] text-gray-900">
                      {action.title}
                    </p>
                    <p className="text-[15px] text-gray-600 mt-1">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Help Articles */}
          {helpArticles.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-[20px] font-semibold text-gray-900">Popular articles</h2>
              <div className="space-y-3">
                {helpArticles.slice(0, 4).map((article) => (
                  <button 
                    key={article.id}
                    onClick={() => {
                      onTabChange('help');
                      onArticleClick(article.id);
                    }}
                    className="w-full bg-white hover:bg-gray-50 px-5 py-4 rounded-2xl text-left transition-all group border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-[16px] text-gray-900 truncate">{article.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[14px] text-gray-600">{article.category}</span>
                          <span className="text-[14px] text-gray-400">•</span>
                          <span className="text-[14px] text-gray-600">{article.views} views</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* News Items */}
          {newsItems.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-[20px] font-semibold text-gray-900">Latest updates</h2>
              <div className="space-y-3">
                {newsItems.slice(0, 2).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNewsClick(item.id)}
                    className="w-full bg-white hover:bg-gray-50 p-5 rounded-2xl text-left transition-all group border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Volume2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-[16px] text-gray-900">{item.title}</p>
                          {!item.read && (
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[15px] text-gray-600 line-clamp-2">{item.content}</p>
                        <div className="flex items-center gap-2 mt-3 text-gray-500">
                          <span className="text-[14px]">{item.category}</span>
                          <span className="text-[14px]">•</span>
                          <span className="text-[14px]">
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
          )}
        </div>
      </div>
    </div>
  );
}; 