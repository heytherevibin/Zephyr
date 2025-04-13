# Zephyr Chat Widget

A professional chat widget for websites with multi-department routing, customer satisfaction surveys, analytics tracking, and more.

## Features

- Multi-department routing
- Customer satisfaction surveys
- Analytics tracking
- Canned responses
- Multilingual support
- File attachments
- Emoji support
- Dark mode
- Mobile responsive

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/heytherevibin/Zephyr.git
cd Zephyr
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Implementation

```jsx
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <ChatWidget
      position="bottom-right"
      offset={20}
      triggerButtonSize={60}
      headerText="Support"
      primaryColor="#0066FF"
      textColor="#FFFFFF"
      showNotificationBadge={true}
      notificationCount={0}
      bubbleAnimation={true}
      mobileFullScreen={true}
      soundEnabled={true}
      darkMode={false}
    />
  );
}
```

### Advanced Implementation with All Features

```jsx
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <ChatWidget
      position="bottom-right"
      offset={20}
      triggerButtonSize={60}
      headerText="Zephyr Support"
      primaryColor="#0066FF"
      textColor="#FFFFFF"
      showNotificationBadge={true}
      notificationCount={0}
      bubbleAnimation={true}
      mobileFullScreen={true}
      soundEnabled={true}
      darkMode={false}
      // Professional features
      enableDepartmentRouting={true}
      enableAnalytics={true}
      enableCannedResponses={true}
      enableMultilingualSupport={true}
      userIdentity={{ id: 'user-12345', name: 'John Doe', email: 'john@example.com' }}
      apiEndpoint="/api/chat"
      onMessageSend={(msg) => console.log("Message sent:", msg)}
      showSatisfactionSurvey={true}
    />
  );
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| position | string | 'bottom-right' | Position of the chat widget ('bottom-right', 'bottom-left') |
| offset | number | 20 | Offset from the edge of the screen in pixels |
| triggerButtonSize | number | 60 | Size of the trigger button in pixels |
| headerText | string | 'Chat' | Text displayed in the chat header |
| primaryColor | string | '#0066FF' | Primary color for the chat widget |
| textColor | string | '#FFFFFF' | Text color for the chat widget |
| showNotificationBadge | boolean | false | Whether to show the notification badge |
| notificationCount | number | 0 | Number of unread notifications |
| bubbleAnimation | boolean | true | Whether to animate the chat bubble |
| mobileFullScreen | boolean | true | Whether to use full screen on mobile devices |
| soundEnabled | boolean | true | Whether to enable notification sounds |
| darkMode | boolean | false | Whether to use dark mode |
| enableDepartmentRouting | boolean | false | Whether to enable department routing |
| enableAnalytics | boolean | false | Whether to enable analytics tracking |
| enableCannedResponses | boolean | false | Whether to enable canned responses |
| enableMultilingualSupport | boolean | false | Whether to enable multilingual support |
| userIdentity | object | null | User identity information |
| apiEndpoint | string | '/api/chat' | API endpoint for chat messages |
| onMessageSend | function | null | Callback function when a message is sent |
| showSatisfactionSurvey | boolean | false | Whether to show the satisfaction survey |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Emoji Mart](https://github.com/missive/emoji-mart)
- [Date-fns](https://date-fns.org/)
- [GSAP](https://greensock.com/gsap/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Socket.io](https://socket.io/)