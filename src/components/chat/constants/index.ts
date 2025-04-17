export const CHAT_CONSTANTS = {
  ANIMATION: {
    DURATION: 0.2,
    EASING: 'ease-out',
    SPRING: {
      stiffness: 300,
      damping: 25,
      mass: 0.8
    }
  },
  SOUND: {
    DEFAULT_VOLUME: 0.5,
    NOTIFICATION_URL: '/sounds/notification.mp3'
  },
  UI: {
    MAX_MESSAGE_LENGTH: 1000,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    TYPING_TIMEOUT: 3000,
    MESSAGE_DEBOUNCE: 300
  },
  TABS: {
    HOME: 'home',
    MESSAGES: 'messages',
    HELP: 'help',
    NEWS: 'news'
  } as const,
  POSITIONS: {
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left'
  } as const,
  DEFAULT_COLORS: {
    PRIMARY: '#000000',
    TEXT: '#ffffff'
  }
} as const; 