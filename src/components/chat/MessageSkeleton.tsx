import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

interface MessageSkeletonProps {
  count?: number;
  className?: string;
}

export const MessageSkeleton: React.FC<MessageSkeletonProps> = ({
  count = 1,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-start space-x-3">
          <LoadingSkeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-1/4" />
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}; 