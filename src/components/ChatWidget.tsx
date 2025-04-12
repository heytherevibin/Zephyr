import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Maximize2, 
  Smile, 
  Paperclip as PaperclipIcon, 
  Send,
  LayoutDashboard,
  MessageSquareText,
  HelpCircle,  // Changed from Help to HelpCircle which exists in Lucide
  BellRing,
  ImagePlus,
  ChevronDown,
  ArrowUp,
  // Filled versions
  MessageCircleDashed,
  BellOff, // Changed from BellRingFill to BellOff 
  Headphones,
  LayoutPanelTop
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define types for the component props and state
type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
type ViewportSize = 'mobile' | 'tablet' | 'desktop';

// Helper function to check if viewport is mobile
const isMobileView = (size: ViewportSize): boolean => size === 'mobile';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  sender?: string;
  role?: string;
  timestamp?: Date;
  status?: 'sent' | 'delivered' | 'read';
  audioUrl?: string;
  attachment?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  };
}

// Add conversation item interface
interface ConversationItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  isBot?: boolean;
}

interface UserIdentity {
  id: string;
  name?: string;
  email?: string;
}

// Add new interface properties for advanced features
interface ChatWidgetProps {
  position?: Position;
  offset?: number;
  triggerButtonSize?: number;
  headerText?: string;
  primaryColor?: string;
  textColor?: string;
  showNotificationBadge?: boolean;
  notificationCount?: number;
  bubbleAnimation?: boolean;
  mobileFullScreen?: boolean;
  soundEnabled?: boolean;
  darkMode?: boolean;
  enableDepartmentRouting?: boolean;
  enableAnalytics?: boolean;
  enableCannedResponses?: boolean;
  enableMultilingualSupport?: boolean;
  userIdentity?: UserIdentity;
  apiEndpoint?: string;
  onMessageSend?: (message: Message) => void;
  onClose?: () => void;
  onOpen?: () => void;
  showSatisfactionSurvey?: boolean;
  enableTypingIndicator?: boolean;
  enableReadReceipts?: boolean;
  enableUserProfiles?: boolean;
  enableVoiceMessages?: boolean;
  enableTranscriptDownload?: boolean;
  enableThemeCustomization?: boolean;
  customTheme?: ChatTheme;
  enableMessageSearch?: boolean;
  showAgentTypingIndicator?: boolean;
  maxAttachmentSize?: number;
  userSettings?: UserSettings;
  onFileUpload?: (file: File) => Promise<string>;
  onThemeChange?: (theme: ChatTheme) => void;
}

// Add interfaces for new features
interface ChatTheme {
  primaryColor: string;
  secondaryColor?: string;
  textColor: string;
  fontFamily?: string;
  fontSize?: string;
  messageRadius?: string;
  darkMode: boolean;
}

interface UserSettings {
  notificationsEnabled?: boolean;
  soundEnabled?: boolean;
  language?: string;
  timezone?: string;
  messageFontSize?: 'small' | 'medium' | 'large';
}

interface TypingIndicator {
  isTyping: boolean;
  user: string;
  timestamp: Date;
}

