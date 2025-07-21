import { useState } from "react";
import { Check, Mail } from "lucide-react";
import { motion } from "framer-motion";
import type { ChatbotTheme } from "./ChatWidget";

const EmailCollector: React.FC<{
  onEmailCollected: (email: string) => void;
  theme: ChatbotTheme;
}> = ({ onEmailCollected, theme }) => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const setUserEmail = (email: string) => {
    localStorage.setItem("userEmail", email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setIsValid(false);
      return;
    }
    setUserEmail(email);
    setIsSubmitted(true);
    onEmailCollected(email);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          padding: "20px",
          textAlign: "center",
          color: theme.textColor,
        }}
      >
        <Check size={24} color={theme.primaryColor} style={{ marginBottom: "8px" }} />
        <div style={{ fontSize: "14px", fontWeight: "500" }}>Email saved successfully!</div>
        <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>You can now start chatting</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: "20px",
        borderBottom: `1px solid ${theme.primaryColor}20`,
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
          color: theme.textColor,
        }}
      >
        <Mail size={16} color={theme.primaryColor} />
        <span style={{ fontSize: "14px", fontWeight: "500" }}>
          Welcome! Please enter your email to continue
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="your.email@example.com"
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            border: `1px solid ${isValid ? theme.primaryColor + "20" : "#ef4444"}`,
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
            fontSize: "14px",
            outline: "none",
            marginBottom: "8px",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        />
        {!isValid && (
          <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>
            Please enter a valid email address
          </div>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: theme.primaryColor,
            color: "white",
            border: "none",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </form>
      <div
        style={{
          fontSize: "11px",
          opacity: 0.6,
          marginTop: "8px",
          textAlign: "center",
          color: theme.textColor,
        }}
      >
        We'll use this to save your conversation history
      </div>
    </motion.div>
  );
};

export default EmailCollector; 