# Zephyr Chat SaaS Platform Documentation

## Overview

Zephyr is a modern SaaS platform providing a customizable chat widget solution with a comprehensive administrative dashboard. The platform enables businesses to integrate real-time chat support into their websites and applications, while also providing powerful tools for customer support agents and administrators.

## Technology Stack

- **Frontend Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Custom implementation with fetch API
- **State Management**: React hooks and context
- **Deployment**: Vercel/Netlify compatible

## Project Structure

```
/pages                    - Next.js page routes
  /_app.jsx               - App entry point and global configuration
  /index.jsx              - Landing/marketing page
  /dashboard.jsx          - Agent dashboard for handling conversations
  /admin/                 - Administrative panel
    /index.jsx            - Super admin dashboard
  /api/                   - Backend API endpoints
    /chat.js              - Chat-related API handlers
    /api-keys/            - API key management endpoints
      /[id].js            - Single API key operations
      /index.js           - List API keys
      /usage.js           - API key usage statistics
    /conversations/       - Conversation management endpoints
      /[id]/              - Single conversation operations
    /customers/           - Customer data endpoints
      /[id].js            - Single customer operations
      /index.js           - List customers
      /stats.js           - Customer statistics

/src
  /components/            - Reusable UI components
    /ChatWidget.jsx       - Main chat widget component
  /lib/                   - Utility libraries
    /api-client.js        - API client with authentication handling
  /services/              - Service layer for API interactions
    /api-key-service.js   - API key management service
    /customer-service.js  - Customer data service

/styles                   - Global styles
  /globals.css           - Global CSS styles
```

## Core Components

### 1. Chat Widget (`ChatWidget.jsx`)

The chat widget is the primary user-facing component that can be embedded into any website.

#### Key Features

- **Real-time messaging interface**: Sending/receiving messages in real-time
- **File attachments**: Support for images, videos, and documents
- **Emoji picker**: Integrated emoji selection interface
- **Responsive design**: Adapts to all device sizes (mobile, tablet, desktop)
- **Full-screen mode**: Special adaptation for mobile devices
- **Animations**: Smooth transitions between states using Framer Motion
- **Customization**: Configurable through props for positioning, colors, etc.

#### Usage

```jsx
<ChatWidget 
  position="bottom-right"
  offset={20}
  triggerButtonSize={60}
  headerText="Zephyr Support"
  primaryColor="bg-blue-600"
  textColor="text-white"
  showNotificationBadge={true}
  notificationCount={0}
  bubbleAnimation={true}
  mobileFullScreen={true}
  soundEnabled={true}
  onMessageSend={(msg) => console.log("Message sent:", msg)}
  onOpen={() => console.log("Chat opened")}
  onClose={() => console.log("Chat closed")}
/>
```

### 2. Agent Dashboard (`dashboard.jsx`)

An interface for support agents to manage customer conversations and tickets.

#### Key Features

- **Conversation Management**: View, filter, and respond to ongoing conversations
- **Priority System**: High, medium, and low priority tags for tickets
- **Status Tracking**: Open, pending, and resolved statuses
- **Customer Details**: Right sidebar with comprehensive customer information
- **Audio/Video Calls**: Integrated calling functionality
- **AI Assistance**: AI-suggested responses to common questions
- **Real-time Updates**: Polling mechanism for new messages (every 5 seconds)
- **Message Types**: Support for normal messages, internal notes, and template responses

### 3. Admin Dashboard (`admin/index.jsx`)

A comprehensive administrative interface for platform management.

#### Key Features

- **Dashboard Overview**: Key metrics and platform statistics
- **Customer Management**: View, add, edit, and manage customer accounts
- **API Key Management**: Generate and control API access keys
- **Analytics**: Usage statistics and reporting
- **Settings**: System configuration options

## API Architecture

### API Client (`api-client.js`)

A unified client for all API interactions with built-in authentication and error handling:

- **Request Authentication**: Automatic token inclusion in request headers
- **Response Handling**: Standardized error and success processing
- **Unauthorized Handling**: Automatic redirection on authentication failures

### API Endpoints

#### Chat API (`/api/chat.js`)

- **Main Chat Handler**: Processes incoming messages
- **Knowledge Search**: Searches help articles (endpoint: `/api/chat/knowledge-search`)
- **Analytics**: Tracks usage statistics (endpoint: `/api/chat/analytics`)

#### API Key Endpoints

- **List API Keys**: `GET /api/api-keys`
- **Create API Key**: `POST /api/api-keys`
- **Get API Key Details**: `GET /api/api-keys/[id]`
- **Update API Key**: `PUT /api/api-keys/[id]`
- **Delete API Key**: `DELETE /api/api-keys/[id]`
- **API Key Usage Stats**: `GET /api/api-keys/usage`

#### Conversation Endpoints

