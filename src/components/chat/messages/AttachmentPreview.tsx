import React from 'react';
import { X } from 'lucide-react';
import type { FileAttachment } from '../types';

interface AttachmentPreviewProps {
  attachments: FileAttachment[];
  onRemove: (id: string) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  onRemove,
}) => {
  return (
    <div className="border-t p-2 space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between bg-gray-100 rounded p-2"
        >
          <div className="flex items-center space-x-2">
            {attachment.previewUrl && attachment.type.startsWith('image/') ? (
              <img
                src={attachment.previewUrl}
                alt={attachment.name}
                className="w-8 h-8 object-cover rounded"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
                {attachment.type.split('/')[1]?.toUpperCase() || 'FILE'}
              </div>
            )}
            <div>
              <div className="text-sm font-medium truncate max-w-[200px]">
                {attachment.name}
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(attachment.size / 1024)}KB
              </div>
            </div>
          </div>
          <button
            onClick={() => onRemove(attachment.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}; 