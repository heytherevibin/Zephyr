import React from 'react';

export const TypingIndicator: React.FC = () => (
  <div className="flex items-end gap-1 px-4 py-3 bg-gray-100 rounded-2xl w-fit">
    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
); 