// Helper for generating unique IDs
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Local storage key for message persistence
const STORAGE_KEY = 'zephyr_chat_messages';
// Maximum number of messages to store in localStorage
const MAX_STORED_MESSAGES = 50;

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = 'bottom-right',
  offset = 20,
  triggerButtonSize = 48,
  headerText = 'Zephyr',
  primaryColor = 'bg-black',
  textColor = 'text-white',
  soundEnabled = false,
  showNotificationBadge = false,
  notificationCount = 0,
  bubbleAnimation = true,
  mobileFullScreen = true,
  darkMode = false,
  enableDepartmentRouting = false,
  enableAnalytics = false,
  enableCannedResponses = false,
  enableMultilingualSupport = false,
  userIdentity,
  apiEndpoint,
  onMessageSend = null,
  onClose = null,
  onOpen = null,
  showSatisfactionSurvey = false,
  enableTypingIndicator = false,
  enableReadReceipts = false,
  enableUserProfiles = false,
  enableVoiceMessages = false,
  enableTranscriptDownload = false,
  enableThemeCustomization = false,
  customTheme,
  enableMessageSearch = false,
  showAgentTypingIndicator = false,
  maxAttachmentSize = 10,
  userSettings,
  onFileUpload,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isAttachingFile, setIsAttachingFile] = useState<boolean>(false);
  const [currentDepartment, setCurrentDepartment] = useState<string | null>(null);

  // Add active tab state for navigation
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'help' | 'news'>('messages');

  // Add GIF picker state
  const [showGifPicker, setShowGifPicker] = useState<boolean>(false);
  const [gifs, setGifs] = useState<Array<{ id: string; url: string }>>([]);
  const [gifSearchQuery, setGifSearchQuery] = useState<string>('');

  // Add conversations list state
  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      id: 'conv-1',
      title: 'General Support',
      lastMessage: 'How may I assist you today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      unread: false,
      isBot: true
    },
    {
      id: 'conv-2',
      title: 'Account Help',
      lastMessage: 'Your account has been updated successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unread: true,
      isBot: true
    },
    {
      id: 'conv-3',
      title: 'Billing Question',
      lastMessage: 'The refund has been processed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unread: false,
      isBot: false
    }
  ]);
  
  // Active conversation management
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isInConversationList, setIsInConversationList] = useState<boolean>(true);
  const [isLoadingConversation, setIsLoadingConversation] = useState<boolean>(false);

  // Use the actual product name
  const botName = headerText || 'Zephyr';

  const [messages, setMessages] = useState<Message[]>(() => {
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
        text: `Hi there, welcome to Zephyr Chat 👋`,
        isBot: true,
        sender: botName,
        role: "AI Agent",
        timestamp: new Date(),
        status: 'read'
      },
      {
        id: 2,
        text: `You are now speaking with ${botName} AI Agent. I can help you with your questions. How may I assist you today?`,
        isBot: true,
        sender: botName,
        role: "AI Agent",
        timestamp: new Date(),
        status: 'read'
      }
    ];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sound effects
  const messageSoundRef = useRef<HTMLAudioElement | null>(null);

  // Voice message recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Message search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);

  // Typing indicator state
  const [typingIndicator, setTypingIndicator] = useState<TypingIndicator | null>(null);

  // Transcript state
  const [showTranscriptOptions, setShowTranscriptOptions] = useState<boolean>(false);

  // File attachment handling
  const [attachments, setAttachments] = useState<Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    progress: number;
  }>>([]);

  // AI suggestion state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState<boolean>(false);

  // Theme settings state for customization
  const [themeSettings, setThemeSettings] = useState<ChatTheme>({
    primaryColor: primaryColor || 'bg-black',
    textColor: textColor || 'text-white',
    darkMode: darkMode || false,
    fontSize: 'text-base',
    messageRadius: 'rounded-2xl'
  });

  // User settings panel state
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Enhanced animation variants with optimized timing for smoother transitions
  const chatButtonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        duration: 0.3
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    hover: { 
      scale: 1.1,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring", 
        stiffness: 400,
        damping: 10
      }
    }
  };

  const chatContainerVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.03, // Reduced stagger time for more synchronous appearance
        delayChildren: 0.1 // Add slight delay before starting children animations
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.98,
      transition: {
        duration: 0.2
      }
    }
  };

  const messageContainerVariants = {
    initial: { opacity: 0, y: 8 }, // Reduced distance for subtler animation
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        duration: 0.2 // Fixed duration ensures consistent timing
      }
    }
  };

  // Add GIF search function using GIPHY API
  const searchGifs = async (query: string) => {
    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=YOUR_GIPHY_API_KEY&q=${query}&limit=15&rating=g`);
      const data = await response.json();
      setGifs(data.data.map((gif: any) => ({
        id: gif.id,
        url: gif.images.fixed_height.url
      })));
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  // Render theme settings panel
  const renderThemeSettings = () => {
    if (!showSettings) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`absolute bottom-20 right-4 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-4 w-72`}
      >
        <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Chat Settings</h3>
        
        {/* Theme selector */}
        <div className="mb-4">
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Theme</label>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setThemeSettings(prev => ({ ...prev, darkMode: false }));
                if (onThemeChange) onThemeChange({ ...themeSettings, darkMode: false });
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm ${!darkMode 
                ? 'bg-black text-white ring-2 ring-offset-2 ring-gray-800' 
                : 'bg-white text-black border border-gray-200'}`}
            >
              Light
            </button>
            <button
              onClick={() => {
                setThemeSettings(prev => ({ ...prev, darkMode: true }));
                if (onThemeChange) onThemeChange({ ...themeSettings, darkMode: true });
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm ${darkMode 
                ? 'bg-gray-700 text-white ring-2 ring-offset-2 ring-gray-500' 
                : 'bg-gray-800 text-white border border-gray-700'}`}
            >
              Dark
            </button>
          </div>
        </div>
        
        {/* Primary color selector */}
        <div className="mb-4">
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Primary Color</label>
          <div className="grid grid-cols-4 gap-2">
            {['bg-black', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 'bg-yellow-500', 'bg-indigo-600', 'bg-pink-600'].map(color => (
              <button
                key={color}
                onClick={() => {
                  setThemeSettings(prev => ({ ...prev, primaryColor: color }));
                  if (onThemeChange) onThemeChange({ ...themeSettings, primaryColor: color });
                }}
                className={`w-8 h-8 rounded-full ${color} ${themeSettings.primaryColor === color ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
                aria-label={`Select ${color.replace('bg-', '')} color theme`}
              />
            ))}
          </div>
        </div>
        
        {/* Font size selector */}
        <div className="mb-4">
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Message Text Size</label>
          <div className="flex space-x-2">
            {[
              { label: 'S', value: 'text-sm' },
              { label: 'M', value: 'text-base' },
              { label: 'L', value: 'text-lg' }
            ].map(size => (
              <button
                key={size.value}
                onClick={() => {
                  setThemeSettings(prev => ({ ...prev, fontSize: size.value }));
                  if (onThemeChange) onThemeChange({ ...themeSettings, fontSize: size.value });
                }}
                className={`flex-1 py-2 px-3 rounded-md text-sm ${themeSettings.fontSize === size.value 
                  ? darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black font-medium' 
                  : darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white text-gray-700 border border-gray-200'}`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Notification settings */}
        <div className="mb-4">
          <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <input
              type="checkbox"
              checked={userSettings?.soundEnabled || soundEnabled}
              onChange={(e) => {
                const isChecked = e.target.checked;
                // Update sound enabled setting through props callback
                if (userSettings && onThemeChange) {
                  // Only pass valid ChatTheme properties to onThemeChange
                  onThemeChange(themeSettings);
                  // Handle sound setting separately
                  if (typeof userSettings === 'object') {
                    userSettings.soundEnabled = isChecked;
                  }
                }
              }}
              className="rounded text-black focus:ring-0 h-4 w-4 mr-2"
            />
            <span className="text-sm">Sound notifications</span>
          </label>
        </div>
        
        <button
          onClick={() => setShowSettings(false)}
          className={`w-full py-2 px-3 rounded-md text-sm mt-2 ${darkMode 
            ? 'bg-gray-700 text-white hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} transition-colors`}
        >
          Close Settings
        </button>
      </motion.div>
    );
  };

  // Message rendering with consistent styling for both bot and user messages
  const renderMessage = (message: Message, index: number) => (
    <motion.div 
      key={message.id} 
      className={`flex w-full ${message.isBot ? '' : 'justify-end'} mb-3`}
      data-message-id={message.id}
      variants={messageContainerVariants}
      initial="initial"
      animate="animate"
      onAnimationComplete={() => {
        if (message.isBot) {
          announceMessage(message);
        }
      }}
    >
      <div className={`flex flex-col ${message.isBot ? '' : 'items-end'} max-w-[85%]`}>
        <div className="relative group w-full">
          <motion.div 
            className={`inline-block relative overflow-hidden w-full ${
              darkMode 
                ? 'bg-gray-700 text-white' 
                : 'bg-white text-gray-800 border border-gray-100'
            } ${themeSettings?.messageRadius || 'rounded-2xl'}`}
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              fontSize: '14px',
              lineHeight: 1.4,
              margin: '0px 0px 10px'
            }}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            whileHover={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
          >
            {message.sender && (
              <div className="flex items-center px-4 pt-2.5 pb-1.5">
                <div className={`w-5 h-5 rounded-full ${
                  message.isBot
                    ? darkMode ? 'bg-gray-600' : 'bg-blue-50'
                    : darkMode ? 'bg-gray-600' : 'bg-blue-50'
                } flex items-center justify-center`}>
                  <div className={`w-2.5 h-2.5 ${
                    message.isBot
                      ? darkMode ? 'bg-white' : 'bg-blue-500'
                      : darkMode ? 'bg-white' : 'bg-blue-500'
                  } rounded-sm`}></div>
                </div>
                <div className="ml-2">
                  <div className={`font-medium text-xs ${
                    message.isBot
                      ? darkMode ? 'text-white' : 'text-gray-900'
                      : darkMode ? 'text-white' : 'text-white'
                  }`}>{message.sender || (message.isBot ? botName : 'You')}</div>
                  <div className={`text-[9px] ${
                    message.isBot
                      ? darkMode ? 'text-gray-300' : 'text-gray-500'
                      : darkMode ? 'text-gray-200' : 'text-gray-200'
                  }`}>{message.role || (message.isBot ? "AI Agent" : "User")}</div>
                </div>
              </div>
            )}
            
            <div className={`px-4 ${message.sender ? 'pt-1' : 'pt-2.5'} pb-2.5`}>
              <p className={`leading-relaxed break-words ${
                themeSettings?.fontSize || (viewportSize === 'mobile' ? 'text-sm' : 'text-[14px]')
              }`}>{message.text}</p>
              
              {message.audioUrl && (
                <div className="mt-2 bg-opacity-5 bg-gray-500 rounded p-1.5">
                  <audio 
                    controls 
                    className="mt-0.5 w-full max-w-[200px] h-[32px]"
                    style={{
                      borderRadius: '6px',
                      filter: darkMode ? 'invert(0.85)' : 'none'
                    }}
                  >
                    <source src={message.audioUrl} type="audio/mp3" />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}
              
              {message.attachment && (
                <div className={`mt-2 flex items-center rounded p-2 ${
                  darkMode 
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-gray-50 border border-gray-100'
                }`}>
                  <div className={`p-1.5 mr-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
                    {getFileIcon(message.attachment.type)}
                  </div>
                  <a 
                    href={message.attachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`text-xs hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'} flex items-center`}
                  >
                    {truncateFilename(message.attachment.name, 20)}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} items-center mt-1 ${message.isBot ? 'text-left' : 'text-right'}`}>
          <span className="text-[8px] text-gray-400 mx-1">
            {message.timestamp 
              ? new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
              : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            }
          </span>
          {!message.isBot && message.status === 'sent' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          {!message.isBot && message.status === 'delivered' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
              <path d="M18 6L7 17L2 12"></path>
              <path d="M22 10L13 19L11 17"></path>
            </svg>
          )}
          {!message.isBot && message.status === 'read' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M18 6L7 17L2 12"></path>
              <path d="M22 10L13 19L11 17"></path>
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Helper function to truncate filenames
  const truncateFilename = (filename: string, maxLength: number): string => {
    if (filename.length <= maxLength) return filename;
    
    const extension = filename.split('.').pop() || '';
    const nameWithoutExtension = filename.substring(0, filename.length - extension.length - 1);
    
    const truncatedName = nameWithoutExtension.substring(0, maxLength - extension.length - 3);
    return `${truncatedName}...${extension ? `.${extension}` : ''}`;
  };

  // File type icon renderer
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      );
    }
  };

  // Message search component
  const renderSearch = () => {
    if (!isSearching) return null;
    
    return (
      <div className={`absolute top-14 left-0 right-0 z-10 ${darkMode ? 'bg-gray-700' : 'bg-white'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} p-2 flex items-center`}>
        <input
          id="chat-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            searchMessages(e.target.value);
          }}
          placeholder="Search messages..."
          className={`flex-1 ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-200'} border rounded-l-md px-3 py-1.5 text-sm focus:outline-none`}
          autoComplete="off"
        />
        <div className="flex">
          <button
            onClick={() => navigateSearchResults('prev')}
            disabled={searchResults.length === 0}
            className={`px-2 py-1.5 ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'} hover:opacity-90 disabled:opacity-50 text-sm`}
          >
            ↑
          </button>
          <button
            onClick={() => navigateSearchResults('next')}
            disabled={searchResults.length === 0}
            className={`px-2 py-1.5 ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'} hover:opacity-90 disabled:opacity-50 text-sm rounded-r-md`}
          >
            ↓
          </button>
          <button
            onClick={() => toggleSearch()}
            className={`ml-2 px-2 py-1.5 ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'} hover:opacity-90 text-sm rounded-md`}
          >
            ×
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className={`absolute top-full left-0 mt-1 px-3 py-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} shadow-lg`}>
            {currentSearchIndex + 1} of {searchResults.length} results
          </div>
        )}
      </div>
    );
  };

  // Render transcript download options
  const renderTranscriptOptions = () => {
    if (!showTranscriptOptions) return null;
    
    return (
      <div className={`absolute bottom-20 right-4 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-3 w-60`}>
        <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Download Transcript</h3>
        
        {['txt', 'json', 'html', 'csv'].map(format => (
          <button
            key={format}
            onClick={() => downloadTranscript(format as any)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm ${darkMode 
              ? 'hover:bg-gray-700 text-gray-200' 
              : 'hover:bg-gray-100 text-gray-800'} transition-colors mb-1`}
          >
            {format.toUpperCase()} Format
          </button>
        ))}
      </div>
    );
  };

  // Enhanced header with additional functionality
  const renderEnhancedHeader = () => (
    <div className={`flex items-center py-3 px-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b`}>
      {/* Only show back button when not in conversation list and there is an active conversation */}
      {!isInConversationList && activeConversationId && (
        <button 
          onClick={() => {
            setActiveConversationId(null);
            setIsInConversationList(true);
          }}
          className={`p-1.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-gray-600' : 'focus:ring-gray-200'}`}
          aria-label="Back to conversations"
        >
          <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
        </button>
      )}
      <div className={`flex items-center ${!isInConversationList && activeConversationId ? 'ml-3' : ''}`}>
        <Logo />
        <div className="ml-3">
          <span id="chat-heading" className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{headerText}</span>
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Online</span>
          </div>
        </div>
      </div>
      
      {/* Header actions */}
      <div className="ml-auto flex items-center space-x-1">
        {enableMessageSearch && (
          <button 
            onClick={toggleSearch}
            className={`p-1.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors focus:outline-none`}
            aria-label="Search messages"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        
        {enableTranscriptDownload && (
          <button 
            onClick={() => setShowTranscriptOptions(!showTranscriptOptions)}
            className={`p-1.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors focus:outline-none`}
            aria-label="Download transcript"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        )}
        
        {enableThemeCustomization && (
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors focus:outline-none`}
            aria-label="Chat settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  // Initialize sounds
  useEffect(() => {
    if (typeof window !== 'undefined' && soundEnabled) {
      try {
        messageSoundRef.current = new Audio('/message.mp3');
        // Preload sound for better user experience but don't play it automatically
        messageSoundRef.current.load();
        // Set volume to 50% for better user experience
        messageSoundRef.current.volume = 0.5;
      } catch (error) {
        console.error('Failed to load message sound:', error);
      }
    }
    
    return () => {
      if (messageSoundRef.current) {
        messageSoundRef.current = null;
      }
    };
  }, [soundEnabled]);

  // Auto scroll to bottom when messages change - improved to prevent initial scroll to top
  useEffect(() => {
    if (messagesContainerRef.current) {
      // Use requestAnimationFrame for smooth scrolling at the right time in the rendering cycle
      const scrollToBottom = () => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      };

      // First immediate scroll to avoid flash of wrong scroll position
      scrollToBottom();
      
      // Then use requestAnimationFrame to ensure it happens after render
      requestAnimationFrame(scrollToBottom);
      
      // Finally, a small timeout as a fallback to ensure it works
      const timeoutId = setTimeout(scrollToBottom, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  // Also scroll to bottom when the chat is opened - improved to be more reliable
  useEffect(() => {
    if (isOpen) {
      // Initial scroll once DOM is ready
      const immediateScroll = () => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      };

      // Immediate scroll
      immediateScroll();
      
      // Use requestAnimationFrame for smoother behavior
      requestAnimationFrame(immediateScroll);
      
      // Multiple timed scrolls to ensure it works through the animation cycle
      const timeoutIds = [
        setTimeout(immediateScroll, 50),
        setTimeout(immediateScroll, 150),
        setTimeout(immediateScroll, 300)
      ];
      
      return () => {
        timeoutIds.forEach(id => clearTimeout(id));
      };
    }
  }, [isOpen]);

  // Add useEffect to scroll to bottom when switching to messages tab
  useEffect(() => {
    if (activeTab === 'messages' && messagesContainerRef.current) {
      // Scroll to bottom of messages when switching to messages tab
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [activeTab]);

  // Handle mobile full screen mode
  useEffect(() => {
    const handleViewportChange = () => {
      if (typeof window !== 'undefined' && mobileFullScreen) {
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
  }, [isOpen, mobileFullScreen]);

  // Add escape key handler for closing the chat
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
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
        // Limit stored messages to prevent localStorage quota issues
        const messagesToStore = messages.length > MAX_STORED_MESSAGES 
          ? messages.slice(-MAX_STORED_MESSAGES) 
          : messages;
          
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToStore));
      } catch (error) {
        console.error('Failed to save messages to localStorage:', error);
        // Handle the error - consider clearing old messages if storage quota is exceeded
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-10)));
        } catch (fallbackError) {
          console.error('Failed to save even after fallback attempt:', fallbackError);
        }
      }
    }
  }, [messages]);

  // Start recording voice message
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        // Clean up recording state
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        
        // Release microphone access
        stream.getTracks().forEach(track => track.stop());
        
        // Add voice message to chat
        if (audioChunksRef.current.length > 0) {
          const voiceMessage: Message = {
            id: Date.now(),
            text: "🎤 Voice message",
            isBot: false,
            timestamp: new Date(),
            status: 'sent',
            audioUrl: audioUrl
          };
          
          setMessages(prev => [...prev, voiceMessage]);
          
          if (onMessageSend) {
            onMessageSend(voiceMessage);
          }
        }
      };
      
      // Start timer for recording duration
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Discard recording
  const discardRecording = () => {
    setIsRecording(false);
    setAudioURL(null);
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    audioChunksRef.current = [];
  };

  // Format recording time as MM:SS
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up recording resources on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  // Implement search functionality
  const searchMessages = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = messages.reduce<number[]>((acc, message, index) => {
      if (message.text.toLowerCase().includes(query.toLowerCase())) {
        acc.push(index);
      }
      return acc;
    }, []);
    
    setSearchResults(results);
    setCurrentSearchIndex(0);
    
    // Scroll to first result if found
    if (results.length > 0) {
      scrollToMessage(results[0]);
    }
  };
  
  // Scroll to message at specific index
  const scrollToMessage = (index: number) => {
    if (messagesContainerRef.current && index >= 0 && index < messages.length) {
      const messageElements = messagesContainerRef.current.querySelectorAll('[data-message-id]');
      if (messageElements[index]) {
        messageElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Navigate search results
  const navigateSearchResults = (direction: 'prev' | 'next') => {
    if (searchResults.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    }
    
    setCurrentSearchIndex(newIndex);
    scrollToMessage(searchResults[newIndex]);
  };

  // Toggle search mode
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      // Focus on search input when opened
      setTimeout(() => {
        const searchInput = document.getElementById('chat-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    } else {
      // Clear search when closing
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Download chat transcript
  const downloadTranscript = (format: 'txt' | 'json' | 'html' | 'csv') => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `chat-transcript-${timestamp}`;
    
    let content = '';
    let mimeType = '';
    let extension = '';
    
    switch (format) {
      case 'txt':
        content = messages.map(m => {
          const sender = m.isBot ? (m.sender || 'Bot') : 'You';
          const time = m.timestamp 
            ? new Date(m.timestamp).toLocaleTimeString() 
            : new Date().toLocaleTimeString();
          return `[${time}] ${sender}: ${m.text}`;
        }).join('\n\n');
        mimeType = 'text/plain';
        extension = 'txt';
        break;
        
      case 'json':
        content = JSON.stringify(messages, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
        
      case 'html':
        content = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Chat Transcript</title>
            <style>
              body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              .message { padding: 10px; margin: 10px 0; border-radius: 8px; }
              .bot { background-color: #f0f0f0; }
              .user { background-color: #e6f7ff; text-align: right; }
              .time { color: #666; font-size: 12px; margin-top: 4px; }
            </style>
          </head>
          <body>
            <h1>Chat Transcript</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <div class="chat">
              ${messages.map(m => {
                const time = m.timestamp 
                  ? new Date(m.timestamp).toLocaleString() 
                  : new Date().toLocaleString();
                return `
                  <div class="message ${m.isBot ? 'bot' : 'user'}">
                    <div class="content">${m.text}</div>
                    <div class="time">${m.isBot ? (m.sender || 'Bot') : 'You'} - ${time}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </body>
          </html>
        `;
        mimeType = 'text/html';
        extension = 'html';
        break;
        
      case 'csv':
        content = 'Time,Sender,Message\n';
        content += messages.map(m => {
          const time = m.timestamp 
            ? new Date(m.timestamp).toLocaleString() 
            : new Date().toLocaleString();
          return `"${time}","${m.isBot ? (m.sender || 'Bot') : 'You'}","${m.text.replace(/"/g, '""')}"`;
        }).join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
        break;
    }
    
    // Create download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    setShowTranscriptOptions(false);
  };

  // Handle file uploads with progress
  const handleFileUpload = async (file: File) => {
    // Create a placeholder for the file with progress at 0%
    const fileId = generateUUID();
    const fileObj = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      progress: 0
    };
    
    setAttachments(prev => [...prev, fileObj]);
    
    // Simulate file upload with progress updates
    const uploadSimulation = setInterval(() => {
      setAttachments(prev => 
        prev.map(att => 
          att.id === fileId
            ? { ...att, progress: Math.min(att.progress + 10, 100) }
            : att
        )
      );
    }, 300);
    
    // After "upload" completes
    setTimeout(() => {
      clearInterval(uploadSimulation);
      
      const fileMessage: Message = {
        id: Date.now(),
        text: `Attached: ${file.name}`,
        isBot: false,
        timestamp: new Date(),
        status: 'sent',
        attachment: {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
        }
      };
      
      setMessages(prev => [...prev, fileMessage]);
      
      // Keep track of attachment in state but remove progress indication
      setAttachments(prev => 
        prev.map(att => 
          att.id === fileId
            ? { ...att, progress: 100 }
            : att
        )
      );
      
      // If onFileUpload callback exists, call it
      if (onFileUpload) {
        onFileUpload(file).catch(console.error);
      }
    }, 3000);
  };

  // Enhanced file input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setIsAttachingFile(false);
    
    if (file) {
      try {
        // Check file size constraints
        if (maxAttachmentSize && file.size > maxAttachmentSize * 1024 * 1024) {
          alert(`File size exceeds the maximum allowed size of ${maxAttachmentSize}MB.`);
          return;
        }
        
        // Process upload
        handleFileUpload(file);
        
        // Reset file input
        if (e.target) {
          e.target.value = '';
        }
      } catch (error) {
        console.error("Error handling file:", error);
        alert("Sorry, there was an error uploading your file. Please try again.");
      }
    }
  };

  // Handle AI suggestions
  const generateAiSuggestions = (inputValue: string) => {
    // Only generate suggestions for longer inputs
    if (inputValue.length < 5) {
      setShowAiSuggestions(false);
      return;
    }
    
    // Mock AI suggestions - in a real app this would call an API
    const suggestions = [
      `I need help with ${inputValue.toLowerCase().includes('account') ? 'my account settings' : 'this issue'}`,
      `Can you provide more information about ${inputValue}?`,
      `I'd like to ${inputValue.toLowerCase().includes('cancel') ? 'cancel my subscription' : 'learn more about your services'}`,
    ];
    
    setAiSuggestions(suggestions);
    setShowAiSuggestions(true);
  };

  // Apply AI suggestion to input
  const applySuggestion = (suggestion: string) => {
    setInputText(suggestion);
    setShowAiSuggestions(false);
  };

  // Generate debounced suggestions when input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      generateAiSuggestions(inputText);
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [inputText]);

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      // Opening chat
      if (onOpen) onOpen();

      // Close any open menus
      setShowEmoji(false);
      
      // If analytics are enabled, track chat open event
      if (enableAnalytics && typeof window !== 'undefined') {
        try {
          // Simple analytics tracking
          const analyticsData = {
            event: 'chat_open',
            timestamp: new Date().toISOString(),
            userId: userIdentity?.id || 'anonymous'
          };
          
          // In a real implementation, you'd send this to your analytics endpoint
          console.log('Analytics event:', analyticsData);
        } catch (error) {
          console.error('Failed to track analytics event:', error);
        }
      }
    } else {
      // Closing chat
      if (onClose) onClose();
      
      // Track chat close if analytics enabled
      if (enableAnalytics && typeof window !== 'undefined') {
        // Similar analytics tracking for close event
        console.log('Analytics event: chat_close');
      }
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowEmoji(false);

    if (onMessageSend) {
      onMessageSend(userMessage);
    }

    // If we're using an API endpoint, make the actual request
    if (apiEndpoint) {
      // In a real implementation, you'd make an API call here
      // For now, simulate a loading state and then response
      setTimeout(() => {
        // Update message status to delivered
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'delivered' as const } 
              : msg
          )
        );
        
        // Generate bot response based on features enabled
        let responseText = "Thank you for your message. How can I help you today?";
        
        // Implement department routing if enabled
        if (enableDepartmentRouting && !currentDepartment) {
          responseText = "Which department would you like to connect with? Please choose from Sales, Support, or Billing.";
        }
        
        // Implement multilingual support if enabled
        if (enableMultilingualSupport && inputText.toLowerCase().includes('español')) {
          responseText = "Gracias por su mensaje. ¿Cómo puedo ayudarle hoy?";
        }
        
        // Show satisfaction survey if enabled
        if (showSatisfactionSurvey) {
          responseText = "Thank you for contacting us. How would you rate your experience today? (1-5)";
        }
        
        const botMessage: Message = {
          id: Date.now() + 1,
          text: responseText,
          isBot: true,
          sender: botName,
          role: "AI Agent",
          timestamp: new Date(),
          status: 'sent'
        };

        setMessages(prev => [...prev, botMessage]);

        // Play message sound if enabled
        if (soundEnabled && messageSoundRef.current) {
          messageSoundRef.current.play().catch(e => {
            console.error('Failed to play message sound:', e);
            // Sometimes browsers block autoplay, don't break the app over this
          });
        }
        
        // Update user message status to read after a short delay
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === userMessage.id 
                ? { ...msg, status: 'read' as const } 
                : msg
            )
          );
        }, 1000);
      }, 1000);
    } else {
      // Simple bot response if no API endpoint
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: "Thank you for your message. This is an automated response from the AI agent.",
          isBot: true,
          sender: botName,
          role: "AI Agent",
          timestamp: new Date(),
          status: 'sent'
        };

        setMessages(prev => [...prev, botMessage]);

        // Play message sound if enabled
        if (soundEnabled && messageSoundRef.current) {
          messageSoundRef.current.play().catch(e => {
            console.error('Failed to play message sound:', e);
          });
        }
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachFile = () => {
    setIsAttachingFile(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
  const Logo: React.FC = () => (
    <div className="w-5 h-5 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
  );

  // Add responsive viewport detection
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');

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
  const getWidgetDimensions = (): React.CSSProperties => {
    // Mobile: full screen
    if (viewportSize === 'mobile') {
      return {
        position: 'fixed' as 'fixed',
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
        position: 'fixed' as 'fixed',
        width: 'calc(100% - 40px)',
        height: 'calc(100% - 100px)',
        maxHeight: '700px',
        maxWidth: '600px',
        // Adjust to prevent overlap with button
        bottom: `${offset + triggerButtonSize + 20}px`,
        right: '20px',
        borderRadius: '12px',
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      };
    }

    // Desktop: standard fixed size
    else {
      return {
        position: 'fixed' as 'fixed',
        width: '400px',
        height: '704px',
        maxHeight: 'calc(100vh - 120px)',
        // Adjust to prevent overlap with button
        bottom: `${offset + triggerButtonSize + 20}px`,
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

  // Text-to-speech for accessibility
  const announceMessage = (message: Message) => {
    if ('speechSynthesis' in window) {
      // Only announce bot messages
      if (message.isBot) {
        const utterance = new SpeechSynthesisUtterance(message.text);
        utterance.volume = 0.5; // Set volume to 50%
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Content components for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full p-4 text-center"
          >
            <div className={`w-16 h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-4`}>
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to Zephyr</h2>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your AI-powered customer support assistant available 24/7.
            </p>
            <button
              onClick={() => setActiveTab('messages')}
              className={`mt-6 px-4 py-2 rounded-md ${primaryColor} ${textColor} font-medium`}
            >
              Start chatting
            </button>
          </motion.div>
        );
      case 'help':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full p-4 overflow-y-auto"
          >
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h2>
            
            {[
              { q: "How do I reset my password?", a: "You can reset your password by clicking on the 'Forgot Password' link on the login page." },
              { q: "How can I contact customer support?", a: "You can contact us via this chat, email at support@example.com, or call us at 1-800-123-4567." },
              { q: "What are your business hours?", a: "Our customer support team is available Monday through Friday, 9 AM to 5 PM EST." },
              { q: "Is my data secure?", a: "Yes, we use industry-standard encryption and security measures to protect your data." }
            ].map((faq, i) => (
              <div key={i} className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{faq.q}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{faq.a}</p>
              </div>
            ))}
          </motion.div>
        );
      case 'news':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full p-4 overflow-y-auto"
          >
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Latest Updates</h2>
            
            {[
              { 
                title: "New Features Released", 
                date: "April 10, 2025", 
                content: "We've just released new features including improved chat navigation and smoother animations." 
              },
              { 
                title: "Mobile App Launched", 
                date: "April 5, 2025", 
                content: "Our mobile app is now available on iOS and Android. Download it to stay connected on the go." 
              },
              { 
                title: "System Maintenance", 
                date: "April 2, 2025", 
                content: "We'll be performing system maintenance on April 15 from 2 AM to 4 AM EST. Services might be temporarily unavailable." 
              }
            ].map((news, i) => (
              <div key={i} className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{news.title}</h3>
                <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{news.date}</div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{news.content}</p>
              </div>
            ))}
          </motion.div>
        );
      case 'messages':
      default:
        return (
          <div className="flex flex-col h-full">
            {isInConversationList ? (
              // Conversations list view - no typing area shown here
              <>
                <div 
                  className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: darkMode ? '#4B5563 #1F2937' : '#CBD5E0 #EDF2F7'
                  }}
                >
                  {conversations.map((conv) => (
                    <div 
                      key={conv.id}
                      onClick={() => {
                        // Set loading state when clicking on a conversation
                        setIsLoadingConversation(true);
                        
                        // Set timeout to simulate loading
                        setTimeout(() => {
                          setActiveConversationId(conv.id);
                          setIsInConversationList(false);
                          setIsLoadingConversation(false);
                        }, 500);
                      }}
                      className={`p-4 border-b ${
                        darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-100'
                      } cursor-pointer transition-colors duration-200`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-gray-600' : 'bg-blue-50'
                        }`}>
                          {conv.isBot ? (
                            // Show bot logo for bot conversations
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-blue-500'}`}>
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          ) : (
                            <div className={`w-5 h-5 ${darkMode ? 'bg-gray-400' : 'bg-gray-300'} rounded-full`}></div>
                          )}
                        </div>
                        
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {conv.title}
                            </span>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(conv.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <p className={`text-sm truncate max-w-[200px] ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {conv.lastMessage}
                            </p>
                            
                            {conv.unread && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ask a question button - Moved above the border */}
                <div className={`p-4 flex justify-center ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <button 
                    onClick={() => {
                      // Add loading state when creating a new conversation
                      setIsLoadingConversation(true);
                      
                      // Set timeout to simulate loading
                      setTimeout(() => {
                        setActiveConversationId('new-' + Date.now());
                        setIsInConversationList(false);
                        setIsLoadingConversation(false);
                      }, 500);
                    }}
                    className={`px-4 py-2 rounded-md flex items-center justify-center ${
                      darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-black text-white hover:bg-gray-800'
                    } transition duration-200`}
                  >
                    <MessageSquareText className="w-4 h-4 mr-1.5" />
                    <span className="font-medium text-sm">Ask a question</span>
                  </button>
                </div>
              </>
            ) : (
              // Chat view for a specific conversation with loading state
              <div className="flex flex-col h-full">
                {isLoadingConversation ? (
                  // Loading state for conversation
                  <motion.div 
                    className="flex-1 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative w-12 h-12">
                        <motion.div 
                          className={`absolute inset-0 rounded-full ${darkMode ? 'border-t-gray-300' : 'border-t-gray-700'} border-4 border-gray-200`}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                      <span className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading conversation...</span>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div 
                      ref={messagesContainerRef}
                      className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} p-4 space-y-4`}
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: darkMode ? '#4B5563 #1F2937' : '#CBD5E0 #EDF2F7'
                      }}
                      role="log"
                      aria-live="polite"
                    >
                      {messages.map((message, index) => renderMessage(message, index))}
                      
                      {/* Show satisfaction survey if enabled */}
                      {showSatisfactionSurvey && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}
                        >
                          <p className="text-sm font-medium mb-2">How would you rate your experience?</p>
                          <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <motion.button
                                key={rating}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200'} flex items-center justify-center transition-colors`}
                                aria-label={`Rate ${rating} of 5`}
                              >
                                {rating}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Message input area - Always shown in active conversations */}
                    <div className={`p-2 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} border-t`}>
                      
                      {/* AI suggestions */}
                      {showAiSuggestions && aiSuggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="px-2 pb-2 flex flex-wrap gap-2"
                        >
                          {aiSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => applySuggestion(suggestion)}
                              className={`text-xs px-3 py-1.5 rounded-full ${
                                darkMode 
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              } transition-colors truncate max-w-full`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </motion.div>
                      )}
                      
                      {/* File upload progress indicators */}
                      {attachments.filter(att => att.progress < 100).length > 0 && (
                        <div className={`px-2 pb-2 ${attachments.length > 0 ? 'pt-2' : ''} space-y-2`}>
                          {attachments.filter(att => att.progress < 100).map(att => (
                            <div key={att.id} className="flex items-center">
                              <div className={`w-8 h-8 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mr-2 flex-shrink-0`}>
                                {getFileIcon(att.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className={`text-xs truncate max-w-[150px] ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {att.name}
                                  </span>
                                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {att.progress}%
                                  </span>
                                </div>
                                <div className={`h-1 w-full rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                  <div 
                                    className={`h-full ${darkMode ? 'bg-blue-500' : 'bg-blue-600'} transition-all duration-300 ease-out`}
                                    style={{ width: `${att.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Voice recording indicator */}
                      {isRecording && (
                        <div className={`p-3 rounded-lg mb-2 flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-600'} mr-2 animate-pulse`}></div>
                          <span className={`text-sm flex-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recording... {formatRecordingTime(recordingTime)}</span>
                          <div className="flex space-x-2">
                            <button 
                              onClick={stopRecording}
                              className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-200'} transition-colors`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button 
                              onClick={discardRecording}
                              className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-200'} transition-colors`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Message input */}
                      <div className="flex items-center relative">
                        <div className="flex-1 relative">
                          <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            rows={1}
                            className={`block w-full py-2 pl-3 pr-10 resize-none ${
                              darkMode 
                                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                                : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                            } border rounded-lg focus:outline-none focus:ring-1 ${
                              darkMode ? 'focus:ring-gray-500' : 'focus:ring-blue-500'
                            } text-sm transition-all leading-normal overflow-hidden`}
                            style={{ 
                              maxHeight: '120px',
                              minHeight: '40px',
                              height: 'auto'
                            }}
                          />
                        </div>
                        
                        {/* Input toolbar */}
                        <div className="flex ml-2">
                          {/* Emoji button */}
                          <button 
                            onClick={() => setShowEmoji(!showEmoji)} 
                            title="Add emoji"
                            className={`p-2 rounded-full ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-500'
                            } transition-colors focus:outline-none`}
                          >
                            <Smile className="w-5 h-5" />
                          </button>
                          
                          {/* Attachment button */}
                          <button 
                            onClick={handleAttachFile} 
                            title="Attach file"
                            className={`p-2 rounded-full ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-500'
                            } transition-colors focus:outline-none`}
                          >
                            <PaperclipIcon className="w-5 h-5" />
                          </button>
                          
                          {/* Voice message button */}
                          {enableVoiceMessages && (
                            <button 
                              onClick={startRecording} 
                              title="Record voice message"
                              className={`p-2 rounded-full ${
                                darkMode 
                                  ? 'hover:bg-gray-700 text-gray-300' 
                                  : 'hover:bg-gray-100 text-gray-500'
                              } transition-colors focus:outline-none`}
                            >
                              <Headphones className="w-5 h-5" />
                            </button>
                          )}
                          
                          {/* Send button */}
                          <button 
                            onClick={handleSend} 
                            disabled={!inputText.trim()}
                            className={`p-2 rounded-full ${
                              inputText.trim() 
                                ? `${primaryColor} ${textColor} hover:opacity-90` 
                                : `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`
                            } transition-colors focus:outline-none ml-1`}
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
    }
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
            variants={chatButtonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            onClick={toggleChat}
            className={`fixed ${primaryColor || 'bg-black'} ${textColor || 'text-white'} rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 z-[9999]`}
            style={{
              ...getChatButtonStyles(),
              width: `${triggerButtonSize}px`,
              height: `${triggerButtonSize}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Open chat"
          >
            <Logo />
            {/* Notification badge */}
            {showNotificationBadge && notificationCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                style={{ minWidth: '18px', height: '18px', padding: '0 4px' }}
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat container when open */}
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            key="chat-container"
            variants={chatContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed overflow-hidden ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-2xl flex flex-col ${
              viewportSize === 'mobile' ? 'rounded-none' : 'rounded-xl'
            }`}
            style={getWidgetDimensions()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-heading"
          >
            {/* Enhanced Header */}
            {renderEnhancedHeader()}

            {/* Department Routing - Show only if enabled and no department selected */}
            {enableDepartmentRouting && !currentDepartment && (
              <div className={`p-4 ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                <div className="text-sm font-medium mb-2">Please select a department:</div>
                <div className="flex flex-wrap gap-2">
                  {['Sales', 'Support', 'Billing'].map(dept => (
                    <button
                      key={dept}
                      onClick={() => setCurrentDepartment(dept)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content */}
            {renderTabContent()}

            {/* Bottom Navigation - Only show when not in active chat */}
            {(isInConversationList || activeTab !== 'messages') && (
              <div className={`grid grid-cols-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t ${viewportSize === 'mobile' ? 'py-1' : ''}`}
                   style={{ width: '400px', height: '81px' }}>
                {[
                  { 
                    icon: activeTab === 'home' 
                      ? <LayoutDashboard className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} fill-current stroke-[1.5]`} style={{ fill: 'currentColor', fillOpacity: 1 }} />
                      : <LayoutDashboard className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} stroke-[1.5]`} />, 
                    label: "Home", 
                    tab: 'home',
                    description: "Main dashboard"
                  },
                  { 
                    icon: activeTab === 'messages'
                      ? <MessageSquareText className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} fill-current stroke-[1.5]`} style={{ fill: 'currentColor', fillOpacity: 1 }} />
                      : <MessageSquareText className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} stroke-[1.5]`} />, 
                    label: "Messages", 
                    tab: 'messages',
                    description: "View messages"
                  },
                  { 
                    icon: activeTab === 'help'
                      ? <HelpCircle 
                          className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} 
                          style={{
                            stroke: 'currentColor',
                            strokeWidth: 2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            fill: 'currentColor',
                            fillOpacity: 0.1
                          }}
                        />
                      : <HelpCircle 
                          className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`}
                          style={{
                            stroke: 'currentColor',
                            strokeWidth: 1.5,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                          }}
                        />,
                    label: "Help", 
                    tab: 'help',
                    description: "Get assistance"
                  },
                  { 
                    icon: activeTab === 'news'
                      ? <BellRing className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} fill-current stroke-[1.5]`} style={{ fill: 'currentColor', fillOpacity: 1 }} />
                      : <BellRing className={`${viewportSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} stroke-[1.5]`} />, 
                    label: "News", 
                    tab: 'news',
                    description: "Latest updates"
                  }
                ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    setActiveTab(item.tab as 'home' | 'messages' | 'help' | 'news');
                    
                    // If clicking on Messages tab, ensure we show message input
                    if (item.tab === 'messages' && isInConversationList) {
                      // Create a new conversation when selecting messages tab
                      if (!activeConversationId) {
                        setActiveConversationId('new-' + Date.now());
                        setIsInConversationList(false);
                      }
                    }
                  }}
                  className="group flex flex-col items-center justify-center transition-colors relative border-0"
                  title={item.description}
                >
                  <div className={`${
                    activeTab === item.tab 
                      ? darkMode ? 'text-blue-500' : 'text-black' 
                      : darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-900'
                  } transition-colors flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${
                    activeTab === item.tab 
                      ? `${darkMode ? 'text-blue-500' : 'text-black'}` 
                      : darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-900'
                  } transition-colors`}>
                    {item.label}
                  </span>
                  {activeTab === item.tab && (
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                      darkMode ? 'bg-blue-500' : 'bg-black'
                    }`} />
                  )}
                </button>
              ))}
              </div>
            )}

            {/* Render Theme Settings */}
            {renderThemeSettings()}

            {/* Render Search */}
            {renderSearch()}

            {/* Render Transcript Options */}
            {renderTranscriptOptions()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button - moved outside chat container */}
      <AnimatePresence initial={false}>
        {isOpen && viewportSize !== 'mobile' && (
          <motion.button
            onClick={toggleChat}
            key="close-button"
            variants={chatButtonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            className={`fixed ${primaryColor || 'bg-black'} ${textColor || 'text-white'} rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 z-[10000]`}
            style={{
              ...closeButtonPosition[position],
              width: `${triggerButtonSize}px`,
              height: `${triggerButtonSize}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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