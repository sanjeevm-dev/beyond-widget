import { createRoot } from 'react-dom/client';
import ChatWidget, { type ChatbotTheme } from './ChatWidget';

const DEFAULT_THEME: ChatbotTheme = {
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

async function fetchTheme(clientKey: string): Promise<ChatbotTheme> {
  try {
    const res = await fetch(`http://localhost:5000/api/theme/public/${clientKey}`);
    if (!res.ok) throw new Error('Theme fetch failed');
    const data = await res.json();
    return { ...DEFAULT_THEME, ...data };
  } catch (e) {
    return DEFAULT_THEME;
  }
}

export async function mountCustomerSupportChatbot(domNode: HTMLElement, clientKey: string) {
  const theme = await fetchTheme(clientKey);
  createRoot(domNode).render(<ChatWidget theme={theme} />);
}

// Expose globally for CDN embedding
// @ts-ignore
window.mountCustomerSupportChatbot = mountCustomerSupportChatbot; 