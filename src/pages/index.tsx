import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ChatWidget from '../components/ChatWidget';
import { MessageSquare, Users, BarChart2, Github, ArrowRight, CheckCircle2, Zap, Shield, Globe, Bell, Settings, Code } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';
import { FeatureToggle } from '../components/FeatureToggle';

interface AnimatedElement {
  width: number;
  height: number;
  left: number;
  top: number;
  animationDuration: number;
  animationDelay: number;
}

const features = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Smart Routing",
    description: "Automatically route conversations to the right department based on context and expertise.",
    color: "text-blue-400 group-hover:text-blue-300",
    bgColor: "bg-blue-400/10 group-hover:bg-blue-400/20",
    borderColor: "group-hover:border-blue-400/50"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-Powered Responses",
    description: "Leverage AI to provide instant, accurate responses to common customer queries.",
    color: "text-indigo-400 group-hover:text-indigo-300",
    bgColor: "bg-indigo-400/10 group-hover:bg-indigo-400/20",
    borderColor: "group-hover:border-indigo-400/50"
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Real-time Analytics",
    description: "Track performance metrics and gain insights to improve your support operations.",
    color: "text-emerald-400 group-hover:text-emerald-300",
    bgColor: "bg-emerald-400/10 group-hover:bg-emerald-400/20",
    borderColor: "group-hover:border-emerald-400/50"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multilingual Support",
    description: "Serve customers in their preferred language with automatic translation.",
    color: "text-purple-400 group-hover:text-purple-300",
    bgColor: "bg-purple-400/10 group-hover:bg-purple-400/20",
    borderColor: "group-hover:border-purple-400/50"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance with industry standards.",
    color: "text-rose-400 group-hover:text-rose-300",
    bgColor: "bg-rose-400/10 group-hover:bg-rose-400/20",
    borderColor: "group-hover:border-rose-400/50"
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Easy Integration",
    description: "Seamlessly integrate with your existing tools and workflows.",
    color: "text-amber-400 group-hover:text-amber-300",
    bgColor: "bg-amber-400/10 group-hover:bg-amber-400/20",
    borderColor: "group-hover:border-amber-400/50"
  }
];

const GridBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),rgba(17,24,39,1))]"></div>
    <div className="absolute inset-0">
      <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
  </div>
);

