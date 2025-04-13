# Zephyr Chat Widget

A modern, customizable chat widget for web applications with a sleek UI and rich functionality.

## Overview

Zephyr is a professional-grade chat widget that can be easily integrated into any web application. It provides a seamless communication experience between users and support agents with a focus on design, usability, and performance.

## Features

- **Modern UI**: Clean, responsive design with smooth animations and transitions
- **Multi-tab Interface**: Home, Messages, Help, and News tabs for comprehensive functionality
- **Real-time Messaging**: Instant message delivery with read receipts and typing indicators
- **Rich Media Support**: Send text, emojis, files, and images
- **Help Center Integration**: Browse and search knowledge base articles
- **News Updates**: Stay informed with the latest product updates and announcements
- **Keyboard Shortcuts**: Quick navigation with keyboard commands
- **Customizable**: Adapt the widget to match your brand with customizable colors and styling
- **Accessibility**: Built with accessibility in mind for all users
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## Getting Started

### Installation

```bash
npm install zephyr-chat-widget
# or
yarn add zephyr-chat-widget
```

### Basic Usage

```jsx
import { ChatWidget } from 'zephyr-chat-widget';

function App() {
  return (
    <div>
      <h1>My Website</h1>
      <ChatWidget 
        companyName="Your Company"
        agentName="Support Agent"
        primaryColor="#000000"
      />
    </div>
  );
}
```

## Customization

The chat widget can be customized with various props:

```jsx
<ChatWidget 
  position="bottom-right" // or "bottom-left"
  offset={20} // distance from the edge of the screen
  companyName="Your Company"
  agentName="Support Agent"
  agentAvatar="https://example.com/avatar.jpg"
  primaryColor="#000000"
  onMessageSend={(message) => console.log(message)}
  onFileUpload={(file) => console.log(file)}
  enableTypingPreview={true}
  quickReplies={[
    { id: '1', text: 'How can I help?', category: 'greeting' },
    { id: '2', text: 'Thank you!', category: 'closing' }
  ]}
  helpArticles={[
    { 
      id: '1', 
      title: 'Getting Started', 
      content: 'Learn how to use our product...',
      category: 'Basics',
      views: 1200
    }
  ]}
  newsItems={[
    {
      id: '1',
      title: 'New Feature Released',
      content: 'We\'re excited to announce...',
      date: new Date(),
      category: 'Product Updates',
      read: false
    }
  ]}
/>
```

## Development

### Prerequisites

- Node.js 14+
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/zephyr-chat-widget.git
cd zephyr-chat-widget
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- Animations powered by Framer Motion
- Icons from Lucide React