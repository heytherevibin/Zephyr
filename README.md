# Zephyr Chat Widget

A modern, customizable chat widget for Next.js applications with enterprise features.

## Project Structure

```
zephyr/
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── chat/             # Chat-specific components
│   │   │   ├── constants/    # Chat constants and configurations
│   │   │   ├── hooks/        # Chat-specific React hooks
│   │   │   ├── messages/     # Message-related components
│   │   │   ├── styles/       # Chat-specific styles
│   │   │   ├── tabs/         # Tab components
│   │   │   ├── types.ts      # Chat component types
│   │   │   └── utils/        # Chat-specific utilities
│   │   ├── admin/            # Admin dashboard components
│   │   ├── dashboard/        # User dashboard components
│   │   ├── shared/           # Shared UI components
│   │   ├── ChatWidget.tsx    # Main chat widget component
│   │   └── FeatureToggle.tsx # Feature flag component
│   ├── pages/                # Next.js pages
│   ├── services/             # API and external service integrations
│   ├── store/                # State management
│   │   └── chatStore.ts      # Chat state management
│   ├── styles/               # Global styles
│   ├── types/                # TypeScript type definitions
│   │   ├── enterprise/       # Enterprise feature types
│   │   │   ├── common.ts     # Shared enterprise types
│   │   │   ├── features.ts   # Feature flag types
│   │   │   ├── index.ts      # Enterprise type exports
│   │   │   ├── integrations.ts # Integration types
│   │   │   ├── monitoring.ts # Monitoring types
│   │   │   ├── performance.ts # Performance types
│   │   │   └── security.ts   # Security types
│   │   ├── chat.ts           # Chat-related types
│   │   └── index.ts          # Type exports
│   ├── utils/                # Utility functions
│   └── lib/                  # Third-party library integrations
├── public/                   # Static assets
├── tests/                    # Test files
├── docs/                     # Documentation
├── config/                   # Configuration files
├── .next/                    # Next.js build output
├── node_modules/             # Dependencies
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
```

## Features

- Modern, responsive chat interface
- Real-time messaging
- File attachments
- Typing indicators
- Message reactions
- Threaded conversations
- Enterprise features:
  - Role-based access control
  - Advanced security
  - Performance optimizations
  - Monitoring and analytics
  - Integration capabilities

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zephyr.git

# Navigate to the project directory
cd zephyr

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
```

### Building for Production

```bash
# Build the project
npm run build
# or
yarn build

# Start the production server
npm run start
# or
yarn start
```

## Usage

```tsx
import { ChatWidget } from 'zephyr';

function App() {
  return (
    <ChatWidget
      position="bottom-right"
      primaryColor="#4F46E5"
      companyName="Your Company"
      agentName="Support Agent"
    />
  );
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.