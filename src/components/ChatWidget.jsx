import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Maximize2, Smile, PaperclipIcon, Send, Home, MessageSquare, HelpCircle, Newspaper, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper for generating unique IDs
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Local storage key for message persistence
const STORAGE_KEY = 'zephyr_chat_messages';

export const ChatWidget = ({
  position = 'bottom-right',
  offset = 20,
  headerText = 'Fin',
  soundEnabled = false,
  onMessageSend = null,
  onClose = null,
  onOpen = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [inputText, setInputText] = useState('');

  // Bot name consistency
  const botName = headerText || 'Fin';

  const [messages, setMessages] = useState(() => {
    // Try to load messages from localStorage on initial render
    if (typeof window !== 'undefined') {
      try {
        const savedMessages = localStorage.getItem(STORAGE_KEY);
        if (savedMessages) {
          return JSON.parse(savedMessages);
        }
      } catch (error) {
        console.error('Failed to load messages from localStorage:', error);
      }
    }
    
    // Default initial messages
    return [
      {
        id: 1,
        text: "Hi there, welcome to Intercom 👋",
        isBot: true,
        sender: botName,
        role: "AI Agent",
      },
      {
        id: 2,
        text: "You are now speaking with Fin AI Agent. I can do much more than chatbots you've seen before. Tell me as much as you can about your question and I'll do my best to help you in an instant.",
        isBot: true,
        sender: botName,
        role: "AI Agent",
      }
    ];
  });

  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Sound effects
  const messageSoundRef = useRef(null);

  // Initialize sounds
  useEffect(() => {
    if (typeof window !== 'undefined' && soundEnabled) {
      messageSoundRef.current = new Audio('/message.mp3');
    }
  }, [soundEnabled]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      // Add a small delay to ensure DOM updates are complete before scrolling
      setTimeout(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [messages]);

  // Also scroll to bottom when the chat is opened
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }, 300);
    }
  }, [isOpen]);

  // Handle mobile full screen mode
  useEffect(() => {
    const handleViewportChange = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < 640;

        if (isOpen && isMobile) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    };

    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [isOpen]);

  // Add escape key handler for closing the chat
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save messages to localStorage:', error);
      }
    }
  }, [messages]);

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      // Opening chat
      if (onOpen) onOpen();

      // Close any open menus
      setShowEmoji(false);
    } else {
      // Closing chat
      if (onClose) onClose();
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowEmoji(false);

    if (onMessageSend) {
      onMessageSend(userMessage);
    }

    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: "Thank you for your message. This is an automated response from the AI agent.",
        isBot: true,
        sender: botName,
        role: "AI Agent",
      };

      setMessages(prev => [...prev, botMessage]);

      // Play message sound if enabled
      if (soundEnabled && messageSoundRef.current) {
        messageSoundRef.current.play().catch(e => console.error('Failed to play message sound:', e));
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload
      console.log("File selected:", file.name);

      // Reset file input
      e.target.value = null;
    }
  };

  // Calculate position styles with additional bottom offset for close button
  const positionStyles = {
    'bottom-right': { bottom: offset, right: offset },
    'bottom-left': { bottom: offset, left: offset },
    'top-right': { top: offset, right: offset },
    'top-left': { top: offset, left: offset },
  };

  // Close button position should match the launcher button
  const closeButtonPosition = {
    'bottom-right': { bottom: offset, right: offset },
    'bottom-left': { bottom: offset, left: offset },
    'top-right': { top: offset, right: offset },
    'top-left': { top: offset, left: offset },
  };

  // Logo component
  const Logo = () => (
    <div className="w-5 h-5 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
  );

  // Add responsive viewport detection
  const [viewportSize, setViewportSize] = useState('desktop');

  // Handle viewport detection
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 480) {
          setViewportSize('mobile');
        } else if (window.innerWidth < 768) {
          setViewportSize('tablet');
        } else {
          setViewportSize('desktop');
        }
      }
    };

    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate widget dimensions with better responsive handling
  const getWidgetDimensions = () => {
    // Mobile: full screen
    if (viewportSize === 'mobile') {
      return {
        position: 'fixed',
        width: '100%',
        height: '100%',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        borderRadius: 0,
        zIndex: 9999,
        maxWidth: '100vw',
        maxHeight: '100vh',
        overflow: 'hidden'
      };
    }

    // Tablet: almost full height with margins
    else if (viewportSize === 'tablet') {
      return {
        position: 'fixed',
        width: 'calc(100% - 40px)',
        height: 'calc(100% - 100px)',
        maxHeight: '700px',
        maxWidth: '600px',
        bottom: '60px',
        right: '20px',
        borderRadius: '12px',
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      };
    }

    // Desktop: standard fixed size
    else {
      return {
        position: 'fixed',
        width: '400px',
        height: '704px',
        maxHeight: 'calc(100vh - 120px)',
        bottom: '80px',
        right: '20px',
        borderRadius: '12px',
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      };
    }
  };

  // Chat button responsiveness
  const getChatButtonStyles = () => {
    const baseStyles = {
      ...positionStyles[position],
      zIndex: 9999,
    };

    // For mobile, ensure the button is positioned properly
    if (viewportSize === 'mobile') {
      return {
        ...baseStyles,
        bottom: offset,
        right: offset,
      };
    }

    return baseStyles;
  };

  return (
    <div className="fixed z-[9999]" style={positionStyles[position]}>
      {/* Hidden file input for file attachments */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      
      {/* Chat button when closed */}
      <AnimatePresence initial={false} mode="wait">
        {!isOpen && (
          <motion.button
            key="chat-button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={toggleChat}
            className="fixed bg-black text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 z-[9999]"
            style={{
              ...getChatButtonStyles(),
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 10,
              duration: 0.15
            }}
            aria-label="Open chat"
          >
            <Logo />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat container when open */}
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            key="chat-container"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              duration: 0.3
            }}
            className={`fixed overflow-hidden bg-white shadow-2xl flex flex-col ${
              viewportSize === 'mobile' ? 'rounded-none' : 'rounded-xl'
            }`}
            style={getWidgetDimensions()}
          >
            {/* Header */}
            <div className="flex items-center py-3 px-4 border-b border-gray-100">
              <button 
                onClick={toggleChat}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="Close chat"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex items-center ml-3">
                <Logo />
                <div className="ml-3">
                  <span className="font-semibold text-gray-900">{headerText}</span>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
              </div>
              <button 
                className="ml-auto p-1.5 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="Maximize chat"
              >
                <Maximize2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#CBD5E0 #EDF2F7',
                height: viewportSize === 'mobile' ? 'calc(100vh - 130px)' : 'auto',
                maxHeight: '100%'
              }}
            >
              {messages.map((message, index) => (
                <motion.div 
                  key={message.id} 
                  className={`${message.isBot ? '' : 'flex justify-end'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative group">
                    <div 
                      className={`inline-block max-w-[85%] ${viewportSize === 'mobile' ? 'max-w-[90%]' : 'max-w-[85%]'} rounded-2xl relative ${
                        message.isBot 
                          ? 'bg-white shadow-sm border border-gray-100' 
                          : 'bg-black text-white'
                      }`}
                      style={{
                        borderTopLeftRadius: message.isBot ? '4px' : undefined,
                        borderTopRightRadius: !message.isBot ? '4px' : undefined
                      }}
                    >
                      {message.isBot && message.sender && (
                        <div className="flex items-center px-4 pt-3 pb-2">
                          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
                            <div className="w-3.5 h-3.5 bg-white rounded-sm"></div>
                          </div>
                          <div className="ml-2">
                            <div className="font-semibold text-sm text-gray-900">{botName}</div>
                            <div className="text-[10px] text-gray-500">{message.role}</div>
                          </div>
                        </div>
                      )}
                      <div className={`px-4 ${message.isBot && message.sender ? 'pt-1' : 'pt-3'} pb-3`}>
                        <p className={`text-[15px] leading-relaxed ${viewportSize === 'mobile' ? 'text-sm' : 'text-[15px]'}`}>{message.text}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time indicator - Only show for first message or with gap */}
                  {index === 0 || (index > 0 && messages[index-1].isBot !== message.isBot) ? (
                    <div className={`text-xs text-gray-400 mt-1 ${!message.isBot ? 'text-right mr-1' : 'ml-1'}`}>
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100">
              {showEmoji && (
                <div className="p-3 border-b border-gray-100 bg-white">
                  <div className="flex flex-col">
                    <div className="relative mb-3">
                      <input
                        type="text"
                        placeholder="Search emoji..."
                        className="w-full p-2 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {"👍👎🎉😮😊😂❤️😍🤔😅".split('').map((emoji, i) => (
                        <button
                          key={i}
                          onClick={() => setInputText(prev => prev + emoji)}
                          className="text-2xl hover:bg-gray-100 p-2 rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-3">
                <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    className={`flex-1 bg-transparent py-2.5 ${viewportSize === 'mobile' ? 'px-3' : 'px-4'} outline-none ${viewportSize === 'mobile' ? 'text-sm' : 'text-[15px]'} text-gray-800`}
                  />
                  <div className={`flex items-center ${viewportSize === 'mobile' ? 'pr-0.5' : 'pr-1'}`}>
                    {viewportSize !== 'mobile' && (
                      <button 
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Insert emoji"
                      >
                        <Smile className="w-5 h-5 text-gray-500" />
                      </button>
                    )}
                    <button 
                      onClick={handleAttachFile}
                      className={`${viewportSize === 'mobile' ? 'p-1.5' : 'p-2'} hover:bg-gray-200 rounded-full transition-colors`}
                      aria-label="Attach file"
                    >
                      <PaperclipIcon className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} text-gray-500`} />
                    </button>
                    <button 
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      className={`${viewportSize === 'mobile' ? 'p-1.5' : 'p-2'} rounded-full transition-colors ${
                        inputText.trim() 
                          ? 'hover:bg-gray-200 text-black' 
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      aria-label="Send message"
                    >
                      <Send className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className={`grid grid-cols-4 border-t border-gray-100 ${viewportSize === 'mobile' ? 'py-1' : ''}`}>
              {[
                { icon: <Home className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />, label: "Home" },
                { icon: <MessageSquare className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />, label: "Messages", active: true },
                { icon: <HelpCircle className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />, label: "Help" },
                { icon: <Newspaper className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />, label: "News" }
              ].map((item, i) => (
                <button 
                  key={i} 
                  className={`flex flex-col items-center ${viewportSize === 'mobile' ? 'py-2' : 'py-3'} hover:bg-gray-50 transition-colors ${
                    item.active ? 'border-t-2 border-black -mt-[1px]' : ''
                  }`}
                >
                  <div className={item.active ? 'text-black' : 'text-gray-500'}>
                    {item.icon}
                  </div>
                  <span className={`${viewportSize === 'mobile' ? 'text-[10px]' : 'text-xs'} mt-1 ${item.active ? 'font-medium text-black' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button - moved outside chat container */}
      <AnimatePresence initial={false}>
        {isOpen && viewportSize !== 'mobile' && (
          <motion.button
            onClick={toggleChat}
            key="close-button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 10,
              duration: 0.15
            }}
            className="fixed bg-black text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 z-[10000]"
            style={{
              ...closeButtonPosition[position],
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
            }}
            aria-label="Close chat"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;