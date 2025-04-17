# ChatWidget Component

The ChatWidget component is a versatile and customizable chat interface that can be easily integrated into any React application.

## Features

- Real-time messaging
- File attachments
- Message reactions
- Thread replies
- Quick replies
- Saved responses
- Help center integration
- News & updates section
- Typing indicators
- Sound notifications
- Dark mode support
- Mobile-responsive design
- Multi-language support
- Department routing
- Analytics tracking

## Installation

```bash
npm install @zephyr/chat-widget
```

## Basic Usage

```tsx
import { ChatWidget } from '@zephyr/chat-widget';

function App() {
  return (
    <ChatWidget
      apiEndpoint="https://api.your-domain.com"
      userIdentity={{
        id: "user123",
        name: "John Doe",
        email: "john@example.com"
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| position | 'bottom-right' \| 'bottom-left' | 'bottom-right' | Widget position on screen |
| offset | number | 20 | Distance from screen edge |
| headerText | string | 'Support Team' | Text shown in widget header |
| primaryColor | string | '#000000' | Primary theme color |
| textColor | string | '#ffffff' | Text color for primary elements |
| showNotificationBadge | boolean | true | Show unread message count |
| notificationCount | number | 0 | Number of unread messages |
| bubbleAnimation | boolean | true | Enable bubble animation |
| mobileFullScreen | boolean | false | Full screen on mobile |
| soundEnabled | boolean | true | Enable sound notifications |
| darkMode | boolean | false | Enable dark mode |
| enableDepartmentRouting | boolean | true | Enable department selection |
| enableAnalytics | boolean | true | Enable usage analytics |
| enableCannedResponses | boolean | true | Enable saved responses |
| enableMultilingualSupport | boolean | true | Enable language selection |
| userIdentity | object | undefined | User identification data |
| apiEndpoint | string | undefined | API endpoint URL |
| onMessageSend | function | undefined | Message send callback |
| onFileUpload | function | undefined | File upload callback |
| enableTypingPreview | boolean | true | Show typing indicators |
| quickReplies | array | [] | Quick reply suggestions |
| savedResponses | array | [] | Saved response templates |
| onArticleView | function | undefined | Help article view callback |
| onNewsRead | function | undefined | News item read callback |
| helpArticles | array | [] | Help center articles |
| newsItems | array | [] | News and updates |
| showSatisfactionSurvey | boolean | true | Show satisfaction survey |
| companyName | string | 'Support Team' | Company name |
| agentName | string | 'Sarah' | Default agent name |
| agentAvatar | string | undefined | Default agent avatar URL |

## Events

### onMessageSend
Called when a message is sent.

```tsx
function handleMessageSend(message: string) {
  console.log('Message sent:', message);
}

<ChatWidget onMessageSend={handleMessageSend} />
```

### onFileUpload
Called when a file is uploaded.

```tsx
function handleFileUpload(file: File) {
  console.log('File uploaded:', file.name);
}

<ChatWidget onFileUpload={handleFileUpload} />
```

### onArticleView
Called when a help article is viewed.

```tsx
function handleArticleView(articleId: string) {
  console.log('Article viewed:', articleId);
}

<ChatWidget onArticleView={handleArticleView} />
```

### onNewsRead
Called when a news item is read.

```tsx
function handleNewsRead(newsId: string) {
  console.log('News item read:', newsId);
}

<ChatWidget onNewsRead={handleNewsRead} />
```

## Styling

The component uses Tailwind CSS for styling and can be customized using the following methods:

1. Theme colors through props
2. CSS variables for fine-tuning
3. Tailwind class overrides
4. Custom CSS modules

Example of custom styling:

```css
:root {
  --zephyr-primary: #000000;
  --zephyr-text: #ffffff;
  --zephyr-bg: #ffffff;
  --zephyr-border: #e2e8f0;
  --zephyr-hover: #f7fafc;
}
```

## Best Practices

1. Always provide user identification when possible
2. Use appropriate color contrast for accessibility
3. Keep quick replies concise
4. Organize help articles by category
5. Test thoroughly on mobile devices
6. Consider implementing rate limiting
7. Handle errors gracefully
8. Cache responses when appropriate
9. Monitor analytics for usage patterns
10. Keep content up to date

## Examples

### With Department Routing

```tsx
<ChatWidget
  enableDepartmentRouting={true}
  departments={[
    { id: 'sales', name: 'Sales' },
    { id: 'support', name: 'Technical Support' },
    { id: 'billing', name: 'Billing' }
  ]}
/>
```

### With Quick Replies

```tsx
<ChatWidget
  quickReplies={[
    { id: '1', text: 'How do I get started?', category: 'general' },
    { id: '2', text: 'Pricing information', category: 'sales' },
    { id: '3', text: 'Report an issue', category: 'support' }
  ]}
/>
```

### With Help Articles

```tsx
<ChatWidget
  helpArticles={[
    {
      id: '1',
      title: 'Getting Started Guide',
      content: '...',
      category: 'Basics',
      views: 1234
    },
    {
      id: '2',
      title: 'API Documentation',
      content: '...',
      category: 'Development',
      views: 567
    }
  ]}
/>
``` 