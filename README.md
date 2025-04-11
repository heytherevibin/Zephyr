# Zephyr Chat Widget

A modern, customizable chat widget built with Next.js and React, designed to be easily integrated into any web application.

![Zephyr Chat Widget](https://via.placeholder.com/600x400?text=Zephyr+Chat+Widget)

## Features

- 💬 Real-time messaging interface
- 📎 File attachments (images, videos, documents)
- 🎙️ Voice message recording and playback
- 😊 Emoji picker
- 📱 Responsive design for all device sizes (mobile, tablet, desktop)
- 🎨 Customizable styling with Tailwind CSS
- 🔄 Automatic scrolling to newest messages
- 💾 Chat transcript download
- 🔄 Message history management
- ✨ Smooth animations and transitions
- 📱 Full-screen mode on mobile devices
- 🎛️ Adaptive layout based on viewport size
- 🛠️ Professional help desk dashboard for administrators

## Recent Enhancements (April 2025)

- **Improved Responsive Design**: Full compatibility across mobile, tablet, and desktop with adaptive layouts and optimized spacing
- **Consistent Button Sizing**: Both chat and close buttons maintain exactly 48x48px dimensions for visual consistency
- **Enhanced Animations**: Smooth hover animations with fast response times for improved user interaction
- **Fixed Animation Issues**: Resolved stuttering in button animations during transitions
- **Better Mobile Experience**: Optimized text sizes, spacing, and element dimensions for mobile users
- **Improved Positioning**: Fixed issues with button positioning and overlaps during transitions
- **Professional Help Desk**: New comprehensive administration dashboard with ticket management capabilities

## Admin Dashboard Features

The Zephyr Chat Widget now includes a powerful administrative dashboard for help desk management:

### Navigation & Structure
- Left sidebar with categorized navigation (Inbox, Teams, Teammates, Analytics, Knowledge Base)
- Thread list panel showing conversation previews with status and priority indicators
- Detailed conversation view with threaded messages
- Collapsible right sidebar for customer and ticket details

### Key Functionality
- Audio/video call integration with screen sharing capability
- Advanced conversation management with timestamps and visual indicators
- AI-powered response suggestions to help agents respond faster
- Complete ticket management with priority levels and unique IDs
- Team assignment and collaborative support features
- Status tracking (open, pending, resolved)

### UI/UX Elements
- Clean, light-themed interface with intuitive navigation
- Compact message preview cards with sender information and timestamps
- Contextual action buttons for call management
- Hover states for all interactive elements
- Unread message notifications

### Advanced Features
- AI assistant for suggesting responses and improving communication
- Customer data panel showing contact history and information
- Related ticket linking for complex support cases
- Call recording functionality with mute and screen share options
- Real-time updates across the platform

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide React](https://lucide.dev/) - Icons

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/zephyr-chat-widget.git
cd zephyr-chat-widget
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Basic Implementation

Import and use the ChatWidget component in your application:

```jsx
import { ChatWidget } from '../src/components/ChatWidget';

function MyApp() {
  return (
    <div>
      <h1>My Website</h1>
      {/* The ChatWidget will appear as a floating button in the bottom-right corner by default */}
      <ChatWidget />
    </div>
  );
}

export default MyApp;
```

### Customization

The ChatWidget can be customized with props to match your application's needs:

```jsx
<ChatWidget 
  // Position in the page (bottom-right, bottom-left, top-right, top-left)
  position="bottom-right"
  // Distance from the edge of the screen in pixels
  offset={20}
  // Text shown in the chat header
  headerText="Customer Support"
  // Enable sound effects for new messages
  soundEnabled={true}
  // Callback functions for various events
  onMessageSend={(msg) => console.log("Message sent:", msg)}
  onOpen={() => console.log("Chat opened")}
  onClose={() => console.log("Chat closed")}
/>
```

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Animation powered by [Framer Motion](https://www.framer.com/motion/)

---

Created with ❤️ | Last updated: April 11, 2025