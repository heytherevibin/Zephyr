import { useState } from 'react';
import Head from 'next/head';
import { ChatWidget } from '../src/components/ChatWidget';

export default function Home() {
  const [widgetConfig, setWidgetConfig] = useState({
    // Enable all professional features
    enableDepartmentRouting: true,
    enableAnalytics: true,
    enableCannedResponses: true,
    showSatisfactionSurvey: false,
    enableMultilingualSupport: true,
    // Mock API endpoint for demo purposes
    apiEndpoint: '/api/chat',
    // User identity
    userIdentity: { id: 'user-12345', name: 'Demo User', email: 'demo@example.com' }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Zephyr Chat | Professional Chat SaaS</title>
        <meta name="description" content="Professional multi-department chat solution" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Zephyr Chat</h1>
        <p className="text-lg text-center mb-12 max-w-2xl mx-auto">
          Professional chat solution with multi-department routing, customer satisfaction surveys, 
          analytics tracking, and more.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Enable Features</h2>
            <div className="space-y-3">
              <FeatureToggle
                label="Multi-Department Routing"
                isEnabled={widgetConfig.enableDepartmentRouting}
                onChange={() => setWidgetConfig(prev => ({ 
                  ...prev, 
                  enableDepartmentRouting: !prev.enableDepartmentRouting 
                }))}
              />
              <FeatureToggle
                label="Analytics Tracking"
                isEnabled={widgetConfig.enableAnalytics}
                onChange={() => setWidgetConfig(prev => ({ 
                  ...prev, 
                  enableAnalytics: !prev.enableAnalytics 
                }))}
              />
              <FeatureToggle
                label="Canned Responses"
                isEnabled={widgetConfig.enableCannedResponses}
                onChange={() => setWidgetConfig(prev => ({ 
                  ...prev, 
                  enableCannedResponses: !prev.enableCannedResponses 
                }))}
              />
              <FeatureToggle
                label="Multilingual Support"
                isEnabled={widgetConfig.enableMultilingualSupport}
                onChange={() => setWidgetConfig(prev => ({ 
                  ...prev, 
                  enableMultilingualSupport: !prev.enableMultilingualSupport 
                }))}
              />
              <button
                onClick={() => setWidgetConfig(prev => ({ 
                  ...prev, 
                  showSatisfactionSurvey: !prev.showSatisfactionSurvey 
                }))}
                className="w-full mt-3 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Show Satisfaction Survey
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">How To Use</h2>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Click the chat bubble in the bottom-right corner to open the chat</li>
              <li>If Department Routing is enabled, you'll see department options</li>
              <li>Send messages to see delivery status indicators</li>
              <li>Use the paperclip icon to attach files</li>
              <li>Use the emoji icon to add emojis</li>
              <li>Close and reopen the chat to see persistent history</li>
              <li>Click the three dots menu for more options</li>
            </ol>
          </div>
        </div>
      </main>

      {/* Professional Chat Widget with all features enabled */}
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
        darkMode={false}
        // All professional features
        enableDepartmentRouting={widgetConfig.enableDepartmentRouting}
        enableAnalytics={widgetConfig.enableAnalytics}
        enableCannedResponses={widgetConfig.enableCannedResponses}
        enableMultilingualSupport={widgetConfig.enableMultilingualSupport}
        userIdentity={widgetConfig.userIdentity}
        apiEndpoint={widgetConfig.apiEndpoint}
        onMessageSend={(msg) => console.log("Message sent:", msg)}
        showSatisfactionSurvey={widgetConfig.showSatisfactionSurvey}
      />
    </div>
  );
}

// Simple toggle component for feature controls
const FeatureToggle = ({ label, isEnabled, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          isEnabled ? 'bg-blue-600' : 'bg-gray-200'
        } transition-colors`}
      >
        <span
          className={`${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    </div>
  );
};