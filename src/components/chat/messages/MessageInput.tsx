import React, { useRef, useEffect } from 'react';
import { Smile, Paperclip, ArrowUp } from 'lucide-react';
import type { FileAttachment, QuickReply, SavedResponse } from '../types';
import { AttachmentPreview } from './AttachmentPreview';

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onFileSelect: (files: FileList) => void;
  onQuickReply: (reply: QuickReply) => void;
  onSavedResponse: (response: SavedResponse) => void;
  quickReplies?: QuickReply[];
  savedResponses?: SavedResponse[];
  attachments?: FileAttachment[];
  disabled?: boolean;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  placeholder?: string;
  onRemoveAttachment: (id: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  onFileSelect,
  onQuickReply,
  onSavedResponse,
  quickReplies = [],
  savedResponses = [],
  attachments = [],
  disabled = false,
  fileInputRef,
  placeholder = 'Type a message...',
  onRemoveAttachment,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleFileClick = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="border-t border-gray-200 p-4">
      {quickReplies.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => onQuickReply(reply)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {reply.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {savedResponses.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {savedResponses.map((response) => (
              <button
                key={response.id}
                onClick={() => onSavedResponse(response)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {response.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={placeholder}
            className="w-full min-h-[40px] max-h-[120px] p-3 pr-12 bg-gray-50 rounded-xl resize-none outline-none transition-colors focus:bg-gray-100"
            disabled={disabled}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              onClick={handleFileClick}
              className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={disabled}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && onFileSelect(e.target.files)}
        className="hidden"
        multiple
      />

      {attachments.length > 0 && (
        <AttachmentPreview
          attachments={attachments}
          onRemove={onRemoveAttachment}
        />
      )}
    </div>
  );
}; 