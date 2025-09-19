import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, X, MoreVertical } from "lucide-react";
import axios from "axios";
import EmailCollector from "./EmailCollector";

interface UserInfo {
  name: string;
  email: string;
  mobile: string;
}
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

const BackEndURL = "https://customer-support-chatbot-backend-oqjr.onrender.com";

const ChatWidget: React.FC<ChatWidgetProps> = ({
  theme,
  clientKey,
  apiUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: theme.welcomeMessage,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<"welcome" | "email" | "chat">("welcome");

  const faqs = [
    { question: "My IVF cycle failed. What now?" },
    { question: "I am trying to get pregnant" },
    { question: "I need medical advice" },
  ];

  const actions = [
    {
      label: "Book consultation call",
      onClick: () => alert("Consultation booked"),
    },
    {
      label: "Buy self-insemination kit",
      onClick: () => alert("Kit purchased"),
    },
    {
      label: "Read our IVF comic book free!",
      onClick: () => alert("Comic opened"),
    },
  ];

  // Scroll to bottom when new message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && step === "chat") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, step]);

  // Update unread count
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.isBot) {
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [messages, isOpen]);

  const generateSessionId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const handleEmailCollected = ({ name, email, mobile }: UserInfo) => {
    setUserEmail(email);
    setStep("chat");
    const sid = generateSessionId();
    setSessionId(sid);

    axios.post(
      `${apiUrl || BackEndURL}/api/conversations/create-conversation`,
      {
        clientKey,
        userName: name,
        userEmail: email,
        userMobile: mobile,
        sessionId: sid,
        message: theme.welcomeMessage,
        isBot: true,
      }
    );
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((msgs) => [...msgs, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      await axios.post(
        `${apiUrl || BackEndURL}/api/conversations/create-conversation`,
        {
          clientKey,
          userEmail,
          sessionId,
          message: userMessage.text,
          isBot: false,
        }
      );

      const response = await axios.post(
        `${apiUrl || BackEndURL}/api/chat/chatResponse`,
        { clientKey, message: userMessage.text, userEmail, sessionId }
      );

      const botResponse: Message = {
        id: Date.now() + 1,
        text: response.data.response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((msgs) => [...msgs, botResponse]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + 2,
          text: "Sorry, there was an error contacting the chatbot.",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getPositionStyles = () => ({
    position: "fixed" as const,
    bottom: isOpen ? 64 : 24,
    right: 24,
    zIndex: 50,
  });

  const ChatToggleButton = () => (
    <motion.button
      onClick={() => {
        setIsOpen((open) => !open);
        if (!isOpen) setUnreadCount(0);
      }}
      className={`relative flex items-center justify-center ${
        isOpen ? "w-15 h-15" : "w-20 h-20"
      } rounded-full shadow-lg text-white`}
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
      }}
    >
      {/* Closed state → show logo + badge */}
      {!isOpen && (
        <>
          <div className="relative w-full h-full">
            <img
              src={theme.companyLogo || "https://avatar.iran.liara.run/public"}
              alt="Logo"
              className="w-full h-full object-cover rounded-full border border-white shadow"
              onError={(e) => {
                e.currentTarget.src = "/default-logo.png"; // ✅ fallback
              }}
            />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </div>
        </>
      )}

      {/* Open state → show close icon */}
      {isOpen && <X className="w-6 h-6" />}
    </motion.button>
  );

  if (!isOpen) {
    return (
      <div style={getPositionStyles()}>
        <ChatToggleButton />
      </div>
    );
  }

  return (
    <div style={getPositionStyles()}>
      <div className="fixed bottom-0 right-6 z-50 ">
        <ChatToggleButton />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-sm rounded-2xl shadow-lg overflow-hidden flex flex-col"
        style={{
          background: theme.backgroundColor,
          marginTop: 16,
          width: 350,
          height: "calc(100vh - 300px)",
        }}
      >
        {/* Header */}
        <div
          className="p-2 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative inline-block">
              <img
                src={
                  theme.companyLogo || "https://avatar.iran.liara.run/public"
                }
                alt="Logo"
                className="w-12 h-12 rounded-full border border-white shadow"
                onError={(e) => {
                  e.currentTarget.src = "/default-logo.png"; // ✅ fallback if broken
                }}
              />
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <h3 className="font-semibold text-white text-lg tracking-wide">
                {theme.companyName}
              </h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                Online now
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ActionDropdown actions={actions} />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded"
              title="Close"
            >
              <X size={24} color="#fff" />
            </button>
          </div>
        </div>

        {/* STEP: WELCOME */}
        {step === "welcome" && (
          <div
            className="relative flex-1 p-4 overflow-y-auto text-center"
            style={{
              background: `linear-gradient(45deg, 
    ${theme.primaryColor}99 0%,   /* 60% opacity */
    ${theme.secondaryColor}80 60%, 
    rgba(255,255,255,0.6) 100%
  )`,
              backdropFilter: "blur(12px)", // glass blur
              WebkitBackdropFilter: "blur(12px)", // Safari support
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              width: "100%",
              height: "100%",
            }}
          >
            <h2 className="text-xl font-bold mb-2">
              Hi there 👋 <br /> How can we help?
            </h2>

            {/* FAQs */}
            <div className="bg-white rounded-xl shadow p-2 mb-4">
              <h3 className="bg-black text-white  p-2 rounded-md text-sm text-left shadow-2xl ">
                FAQs
              </h3>
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setStep("email");
                    setMessages((msgs) => {
                      const newMessage: Message = {
                        id: Date.now(),
                        text: faq.question,
                        isBot: false,
                        timestamp: new Date(),
                      };
                      return [...msgs, newMessage];
                    });
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b last:border-0"
                >
                  {faq.question}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="bg-white p-4 space-y-2 mb-4 rounded-2xl border  ">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  className="w-full border rounded-xl py-2 px-3 text-sm bg-white hover:bg-gray-100"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Support */}
            <button
              onClick={() => setStep("email")}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-black text-white p-4 rounded-lg text-sm font-medium "
            >
              Send us a message
            </button>
          </div>
        )}

        {/* STEP: EMAIL */}
        {step === "email" && (
          <EmailCollector
            onInfoCollected={handleEmailCollected}
            theme={theme}
          />
        )}

        {/* STEP: CHAT */}
        {step === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isBot ? "justify-start" : "justify-end"
                  } gap-2`}
                >
                  <div
                    className="max-w-xs p-3 rounded-lg text-sm shadow"
                    style={{
                      background: msg.isBot
                        ? theme.botMessageColor
                        : theme.userMessageColor,
                      color: msg.isBot ? theme.textColor : "#fff",
                    }}
                  >
                    {msg.text}
                    <div className="text-[10px] text-gray-400 mt-1 text-right">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg text-sm">Typing...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-lg border focus:outline-none text-sm"
              />
              <button
                onClick={sendMessage}
                className="p-2 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                }}
              >
                <Send size={18} color="#fff" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ChatWidget;

const ActionDropdown = ({
  actions,
}: {
  actions: { label: string; onClick: () => void }[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Menu Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1 hover:bg-white/10 rounded"
        title="Menu"
      >
        <MoreVertical size={24} color="#fff" />
      </button>
      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded shadow-lg z-50 flex flex-col">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
              className="px-4 py-2 text-left hover:bg-gray-100 border-b last:border-0"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
