import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ArrowRight, Paperclip, Loader2, Play, ChevronDown, ChevronUp, CheckCircle, MessageSquare, Shield, ExternalLink, Upload } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import AgentSelector from '../components/dashboard/AgentSelector';
import FileChip from '../components/ui/FileChip';
import CsvDataTable from '../components/ui/CsvDataTable';
import SystemLogHistoryPanel from '../components/SystemLogHistoryPanel';
import { useChat, AttachedFile, ChatMessage } from '../contexts/ChatContext';

interface SystemLogEntry {
  id: string;
  message: string;
  timestamp: Date;
}

interface ChatPageProps {
  initialQuery: string;
  runningPlaybookId?: string;
  onBack: () => void;
  onNewPlaybook: () => void;
  onMyPlaybooks: () => void;
  onNavigateToConnectedAccounts: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ 
  initialQuery, 
  runningPlaybookId,
  onBack, 
  onNewPlaybook, 
  onMyPlaybooks,
  onNavigateToConnectedAccounts
}) => {
  // ... [rest of the component code remains exactly the same]
};

export default ChatPage;