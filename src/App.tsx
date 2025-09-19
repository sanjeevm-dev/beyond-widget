import ChatWidget from "./ChatWidget";
import { useEffect, useState } from "react";

const defaultTheme = {
  id: "modern-blue",
  name: "Modern Blue",
  description:
    "A sophisticated blue theme with perfect contrast and readability",
  primaryColor: "#1d4ed8",
  secondaryColor: "#589ee4",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  borderRadius: "1rem",
  fontSize: "1rem",
  position: "bottom-right",
  headerFooterBgColor: "#589ee4",
  inputContainerBgColor: "#f1f5f9",
  aiMessageBgColor: "#f8fafc",
  userMessageBgColor: "#1d4ed8",
  botMessageColor: "#f8fafc", // matches aiMessageBgColor
  userMessageColor: "#1d4ed8", // matches userMessageBgColor
  headerColor: "#589ee4", // matches headerFooterBgColor
  buttonColor: "#1d4ed8", // matches primaryColor
  companyName: "Your Company",
  companyLogo: "",
  welcomeMessage: "Hello! How can I help you today?",
};

const BackEndURL = "https://customer-support-chatbot-backend-oqjr.onrender.com";

interface AppProps {
  clientKey?: string;
  customUserId?: string;
  apiUrl?: string;
  theme?: typeof defaultTheme;
}

function App({
  clientKey = "3de3d29a-cad0-4ec2-b3e1-922865ac6160",
  customUserId,
  apiUrl,
  theme,
}: AppProps) {
  const _clientKey = clientKey || "demo-key";
  const _customUserId = customUserId || "demo-user";
  const _apiUrl = apiUrl || `${BackEndURL}`;
  const [loadedTheme, setLoadedTheme] = useState<typeof defaultTheme>(
    theme || defaultTheme
  );

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch(`${BackEndURL}/api/theme/public/${_clientKey}`);
        if (!res.ok) throw new Error("Theme fetch failed");
        const data = await res.json();
        setLoadedTheme({ ...defaultTheme, ...data });
      } catch (e) {
        setLoadedTheme(defaultTheme);
      }
    };
    fetchTheme();
  }, [_clientKey]);

  return (
    <>
      <ChatWidget
        theme={loadedTheme}
        clientKey={_clientKey}
        customUserId={_customUserId}
        apiUrl={_apiUrl}
      />
    </>
  );
}

export default App;
