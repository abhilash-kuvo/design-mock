import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'auth';
  content: string;
  timestamp: Date;
  attachedFiles?: AttachedFile[];
  details?: string[];
  isExpanded?: boolean;
  isCollapsible?: boolean;
  hasDownload?: boolean;
  downloadFileName?: string;
  csvContentData?: string;
  showApprovalButtons?: boolean;
  showAuthButtons?: boolean;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addUserMessage: (content: string, attachedFiles?: AttachedFile[]) => void;
  clearMessages: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string, attachedFiles?: AttachedFile[]) => {
    addMessage({
      type: 'user',
      content,
      attachedFiles,
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      addMessage,
      addUserMessage,
      clearMessages,
      setMessages,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};