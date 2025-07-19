import ChatWidget from "./ChatWidget";

const defaultTheme = {
  primaryColor: '#3B82F6',
  secondaryColor: '#EFF6FF',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  botMessageColor: '#F3F4F6',
  userMessageColor: '#3B82F6',
  headerColor: '#1F2937',
  buttonColor: '#3B82F6',
  companyName: 'Your Company',
  companyLogo: '',
  welcomeMessage: 'Hello! How can I help you today?',
};

interface AppProps {
  clientKey?: string;
  customUserId?: string;
  apiUrl?: string;
  theme?: typeof defaultTheme;
}

function App({ clientKey, customUserId, apiUrl, theme }: AppProps) {
  const _clientKey = clientKey || "demo-key";
  const _customUserId = customUserId || "demo-user";
  const _apiUrl = apiUrl || "http://localhost:5000/api";
  return (
    <>
      <ChatWidget 
        theme={theme || defaultTheme}
        clientKey={_clientKey}
        customUserId={_customUserId}
        apiUrl={_apiUrl}
      />
    </>
  );
}

export default App;
