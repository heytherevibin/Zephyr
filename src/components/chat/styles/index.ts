export const CHAT_STYLES = {
  container: {
    base: 'fixed flex flex-col bg-white shadow-lg rounded-lg overflow-hidden font-sans',
    mobile: 'inset-0 w-full h-full md:absolute md:inset-auto md:bottom-[76px] md:right-0 md:w-[400px] md:h-[700px] md:rounded-[16px]',
    desktop: 'bottom-[76px] right-0 w-[calc(100%-32px)] max-w-[400px] h-[600px] rounded-[16px] mx-4',
    wrapper: 'bg-white shadow-2xl flex flex-col overflow-hidden'
  },
  button: {
    base: 'flex items-center justify-center rounded-full transition-all duration-200',
    launcher: 'w-[60px] h-[60px] shadow-lg hover:shadow-xl relative z-50',
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    icon: 'w-6 h-6'
  },
  input: {
    base: 'w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent',
    textarea: 'resize-none min-h-[52px] max-h-[200px] overflow-y-auto',
    container: 'flex items-end gap-2 p-4 border-t border-gray-200'
  },
  message: {
    container: 'flex flex-col space-y-2 p-4 overflow-y-auto',
    bubble: {
      base: 'max-w-[80%] rounded-lg p-3',
      user: 'bg-black text-white ml-auto',
      agent: 'bg-gray-100 text-gray-800',
      timestamp: 'text-xs text-gray-500 mt-1',
      status: 'text-xs text-gray-500 mt-1'
    },
    thread: {
      container: 'pl-4 border-l-2 border-gray-200',
      reply: 'text-sm text-gray-500'
    }
  },
  tab: {
    container: 'flex border-b border-gray-200 bg-white',
    button: {
      base: 'flex-1 py-2 text-center transition-colors duration-200',
      active: 'text-black border-b-2 border-black',
      inactive: 'text-gray-500 hover:text-gray-700',
      icon: 'w-5 h-5 mx-auto mb-1'
    }
  },
  header: {
    base: 'flex items-center justify-between p-4 border-b border-gray-200',
    title: 'text-lg font-semibold',
    actions: 'flex items-center gap-2'
  },
  notification: {
    badge: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center',
    dot: 'w-2 h-2 bg-red-500 rounded-full'
  },
  scrollbar: {
    base: 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400',
    container: 'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'
  },
  animation: {
    fadeIn: 'animate-fadeIn',
    slideUp: 'animate-slideUp',
    slideDown: 'animate-slideDown',
    spring: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8
    }
  }
} as const;

export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  slideUp: {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 10, opacity: 0 },
    transition: { duration: 0.2 }
  },
  slideDown: {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0 },
    transition: { duration: 0.2 }
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
    mass: 0.8
  }
} as const; 