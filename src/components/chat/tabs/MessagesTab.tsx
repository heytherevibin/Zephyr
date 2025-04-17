import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MessageSquareOff, ArrowLeft, X, Smile, Paperclip, Image, ArrowUp, Clock, Check, CheckCheck, ThumbsUp, Reply, Bold, Italic, Underline, MessageSquarePlus } from 'lucide-react';
import { Message, FileAttachment, Reaction, Conversation } from '../types';
import { TypingIndicator } from '../TypingIndicator';
import { MessageList } from '../messages/MessageList';
import { MessageInput } from '../messages/MessageInput';
import { AttachmentPreview } from '../messages/AttachmentPreview';
import { CHAT_CONSTANTS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface MessagesTabProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string | { format: string; content: string }) => void;
  onFileUpload: (file: File) => void;
  onReaction: (messageId: string, reaction: Reaction) => void;
  onAttachmentClick: (attachmentId: string) => void;
  onRemoveAttachment: (id: string) => void;
  onRemoveReaction: (messageId: string, reactionId: string) => void;
  quickReplies?: Array<{ id: string; text: string }>;
  savedResponses?: Array<{ id: string; title: string; content: string }>;
  recentConversations?: Conversation[];
  onConversationSelect?: (conversationId: string) => void;
  onClose?: () => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  messages,
  isTyping,
  onSendMessage,
  onFileUpload,
  onReaction,
  onAttachmentClick,
  onRemoveAttachment,
  onRemoveReaction,
  quickReplies = [],
  savedResponses = [],
  recentConversations = [],
  onConversationSelect,
  onClose
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showSavedResponses, setShowSavedResponses] = useState(false);
  const [isRichTextEnabled, setIsRichTextEnabled] = useState(false);
  const [richTextFormat, setRichTextFormat] = useState<'bold' | 'italic' | 'underline' | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, inputText]);

  // Typing indicator timeout
  useEffect(() => {
    let typingTimer: NodeJS.Timeout | null = null;
    
    if (isTyping) {
      typingTimer = setTimeout(() => {
        // Reset typing indicator after timeout
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, CHAT_CONSTANTS.UI.TYPING_TIMEOUT);
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [isTyping]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() && selectedFiles.length === 0) return;
    
    // Create message with rich text if enabled
    const messageText = isRichTextEnabled && richTextFormat
      ? { format: richTextFormat, content: inputText }
      : inputText;
      
    onSendMessage(messageText);
    setInputText('');
    setSelectedFiles([]);
    setIsRichTextEnabled(false);
    setRichTextFormat(null);
    
    // Reset textarea height
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = '52px';
    }
  }, [inputText, selectedFiles, onSendMessage, isRichTextEnabled, richTextFormat]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file size and type
      if (file.size > CHAT_CONSTANTS.UI.MAX_FILE_SIZE) {
        alert('File size exceeds 10MB limit');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'] as const;
      if (!allowedTypes.includes(file.type as typeof allowedTypes[number])) {
        alert('File type not supported');
        return;
      }
      
      onFileUpload(file);
      
      // Create preview URL for images
      const previewUrl = file.type.startsWith('image/') 
        ? URL.createObjectURL(file)
        : undefined;

      const newFile: FileAttachment = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        previewUrl,
        size: file.size,
        status: 'uploaded'
      };
      
      setSelectedFiles(prev => [...prev, newFile]);
    }
  }, [onFileUpload]);

  const handleQuickReplyClick = (reply: { id: string; text: string }) => {
    setInputText(reply.text);
    setShowQuickReplies(false);
  };

  const handleSavedResponseClick = (response: { id: string; title: string; content: string }) => {
    setInputText(response.content);
    setShowSavedResponses(false);
  };

  const handleRichTextToggle = (format: 'bold' | 'italic' | 'underline') => {
    setIsRichTextEnabled(true);
    setRichTextFormat(format);
  };

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId);
    onConversationSelect?.(conversationId);
  };

  const handleNewConversation = () => {
    setActiveConversation(null);
    onConversationSelect?.('');
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.url) URL.revokeObjectURL(file.url);
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [selectedFiles]);

  return (
    <motion.div 
      className="flex flex-col h-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: CHAT_CONSTANTS.ANIMATION.DURATION }}
    >
      {/* Chat Header */}
      <div className="flex-none bg-white text-gray-900 p-5 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {activeConversation ? (
              <button
                onClick={() => setActiveConversation(null)}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back to conversations"
              >
                <ArrowLeft size={22} className="text-gray-700" />
              </button>
            ) : null}
            <h2 className="text-lg font-medium text-gray-900">
              {activeConversation ? 'Chat' : 'Messages'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X size={22} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide pb-32"
      >
        {activeConversation ? (
          <MessageList
            messages={messages}
            isTyping={isTyping}
            onReaction={onReaction}
            onRemoveReaction={onRemoveReaction}
            onAttachmentClick={onAttachmentClick}
          />
        ) : (
          <div className="space-y-4 p-4">
            {/* Recent Conversations */}
            {recentConversations.length > 0 && (
              <div className="space-y-2">
                {recentConversations
                  .map(conv => ({
                    ...conv,
                    timestamp: new Date(conv.timestamp)
                  }))
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map(conversation => (
                    <button
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation.id)}
                      className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl text-left transition-all group relative"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0">
                          {conversation.avatar ? (
                            <img src={conversation.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-medium text-[15px]">
                              {conversation.title.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-[15px] text-gray-900">{conversation.title}</p>
                            {conversation.unread && (
                              <span className="w-2 h-2 bg-black rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[14px] text-gray-600 line-clamp-2">{conversation.lastMessage}</p>
                          <div className="flex items-center gap-2 mt-2 text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[13px]">
                              {new Date(conversation.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            )}

            {/* New Conversation Button */}
            <button
              onClick={handleNewConversation}
              className="w-full bg-black hover:bg-black/90 text-white p-4 rounded-2xl text-left transition-all group relative flex items-center justify-center gap-2"
            >
              <MessageSquarePlus size={20} />
              <span className="font-medium">Ask a question</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Area - Fixed */}
      {activeConversation && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="p-4">
            {/* Attachment Previews */}
            {selectedFiles.length > 0 && (
              <div className="mb-3">
                <AttachmentPreview
                  attachments={selectedFiles}
                  onRemove={onRemoveAttachment}
                />
              </div>
            )}

            {/* Quick Replies */}
            {showQuickReplies && quickReplies.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {quickReplies.map(reply => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReplyClick(reply)}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            )}

            {/* Saved Responses */}
            {showSavedResponses && savedResponses.length > 0 && (
              <div className="mb-3 space-y-2">
                {savedResponses.map(response => (
                  <button
                    key={response.id}
                    onClick={() => handleSavedResponseClick(response)}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <div className="font-medium text-sm">{response.title}</div>
                    <div className="text-sm text-gray-500 truncate">{response.content}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Rich Text Formatting */}
            {isRichTextEnabled && (
              <div className="mb-2 flex gap-2">
                <button
                  onClick={() => handleRichTextToggle('bold')}
                  className={`p-1.5 rounded hover:bg-gray-100 ${richTextFormat === 'bold' ? 'bg-gray-100' : ''}`}
                >
                  <Bold size={16} />
                </button>
                <button
                  onClick={() => handleRichTextToggle('italic')}
                  className={`p-1.5 rounded hover:bg-gray-100 ${richTextFormat === 'italic' ? 'bg-gray-100' : ''}`}
                >
                  <Italic size={16} />
                </button>
                <button
                  onClick={() => handleRichTextToggle('underline')}
                  className={`p-1.5 rounded hover:bg-gray-100 ${richTextFormat === 'underline' ? 'bg-gray-100' : ''}`}
                >
                  <Underline size={16} />
                </button>
              </div>
            )}

            {/* Message Input */}
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                className="w-full bg-[#F8F9FB] rounded-[30px] py-3 sm:py-3.5 pl-4 pr-[120px] outline-none text-[14px] sm:text-[15px] placeholder-gray-400 text-gray-900 resize-none max-h-[150px] min-h-[52px] transition-all duration-200"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E1 transparent'
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1">
                {!inputText.trim() ? (
                  <>
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Smile size={20} />
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Image size={20} />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleSendMessage}
                    className="p-2 text-white hover:text-white/90 transition-colors bg-black rounded-full hover:bg-black/90 flex items-center justify-center w-10 h-10"
                  >
                    <ArrowUp size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept="image/*,application/pdf"
      />
    </motion.div>
  );
}; 