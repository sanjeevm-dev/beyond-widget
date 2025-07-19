import React, { useState } from 'react';

export interface ChatbotTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  botMessageColor: string;
  userMessageColor: string;
  headerColor: string;
  buttonColor: string;
  companyName: string;
  companyLogo: string;
  welcomeMessage: string;
}

interface ChatWidgetProps {
  theme: ChatbotTheme;
  clientKey?: string;
  customUserId?: string;
  apiUrl?: string;
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const SendIcon = ({ color = 'currentColor', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22,2 15,22 11,13 2,9"></polygon></svg>
);
const Minimize2Icon = ({ color = 'currentColor', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a1 1 0 0 1-1 1H4"/><path d="M16 3v3a1 1 0 0 0 1 1h3"/><path d="M8 21v-3a1 1 0 0 0-1-1H4"/><path d="M16 21v-3a1 1 0 0 1 1-1h3"/></svg>
);
const XIcon = ({ color = 'currentColor', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const ChatWidget: React.FC<ChatWidgetProps> = ({ theme, clientKey, customUserId, apiUrl }) => {
  const _clientKey = clientKey || "demo-key";
  const _customUserId = customUserId || "demo-user";
  const _apiUrl = apiUrl || "https://api.example.com";
  // Example usage: log the props
  React.useEffect(() => {
    console.log('ChatWidget mounted with:', { _clientKey, _customUserId, _apiUrl });
  }, [_clientKey, _customUserId, _apiUrl]);

  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: theme.welcomeMessage,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    const botResponse: Message = {
      id: Date.now() + 1,
      text: "This is a preview response. Your actual chatbot will use AI to respond based on your FAQs.",
      isBot: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, botResponse]);
    setInputValue('');
  };

  if (!isOpen) {
    return (
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: theme.buttonColor }}
        >
          💬
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden" style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      {/* Header */}
      <div
        className="p-4 text-white flex items-center justify-between"
        style={{ backgroundColor: theme.headerColor }}
      >
        <div className="flex items-center space-x-3">
          {theme.companyLogo && (
            <img
              src={theme.companyLogo}
              alt="Logo"
              className="w-8 h-8 rounded-full"
              onError={e => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div>
            <h3 className="font-semibold">{theme.companyName}</h3>
            <p className="text-sm opacity-75">Online now</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded">
            <Minimize2Icon color="#fff" size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <XIcon color="#fff" size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="h-80 overflow-y-auto p-4 space-y-3"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-sm`}
              style={{
                backgroundColor: message.isBot ? theme.botMessageColor : theme.userMessageColor,
                color: message.isBot ? theme.textColor : '#FFFFFF',
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="p-2 text-white rounded-lg hover:opacity-80 transition duration-200"
            style={{ backgroundColor: theme.buttonColor }}
          >
            <SendIcon color="#fff" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget; 