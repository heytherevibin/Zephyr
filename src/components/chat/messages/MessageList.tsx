import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Smile, Paperclip, X, Check, CheckCheck } from 'lucide-react';
import type { Message, Reaction } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  onReaction: (messageId: string, reaction: Reaction) => void;
  onRemoveReaction: (messageId: string, reactionId: string) => void;
  onAttachmentClick: (attachmentId: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  onReaction,
  onRemoveReaction,
  onAttachmentClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const renderReactions = (message: Message) => {
    if (!message.reactions?.length) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {message.reactions.map((reaction) => (
          <button
            key={reaction.id}
            onClick={() => onRemoveReaction(message.id, reaction.id)}
            className="group flex items-center gap-1 px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition-colors"
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.count}</span>
            <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    );
  };

  const renderAttachments = (message: Message) => {
    if (!message.attachments?.length) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {message.attachments.map((attachment) => (
          <button
            key={attachment.id}
            onClick={() => onAttachmentClick(attachment.id)}
            className="group flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
            <span className="max-w-[200px] truncate">{attachment.name}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderMessageGroup = (group: Message[]) => {
    const firstMessage = group[0];
    const isUser = firstMessage.sender === 'user';

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-fit max-w-[85%]`}>
          {!isUser && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">AI</span>
              </div>
              <span className="text-xs text-gray-500">Assistant</span>
            </div>
          )}
          <div className="space-y-2 w-full">
            {group.map((message) => (
              <div key={message.id} className="flex flex-col w-full">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`inline-block px-5 py-3.5 rounded-2xl ${
                    isUser
                      ? 'bg-black text-[#FFFFFF] rounded-br-lg ml-auto'
                      : 'bg-gray-100 text-gray-900 rounded-bl-lg mr-auto'
                  }`}
                >
                  <div className={`prose prose-sm max-w-none break-words leading-relaxed flex items-center ${
                    isUser ? 'text-[#FFFFFF]' : 'text-gray-900'
                  }`}>
                    <span className="inline-block">{message.text}</span>
                  </div>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2">
                      {renderAttachments(message)}
                    </div>
                  )}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="mt-2">
                      {renderReactions(message)}
                    </div>
                  )}
                </motion.div>
                <div 
                  className={`flex items-center gap-1.5 mt-1.5 text-[11px] ${
                    isUser ? 'justify-end mr-1' : 'justify-start ml-1'
                  }`}
                >
                  <span className="text-gray-500">
                    {formatTimeAgo(message.timestamp)}
                  </span>
                  {isUser && message.status && (
                    <div className="flex items-center">
                      {message.status === 'sending' && (
                        <div className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                      )}
                      {message.status === 'sent' && (
                        <Check className="w-3 h-3 text-gray-400" />
                      )}
                      {message.status === 'delivered' && (
                        <CheckCheck className="w-3 h-3 text-gray-400" />
                      )}
                      {message.status === 'read' && (
                        <CheckCheck className="w-3 h-3 text-black" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const groupMessages = (messages: Message[]) => {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [];

    messages.forEach((message, index) => {
      if (index === 0) {
        currentGroup.push(message);
        return;
      }

      const prevMessage = messages[index - 1];
      const timeDiff = message.timestamp.getTime() - prevMessage.timestamp.getTime();
      const isSameSender = message.sender === prevMessage.sender;
      const isWithinTimeLimit = timeDiff < 5 * 60 * 1000; // 5 minutes

      if (isSameSender && isWithinTimeLimit) {
        currentGroup.push(message);
      } else {
        groups.push([...currentGroup]);
        currentGroup = [message];
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const messageGroups = groupMessages(messages);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        <AnimatePresence>
          {messageGroups.map((group) => (
            <div key={group[0].id}>
              {renderMessageGroup(group)}
            </div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2.5 text-gray-500 pl-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-medium">AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">Assistant is typing</span>
              <div className="flex gap-1">
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-1 h-1 bg-gray-500 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-1 h-1 bg-gray-500 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-1 h-1 bg-gray-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}; 