import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, Loader2, Building2, Zap, Thermometer, AlertTriangle, Lightbulb } from 'lucide-react';

const mockResponses = {
  'energy': {
    response: "Based on current data, the Engineering Block has the highest energy usage at 2,100 kWh this month. I recommend implementing the following optimization strategies:\n\n1. Adjust HVAC schedules to reduce consumption during off-peak hours\n2. Install smart sensors to monitor real-time usage\n3. Consider increasing solar panel coverage on the roof",
    suggestions: ['Show detailed energy breakdown', 'Compare with last month', 'Get optimization tips']
  },
  'building': {
    response: "The Main Library is currently showing excellent health with a score of 95%. Key metrics:\n\n- Occupancy: 78%\n- Active sensors: 24\n- Energy efficiency: 85%\n- Last maintenance: 2 days ago",
    suggestions: ['View detailed building info', 'Check maintenance history', 'View sensor data']
  },
  'temperature': {
    response: "Current temperature readings across campus:\n\n- Main Library: 22.5°C (Optimal)\n- Engineering Block: 23.1°C (Optimal)\n- Science Lab: 21.8°C (Optimal)\n- Server Room: 18.2°C (Watch - slightly high)",
    suggestions: ['View temperature trends', 'Set temperature alerts', 'View all sensors']
  },
  'default': {
    response: "I'm your Campus Copilot AI assistant. I can help you with:\n\n🏢 Building Information\n⚡ Energy Analytics\n🔧 Maintenance Predictions\n🚨 Alert Management\n🌡️ Climate Control\n💡 Optimization Suggestions\n\nTry asking questions like:\n- 'Which building has highest energy usage?'\n- 'What's the health status of the Science Lab?'\n- 'Show me temperature alerts'",
    suggestions: ['Show campus overview', 'List all buildings', 'Check active alerts']
  }
};

const quickActions = [
  { icon: Building2, label: 'Building Health', query: 'Show building health status' },
  { icon: Zap, label: 'Energy Usage', query: 'Which building has highest energy usage' },
  { icon: Thermometer, label: 'Temperature', query: 'Show temperature across campus' },
  { icon: AlertTriangle, label: 'Active Alerts', query: 'Show active alerts' },
  { icon: Lightbulb, label: 'Optimizations', query: 'Give me energy optimization tips' }
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your Campus Copilot AI assistant. I can help you monitor and manage your smart campus infrastructure. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('energy')) {
      return mockResponses.energy;
    } else if (lowerInput.includes('building') || lowerInput.includes('health')) {
      return mockResponses.building;
    } else if (lowerInput.includes('temperature') || lowerInput.includes('temp')) {
      return mockResponses.temperature;
    } else if (lowerInput.includes('alert')) {
      return {
        response: "There are currently 5 active alerts:\n\n🔴 2 Critical\n- Server Room Temperature High\n- Water Leakage Risk Detected\n\n🟡 3 Warning\n- Elevator Maintenance Due\n- High Energy Usage\n- HVAC Filter Replacement\n\nWould you like me to help resolve any of these?",
        suggestions: ['Show alert details', 'Acknowledge alerts', 'View alert history']
      };
    }
    return mockResponses.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getBotResponse(input);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        suggestions: response.suggestions,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  const handleQuickAction = (query) => {
    setInput(query);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Chat Assistant</h1>
            <p className="text-gray-500 dark:text-gray-400">Campus Copilot - Your AI helper</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Online
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleQuickAction(action.query)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <action.icon className="w-4 h-4 text-primary-500" />
            <span className="text-sm">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex gap-6">
        {/* Messages */}
        <div className="flex-1 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'bot' 
                      ? 'bg-gradient-to-br from-primary-500 to-cyan-500' 
                      : 'bg-gray-500'
                  }`}>
                    {message.type === 'bot' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className={`p-4 rounded-xl ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'
                    }`}>
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestion(suggestion)}
                            className="text-xs px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full hover:bg-primary-500/20"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me about your campus..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Capabilities Panel */}
        <div className="w-72 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4 hidden lg:block">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            Capabilities
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Building2 className="w-5 h-5 text-primary-500 mb-2" />
              <h4 className="font-medium text-gray-800 dark:text-white text-sm">Building Analytics</h4>
              <p className="text-xs text-gray-500">Health status, occupancy, maintenance</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-500 mb-2" />
              <h4 className="font-medium text-gray-800 dark:text-white text-sm">Energy Insights</h4>
              <p className="text-xs text-gray-500">Usage patterns, optimization tips</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500 mb-2" />
              <h4 className="font-medium text-gray-800 dark:text-white text-sm">Alert Management</h4>
              <p className="text-xs text-gray-500">Real-time alerts, resolution help</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Thermometer className="w-5 h-5 text-blue-500 mb-2" />
              <h4 className="font-medium text-gray-800 dark:text-white text-sm">Climate Monitoring</h4>
              <p className="text-xs text-gray-500">Temperature, humidity, HVAC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