- **List Conversations**: `GET /api/conversations`
- **Create Conversation**: `POST /api/conversations`
- **Get Conversation Details**: `GET /api/conversations/[id]`
- **Update Conversation**: `PUT /api/conversations/[id]`
- **Send Message**: `POST /api/conversations/[id]/messages`
- **List Messages**: `GET /api/conversations/[id]/messages`

#### Customer Endpoints

- **List Customers**: `GET /api/customers`
- **Create Customer**: `POST /api/customers`
- **Get Customer Details**: `GET /api/customers/[id]`
- **Update Customer**: `PUT /api/customers/[id]`
- **Delete Customer**: `DELETE /api/customers/[id]`
- **Get Customer Statistics**: `GET /api/customers/stats`

## Service Layer

### Customer Service (`customer-service.js`)

Handles all customer-related API interactions:

- Loading customer data
- Customer statistics
- Managing customer accounts

### API Key Service (`api-key-service.js`)

Manages API key operations:

- Key generation and revocation
- Access control
- Usage tracking

## Implementation Details

### Authentication System

Authentication is handled via JWT tokens stored in localStorage:

- Tokens are included in API request headers
- 401 responses trigger redirection to login page
- Token expiration is handled automatically

### Real-time Communication

The current implementation uses a polling approach for real-time updates:

- Conversations list is refreshed every 30 seconds
- Active conversation messages are updated every 5 seconds
- WebSocket implementation is planned for future releases

### Error Handling

The application employs a comprehensive error handling strategy:

- API errors are caught and presented to users
- Fallback to demo data when API is unavailable
- Retry mechanisms for failed requests

## Responsive Behavior

The ChatWidget automatically adapts to different screen sizes:

- **Mobile**: Full-screen experience with optimized controls
- **Tablet**: Large but not full-screen with appropriate spacing
- **Desktop**: Standard fixed-size widget with all features

## Button Animations

The widget buttons feature smooth hover animations using Framer Motion:

- Scale up to 110% on hover
- Enhanced shadow effect for better depth perception
- Quick response time for improved user experience

## Deployment

The chat widget can be deployed using Vercel, Netlify, or any other Next.js compatible hosting service.

```bash
# Build for production
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

## Recent Enhancements (April 2025)

- **Improved Responsive Design**: Full compatibility across mobile, tablet, and desktop with adaptive layouts and optimized spacing
- **Consistent Button Sizing**: Both chat and close buttons maintain exactly 48x48px dimensions for visual consistency
- **Enhanced Animations**: Smooth hover animations with fast response times for improved user interaction
- **Fixed Animation Issues**: Resolved stuttering in button animations during transitions
- **Better Mobile Experience**: Optimized text sizes, spacing, and element dimensions for mobile users
- **Improved Positioning**: Fixed issues with button positioning and overlaps during transitions
- **API Integration**: Complete backend integration for conversation management
- **AI Assistant**: AI-powered response suggestions for agents
- **Ticket Management**: Comprehensive ticket lifecycle handling

## Planned Features

- **WebSocket Integration**: Replace polling with WebSockets for true real-time communication
- **Advanced Analytics**: Enhanced reporting and visualization tools
- **Multi-language Support**: Internationalization for both chat widget and admin interfaces
- **Integration Marketplace**: Pre-built connectors for popular CRM and help desk systems
- **Custom Theming**: More advanced styling options for enterprise clients
- **Mobile App**: Native mobile application for support agents

## Best Practices for Implementation

1. **API Security**: Always protect API keys and use proper authentication
2. **Performance Optimization**: Implement virtualized lists for large conversation histories
3. **UI Responsiveness**: Test on various devices to ensure proper responsive behavior
4. **Error Handling**: Provide fallback UIs when APIs fail
5. **Accessibility**: Ensure all interface elements are accessible to all users

## Configuration Options

The ChatWidget component accepts the following props for customization:

| Prop               | Type       | Default        | Description                                 |
|--------------------|------------|----------------|---------------------------------------------|
| position           | string     | 'bottom-right' | Widget position (bottom-right, bottom-left, top-right, top-left) |
| offset             | number     | 20             | Distance from edge of screen in pixels      |
| headerText         | string     | 'Fin'          | Text shown in the chat header               |
| soundEnabled       | boolean    | false          | Enable sound effects for new messages       |
| onMessageSend      | function   | null           | Callback when a message is sent             |
| onOpen             | function   | null           | Callback when chat is opened                |
| onClose            | function   | null           | Callback when chat is closed                |
| triggerButtonSize  | number     | 60             | Size of the chat trigger button             |
| primaryColor       | string     | 'bg-blue-600'  | Primary color for the widget                |
| textColor          | string     | 'text-white'   | Text color for buttons and headers          |
| mobileFullScreen   | boolean    | true           | Enable full screen mode on mobile           |
| bubbleAnimation    | boolean    | true           | Enable animation for chat bubble            |

---

*Last updated: April 12, 2025*
