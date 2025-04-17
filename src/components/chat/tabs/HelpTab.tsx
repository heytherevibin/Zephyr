import React from 'react';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import type { HelpArticle } from '../types';
import { LoadingSkeleton } from '../LoadingSkeleton';

interface HelpTabProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  isSearching: boolean;
  helpArticles: HelpArticle[];
  onArticleClick: (articleId: string) => void;
  activeArticle: string | null;
  searchResults: HelpArticle[];
}

export const HelpTab: React.FC<HelpTabProps> = ({
  searchQuery,
  onSearch,
  isSearching,
  helpArticles,
  onArticleClick,
  activeArticle,
  searchResults,
}) => {
  const categories = ['Getting Started', 'Account & Billing', 'Features', 'Troubleshooting'];

  if (activeArticle) {
    const article = helpArticles.find(a => a.id === activeArticle);
    if (!article) return null;

    return (
      <div className="flex flex-col h-full">
        <div className="relative bg-gradient-to-b from-black via-black to-white text-white p-6">
          <button
            onClick={() => onArticleClick('')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="text-[14px]">Back to articles</span>
          </button>
          <h1 className="text-[24px] font-semibold leading-tight mb-2">{article.title}</h1>
          <div className="flex items-center gap-2 text-white/60 text-[14px]">
            <span>{article.category}</span>
            <span>•</span>
            <span>{article.views} views</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none">
            {article.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative bg-gradient-to-b from-black via-black to-white text-white p-6 pb-12">
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
            onChange={(e) => onSearch(e.target.value)}
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
              <LoadingSkeleton />
            </div>
          ) : searchQuery ? (
            <div className="space-y-4">
              <h2 className="text-[16px] font-semibold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
              {searchResults.map((article) => (
                <button
                  key={article.id}
                  onClick={() => onArticleClick(article.id)}
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
                  {categories.map((category) => (
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
                      onClick={() => onArticleClick(article.id)}
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
}; 