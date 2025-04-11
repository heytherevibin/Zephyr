import React, { useState, useEffect } from 'react';
import { 
  Search, Inbox, Users, User, Settings, MessageSquare, Phone, Video, 
  Monitor, Mic, MicOff, PhoneOff, Clock, Paperclip, Image, Smile, 
  Send, ChevronDown, PlusCircle, ArrowRight, Calendar, Star,
  AlertCircle, CheckCircle, Filter, MoreVertical, BarChart2, LifeBuoy, 
  FileText, X, ArrowLeft, Copy, Edit, Trash2, RefreshCcw, EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  // State management
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentTab, setCurrentTab] = useState('inbox');
  const [userPanelOpen, setUserPanelOpen] = useState(true);
  const [activeCall, setActiveCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIOptions, setShowAIOptions] = useState(false);
  
  // Demo conversations for the interface
  const conversations = [
    {
      id: 'TKT-2546',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        company: 'Acme Inc.',
        timezone: 'PST (UTC-8)',
        firstContact: '2025-03-28T14:23:01Z',
        totalConversations: 12
      },
      subject: 'Integration with CRM software',
      preview: 'Hi there, I\'m trying to integrate your chat widget with our HubSpot CRM but...',
      unread: true,
      priority: 'high',
      status: 'open',
      agent: {
        name: 'Alex Rivera',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      },
      team: 'Technical Support',
      lastUpdate: '2025-04-11T09:45:12Z',
      tags: ['integration', 'crm', 'api'],
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'Hi there, I\'m trying to integrate your chat widget with our HubSpot CRM but I\'m running into some API connection issues. The documentation mentions a webhook setup, but I can\'t seem to find where to configure this in our admin panel.',
          time: '2025-04-11T09:30:12Z',
          read: true,
        },
        {
          id: 2, 
          sender: 'agent',
          text: 'Hello Sarah, thank you for reaching out. I\'d be happy to help you with the HubSpot integration. The webhook configuration can be found under Settings > Integrations > API Connections. Could you tell me which version of the widget you\'re currently using?',
          time: '2025-04-11T09:45:12Z',
          read: false,
        }
      ],
      relatedTickets: ['TKT-2190', 'TKT-1834']
    },
    {
      id: 'TKT-2545',
      customer: {
        name: 'David Chen',
        email: 'd.chen@techforward.io',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        company: 'TechForward',
        timezone: 'EST (UTC-5)',
        firstContact: '2024-11-15T10:08:22Z',
        totalConversations: 5
      },
      subject: 'Mobile responsiveness issue',
      preview: 'When I open the chat on my iPhone 15 Pro Max, the text gets cut off...',
      unread: false,
      priority: 'medium',
      status: 'pending',
      agent: {
        name: 'Morgan Taylor',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      },
      team: 'Product Support',
      lastUpdate: '2025-04-10T16:22:45Z',
      tags: ['mobile', 'responsive', 'iphone'],
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'When I open the chat on my iPhone 15 Pro Max, the text gets cut off on the right side of the screen. This only happens in landscape mode. I\'ve attached a screenshot for reference.',
          time: '2025-04-10T15:12:33Z',
          read: true,
          attachments: [{
            name: 'screenshot.png',
            type: 'image',
            url: '#'
          }]
        },
        {
          id: 2, 
          sender: 'agent',
          text: 'Hi David, I\'m sorry to hear about this issue. Thank you for the screenshot, that\'s very helpful. Our team is aware of this bug with landscape mode on newer iPhone models and we\'re working on a fix in our next release (v2.8.5) scheduled for next week. In the meantime, would using portrait mode work as a temporary solution for you?',
          time: '2025-04-10T16:22:45Z',
          read: true,
        }
      ]
    },
    {
      id: 'TKT-2544',
      customer: {
        name: 'Emma Rodriguez',
        email: 'emma.r@greenstart.org',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        company: 'GreenStart Foundation',
        timezone: 'CET (UTC+1)',
        firstContact: '2025-01-18T09:45:22Z',
        totalConversations: 3
      },
      subject: 'Chat transcript export',
      preview: 'Our compliance team needs to archive all chat conversations from last quarter...',
      unread: true,
      priority: 'low',
      status: 'open',
      agent: null,
      team: 'Customer Success',
      lastUpdate: '2025-04-11T08:17:22Z',
      tags: ['export', 'compliance', 'data'],
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'Our compliance team needs to archive all chat conversations from last quarter for our annual audit. Is there a way to batch export all transcripts from January through March 2025? We need them in a searchable format, preferably PDF.',
          time: '2025-04-11T08:17:22Z',
          read: false,
        }
      ]
    }
  ];

  // Set first conversation as selected by default when component mounts
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, []);

  // AI response suggestions (simulated)
  const aiSuggestions = [
    "I understand you're having trouble with the HubSpot integration. Let me walk you through the webhook setup process step by step.",
    "I'd be happy to help troubleshoot the API connection issues. First, let's verify your API keys are correctly configured.",
    "Thank you for providing that information. Based on your current setup, here's how you can establish the CRM integration:"
  ];

  // Handler for starting a call
  const handleStartCall = (type) => {
    setActiveCall({
      type: type, // 'audio' or 'video'
      duration: 0,
      started: new Date(),
      with: selectedConversation.customer,
      recording: false,
      muted: false,
      screenshare: false
    });
  };

  // Handler for ending a call
  const handleEndCall = () => {
    setActiveCall(null);
  };

  // Handler for toggling user details panel
  const toggleUserPanel = () => {
    setUserPanelOpen(!userPanelOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Main navigation sidebar */}
      <div className="w-16 bg-gray-800 text-white flex flex-col items-center py-6">
        <div className="mb-8 text-2xl font-bold">Z</div>
        
        <nav className="flex flex-col items-center space-y-6">
          <button 
            className={`p-3 rounded-lg ${currentTab === 'inbox' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => setCurrentTab('inbox')}
          >
            <Inbox size={20} />
          </button>
          <button 
            className={`p-3 rounded-lg ${currentTab === 'teams' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => setCurrentTab('teams')}
          >
            <Users size={20} />
          </button>
          <button 
            className={`p-3 rounded-lg ${currentTab === 'teammates' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => setCurrentTab('teammates')}
          >
            <User size={20} />
          </button>
          <button 
            className={`p-3 rounded-lg ${currentTab === 'analytics' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => setCurrentTab('analytics')}
          >
            <BarChart2 size={20} />
          </button>
          <button 
            className={`p-3 rounded-lg ${currentTab === 'knowledge' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => setCurrentTab('knowledge')}
          >
            <LifeBuoy size={20} />
          </button>
        </nav>
        
        <div className="mt-auto">
          <button className="p-3 rounded-lg hover:bg-gray-700">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Secondary navigation */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-gray-100 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-medium text-gray-800">Conversations</h2>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded hover:bg-gray-100">
              <Filter size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100">
              <PlusCircle size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto" style={{height: 'calc(100vh - 129px)'}}>
          {conversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`p-3 border-b border-gray-100 cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={conversation.customer.avatar} 
                      alt={conversation.customer.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    {conversation.status === 'open' && (
                      <span className="absolute bottom-0 right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-sm">{conversation.customer.name}</span>
                    {conversation.unread && (
                      <span className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(conversation.lastUpdate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 truncate max-w-[180px]">{conversation.preview}</p>
                {conversation.priority === 'high' && (
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500" title="High priority"></span>
                )}
                {conversation.priority === 'medium' && (
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-500" title="Medium priority"></span>
                )}
              </div>
              <div className="mt-1 flex items-center">
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{conversation.id}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {conversation.status === 'open' ? 'Open' : 
                   conversation.status === 'pending' ? 'Pending' : 'Resolved'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Ticket header */}
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <h2 className="font-medium">{selectedConversation.subject}</h2>
                  <span className="ml-2 text-sm text-gray-500">#{selectedConversation.id}</span>
                  {selectedConversation.priority === 'high' && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">High Priority</span>
                  )}
                </div>
                <div className="flex text-xs text-gray-500 mt-0.5">
                  <span>{selectedConversation.team}</span>
                  <span className="mx-1">•</span>
                  <span>Created {new Date(selectedConversation.lastUpdate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                {!activeCall && (
                  <>
                    <button 
                      className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      onClick={() => handleStartCall('audio')}
                    >
                      <Phone size={14} className="mr-1" />
                      <span>Call</span>
                    </button>
                    <button 
                      className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      onClick={() => handleStartCall('video')}
                    >
                      <Video size={14} className="mr-1" />
                      <span>Video</span>
                    </button>
                  </>
                )}
                <button className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Active call interface */}
            {activeCall && (
              <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-600 p-2 rounded-full">
                    {activeCall.type === 'video' ? <Video size={16} /> : <Phone size={16} />}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">
                      {activeCall.type === 'video' ? 'Video call' : 'Voice call'} with {activeCall.with.name}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>00:03:45</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
                    <RefreshCcw size={16} />
                  </button>
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
                    {activeCall.muted ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
                    <Monitor size={16} />
                  </button>
                  <button 
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-full"
                    onClick={handleEndCall}
                  >
                    <PhoneOff size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Chat container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {selectedConversation.messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%]`}>
                    <div className="flex items-center mb-1">
                      <img 
                        src={message.sender === 'customer' 
                          ? selectedConversation.customer.avatar 
                          : selectedConversation.agent?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                        alt={message.sender === 'customer' ? selectedConversation.customer.name : selectedConversation.agent?.name || 'Agent'}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-sm font-medium">
                        {message.sender === 'customer' ? selectedConversation.customer.name : selectedConversation.agent?.name || 'You'}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(message.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.sender === 'customer' 
                        ? 'bg-white border border-gray-200' 
                        : 'bg-blue-100'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      {message.attachments?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx} className="bg-gray-100 border border-gray-200 rounded px-2 py-1 text-xs flex items-center">
                              {attachment.type === 'image' ? <Image size={12} className="mr-1" /> : <Paperclip size={12} className="mr-1" />}
                              {attachment.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.sender === 'agent' && (
                      <div className="flex mt-1 space-x-2 justify-end">
                        <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
                          <Edit size={10} className="mr-1" />
                          Edit
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
                          <Copy size={10} className="mr-1" />
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message input area */}
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="min-h-[100px] p-3 focus:outline-none" contentEditable="true"></div>
                
                {/* AI suggestion area */}
                {showAIOptions && (
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">AI SUGGESTIONS</span>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setShowAIOptions(false)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="bg-white p-2 rounded border border-gray-200 text-sm cursor-pointer hover:bg-blue-50">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-2 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="p-1.5 rounded hover:bg-gray-100">
                      <Paperclip size={18} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-100">
                      <Smile size={18} />
                    </button>
                    <button 
                      className="flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => setShowAIOptions(!showAIOptions)}
                    >
                      <span>AI Assist</span>
                      <ChevronDown size={14} className="ml-1" />
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <select className="text-sm border border-gray-200 rounded px-2 py-1 bg-white">
                      <option>Normal</option>
                      <option>Internal Note</option>
                      <option>Template Response</option>
                    </select>
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center">
                      <Send size={14} className="mr-1" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No conversation selected</h3>
              <p className="text-gray-500">Select a conversation from the sidebar to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar - Customer details */}
      {selectedConversation && (
        <motion.div 
          className="bg-white border-l border-gray-200 overflow-y-auto"
          initial={{ width: 320 }}
          animate={{ width: userPanelOpen ? 320 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-medium text-gray-800">Conversation Details</h2>
            <button className="p-1.5 rounded hover:bg-gray-100" onClick={toggleUserPanel}>
              {userPanelOpen ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </button>
          </div>

          {userPanelOpen && (
            <div>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <img 
                    src={selectedConversation.customer.avatar} 
                    alt={selectedConversation.customer.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-medium">{selectedConversation.customer.name}</h3>
                    <p className="text-sm text-gray-500">{selectedConversation.customer.email}</p>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500">Company</span>
                    <span>{selectedConversation.customer.company}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500">Timezone</span>
                    <span>{selectedConversation.customer.timezone}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500">First contact</span>
                    <span>{new Date(selectedConversation.customer.firstContact).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500">Conversations</span>
                    <span>{selectedConversation.customer.totalConversations}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium mb-2">Ticket Information</h3>
                <div className="flex flex-col space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <select className="border-0 p-0 bg-transparent font-medium cursor-pointer">
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Priority</span>
                    <select className="border-0 p-0 bg-transparent font-medium cursor-pointer">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assigned to</span>
                    <div className="flex items-center">
                      {selectedConversation.agent ? (
                        <>
                          <img 
                            src={selectedConversation.agent.avatar} 
                            alt={selectedConversation.agent.name}
                            className="w-5 h-5 rounded-full mr-1"
                          />
                          <span>{selectedConversation.agent.name}</span>
                        </>
                      ) : (
                        <span className="text-blue-600">Assign</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Team</span>
                    <span>{selectedConversation.team}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Tags</h3>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <PlusCircle size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedConversation.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {selectedConversation.relatedTickets?.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium mb-2">Related Tickets</h3>
                  <div className="space-y-2">
                    {selectedConversation.relatedTickets.map(ticketId => (
                      <div key={ticketId} className="bg-gray-50 p-2 rounded text-sm flex items-center">
                        <FileText size={14} className="mr-2 text-gray-500" />
                        <span>{ticketId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4">
                <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
                  <Trash2 size={14} className="mr-1" />
                  Delete conversation
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;