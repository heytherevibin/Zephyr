import React from 'react';
import { Search, Volume2, ChevronRight } from 'lucide-react';
import type { NewsItem } from '../types';
import { LoadingSkeleton } from '../LoadingSkeleton';

interface NewsTabProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  isSearching: boolean;
  newsItems: NewsItem[];
  onNewsClick: (newsId: string) => void;
  activeNewsItem: string | null;
  searchResults: NewsItem[];
}

export const NewsTab: React.FC<NewsTabProps> = ({
  searchQuery,
  onSearch,
  isSearching,
  newsItems,
  onNewsClick,
  activeNewsItem,
  searchResults,
}) => {
  if (activeNewsItem) {
    const item = newsItems.find(n => n.id === activeNewsItem);
    if (!item) return null;

    return (
      <div className="flex flex-col h-full">
        <div className="relative bg-gradient-to-b from-black via-black to-white text-white p-6">
          <button
            onClick={() => onNewsClick('')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="text-[14px]">Back to news</span>
          </button>
          <h1 className="text-[24px] font-semibold leading-tight mb-2">{item.title}</h1>
          <div className="flex items-center gap-2 text-white/60 text-[14px]">
            <span>{item.category}</span>
            <span>•</span>
            <span>{item.date.toLocaleDateString(undefined, { 
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none">
            {item.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative bg-gradient-to-b from-black via-black to-white text-white p-6 pb-12">
        <div className="pt-8 pb-4">
          <h1 className="text-[28px] font-semibold leading-tight mb-2">Product News</h1>
          <p className="text-[15px] text-white/80">
            Stay updated with the latest features and improvements
          </p>
        </div>

        <div className="relative mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search updates..."
            className="w-full h-11 bg-white text-gray-900 placeholder-gray-500 rounded-xl py-2.5 pl-11 pr-4 outline-none transition-all text-[15px] shadow-md"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto -mt-6">
        <div className="p-6">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSkeleton />
            </div>
          ) : searchQuery ? (
            <div className="space-y-4">
              <h2 className="text-[16px] font-semibold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNewsClick(item.id)}
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
                  onClick={() => onNewsClick(item.id)}
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
    </div>
  );
}; 