export default function Home() {
  const [widgetConfig, setWidgetConfig] = useState({
    enableDepartmentRouting: true,
    enableAnalytics: true,
    enableCannedResponses: true,
    showSatisfactionSurvey: false,
    enableMultilingualSupport: true,
    apiEndpoint: '/api/chat',
    userIdentity: { id: 'user-12345', name: 'Demo User', email: 'demo@example.com' }
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [animatedElements, setAnimatedElements] = useState<AnimatedElement[]>([]);

  useEffect(() => {
    setIsVisible(true);
    
    const elements = Array(20).fill(null).map(() => ({
      width: Math.random() * 300 + 50,
      height: Math.random() * 300 + 50,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: Math.random() * 10 + 5,
      animationDelay: Math.random() * 5
    }));
    setAnimatedElements(elements);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      <GridBackground />

      <Head>
        <title>Zephyr Chat | Enterprise-Grade Chat Solution</title>
        <meta name="description" content="Transform your customer support with AI-powered responses, multi-department routing, and real-time analytics." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
                Transform Your Customer Support with
                <span className="text-blue-400 neon-text"> Zephyr Chat</span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Enterprise-grade chat solution with AI-powered responses, multi-department routing, and real-time analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-4 font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></span>
                </Link>
                <a href="https://github.com/yourusername/zephyr" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center px-8 py-4 font-medium rounded-lg text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-gray-600">
                  <Github className="mr-2 h-5 w-5 relative z-10" />
                  <span className="relative z-10">View on GitHub</span>
                  <span className="absolute inset-0 rounded-lg bg-gray-700 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Powerful Features for Modern Support</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to provide exceptional customer support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group feature-card"
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className={`feature-icon ${feature.bgColor}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${feature.color}`}>{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Try It Now</h2>
              <p className="text-xl text-gray-300">
                Experience the power of Zephyr Chat with our live demo
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20"
                style={{ 
                  transitionDelay: '600ms',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <h3 className="text-xl font-semibold mb-6 text-blue-400">Enable Features</h3>
                <div className="space-y-5">
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
                  <FeatureToggle
                    label="Notification Sounds"
                    isEnabled={soundEnabled}
                    onChange={() => setSoundEnabled(prev => !prev)}
                  />
                </div>
              </div>
              
              <div 
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20"
                style={{ 
                  transitionDelay: '700ms',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <h3 className="text-xl font-semibold mb-6 text-purple-400">Quick Start Guide</h3>
                <ol className="space-y-5">
                  <li className="flex items-start group">
                    <div className="p-1 bg-green-500/20 rounded-full mr-4 group-hover:bg-green-500/30 transition-colors duration-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Click the chat bubble in the bottom-right corner</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-1 bg-green-500/20 rounded-full mr-4 group-hover:bg-green-500/30 transition-colors duration-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Select a department or start a conversation</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-1 bg-green-500/20 rounded-full mr-4 group-hover:bg-green-500/30 transition-colors duration-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Send messages and see real-time responses</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-1 bg-green-500/20 rounded-full mr-4 group-hover:bg-green-500/30 transition-colors duration-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Try file attachments and emoji reactions</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Access Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Administration Tools</h2>
              <p className="text-xl text-gray-300">
                Powerful tools to manage your chat operations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/dashboard" className="block">
                <div 
                  className="group bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1"
                  style={{ 
                    transitionDelay: '900ms',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-300">
                      <MessageSquare className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium ml-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">Help Desk</h3>
                  </div>
                  <p className="text-gray-300 text-sm">Manage conversations and support requests</p>
                  <div className="mt-4 flex items-center text-blue-400 text-sm font-medium">
                    Access Dashboard
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              <Link href="/admin" className="block">
                <div 
                  className="group bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-1"
                  style={{ 
                    transitionDelay: '1000ms',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors duration-300">
                      <Users className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium ml-3 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">Admin Panel</h3>
                  </div>
                  <p className="text-gray-300 text-sm">Platform-wide management and settings</p>
                  <div className="mt-4 flex items-center text-indigo-400 text-sm font-medium">
                    Access Admin
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              <div 
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                style={{ 
                  transitionDelay: '1100ms',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Code className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium ml-3 text-green-400">API Access</h3>
                </div>
                <p className="text-gray-300 text-sm">Integrate with your existing systems</p>
                <div className="mt-4 text-gray-400 text-sm font-medium">Documentation Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-md text-gray-300 py-12 relative z-10 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center space-x-8 mb-8">
              <a href="https://github.com/yourusername/zephyr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform">
                <Github className="w-6 h-6" />
              </a>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform">
                <MessageSquare className="w-6 h-6" />
              </Link>
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform">
                <Settings className="w-6 h-6" />
              </Link>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} Zephyr Chat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget
        position="bottom-right"
        offset={20}
        headerText="Support Team"
        primaryColor="#3B82F6"
        textColor="#ffffff"
        showNotificationBadge={true}
        notificationCount={0}
        bubbleAnimation={true}
        mobileFullScreen={true}
        soundEnabled={soundEnabled}
        darkMode={true}
        enableDepartmentRouting={widgetConfig.enableDepartmentRouting}
        enableAnalytics={widgetConfig.enableAnalytics}
        enableCannedResponses={widgetConfig.enableCannedResponses}
        enableMultilingualSupport={widgetConfig.enableMultilingualSupport}
        userIdentity={widgetConfig.userIdentity}
        apiEndpoint={widgetConfig.apiEndpoint}
        enableTypingPreview={true}
        quickReplies={[]}
        savedResponses={[]}
        helpArticles={[]}
        newsItems={[
          { 
            id: '2', 
            title: 'Platform Maintenance', 
            content: 'Scheduled maintenance notice...',
            date: new Date(),
            category: 'maintenance',
            image: '/maintenance.svg',
            link: '/news/maintenance'
          }
        ]}
        showSatisfactionSurvey={widgetConfig.showSatisfactionSurvey}
      />

      {/* Custom styles for animations and effects */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s ease infinite;
        }
        
        .neon-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.2);
        }
        
        /* Parallax effect for background elements */
        .parallax {
          transform: translateZ(-1px) scale(2);
          z-index: -1;
        }
        
        /* Glass morphism effect */
        .glass {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        /* Hover effects for cards */
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}