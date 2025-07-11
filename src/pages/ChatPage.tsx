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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isLogPanelOpen, setIsLogPanelOpen] = useState(false);
  const [logHistory, setLogHistory] = useState<SystemLogEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, addUserMessage } = useChat();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Process initial query when component mounts
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      // Add initial processing delay
      setTimeout(() => {
        setIsProcessing(true);
        
        // Add system log entries
        const logEntries: SystemLogEntry[] = [
          { id: '1', message: 'Connecting to Amazon Ads API...', timestamp: new Date() },
          { id: '2', message: 'Analyzing campaign performance data...', timestamp: new Date(Date.now() + 2000) },
          { id: '3', message: 'Identifying scaling opportunities...', timestamp: new Date(Date.now() + 4000) },
          { id: '4', message: 'Generating recommendations...', timestamp: new Date(Date.now() + 6000) },
          { id: '5', message: 'Analysis complete!', timestamp: new Date(Date.now() + 8000) },
        ];

        // Add log entries with delays
        logEntries.forEach((entry, index) => {
          setTimeout(() => {
            setLogHistory(prev => [...prev, entry]);
          }, index * 2000);
        });

        // Add completion message after processing
        setTimeout(() => {
          addMessage({
            type: 'assistant',
            content: `✅ **Analysis Complete!** 

I've successfully analyzed your Amazon Ads account and identified **12 high-impact scaling opportunities** that could increase your revenue by an estimated **$45,000-$67,000** over the next 90 days.

**Key Findings:**
• 🎯 **8 underperforming campaigns** with optimization potential
• 📈 **4 high-converting keywords** ready for bid increases  
• 🔍 **23 new keyword opportunities** in your top product categories
• 💰 **Average ACoS reduction potential: 15-22%**

**Next Steps:**
Review the detailed reports below and implement the recommendations in priority order. Start with the quick wins in the opportunities report for immediate impact.`,
          });

          // Add downloadable files with delays
          setTimeout(() => {
            addMessage({
              type: 'assistant',
              content: 'Here\'s your comprehensive scaling opportunities report:',
              hasDownload: true,
              downloadFileName: 'amazon-scaling-opportunities.xlsx',
            });
          }, 500);

          setTimeout(() => {
            addMessage({
              type: 'assistant',
              content: 'Campaign performance breakdown with detailed metrics:',
              hasDownload: true,
              downloadFileName: 'campaign-performance-analysis.pdf',
            });
          }, 1000);

          setTimeout(() => {
            addMessage({
              type: 'assistant',
              content: 'New keyword research data with search volumes and competition analysis:',
              hasDownload: true,
              downloadFileName: 'keyword-research-report.csv',
            });
          }, 1500);

          setIsProcessing(false);
        }, 8000);
      }, 1000);
    }
  }, [initialQuery, messages.length, addMessage]);

  const handleSubmit = () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    // Add user message
    addUserMessage(query, attachedFiles.length > 0 ? attachedFiles : undefined);
    
    // Clear input and files
    setQuery('');
    setAttachedFiles([]);
    
    // Simulate AI response
    setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: 'I understand your request. Let me analyze this for you...',
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: AttachedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleDownload = (fileName: string) => {
    // Mock download functionality
    console.log('Downloading:', fileName);
    
    // Create a mock file content based on the filename
    let content = '';
    let mimeType = 'text/plain';
    
    if (fileName.includes('opportunities')) {
      content = 'Campaign,Current Spend,Recommended Action,Potential Impact\nCampaign A,$1000,Increase bids by 25%,+$500 revenue\nCampaign B,$800,Add negative keywords,-15% ACoS';
      mimeType = 'text/csv';
    } else if (fileName.includes('performance')) {
      content = 'Amazon Ads Performance Analysis Report\n\nExecutive Summary:\nYour campaigns show strong potential for scaling...';
      mimeType = 'text/plain';
    } else if (fileName.includes('keyword')) {
      content = 'Keyword,Search Volume,Competition,CPC Estimate\namazon product,50000,High,$2.50\nbest seller,25000,Medium,$1.80';
      mimeType = 'text/csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const toggleMessage = (messageId: string) => {
    // Toggle message expansion if needed
    console.log('Toggle message:', messageId);
  };

  const handleApproval = (messageId: string) => {
    console.log('Approved message:', messageId);
  };

  const handleFeedback = (messageId: string) => {
    console.log('Feedback for message:', messageId);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        onNewPlaybook={onNewPlaybook}
        onMyPlaybooks={onMyPlaybooks}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#FAFAFA] border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-[#FF7F50] hover:text-[#E67348] transition-colors"
            >
              ← Back
            </button>
            {runningPlaybookId && (
              <span className="text-sm text-gray-600">
                Running: Amazon Ads Scaling Agent
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLogPanelOpen(true)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              System Logs
            </button>
            <button 
              onClick={onNavigateToConnectedAccounts}
              className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-200 transition-all"
            >
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="space-y-4">
                {/* User Message */}
                {message.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-3xl">
                      <div className="bg-[#FF7F50] text-white p-4 rounded-2xl rounded-br-md">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.attachedFiles && message.attachedFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.attachedFiles.map((file) => (
                            <FileChip
                              key={file.id}
                              fileName={file.name}
                              size={file.size}
                              type="attachment"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Assistant Message */}
                {message.type === 'assistant' && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl">
                      <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="prose prose-sm max-w-none">
                          <div dangerouslySetInnerHTML={{ 
                            __html: message.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/•/g, '•')
                          }} />
                        </div>
                        
                        {message.hasDownload && message.downloadFileName && (
                          <div className="mt-4">
                            <FileChip
                              fileName={message.downloadFileName}
                              onClick={() => handleDownload(message.downloadFileName!)}
                              type="download"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-[#FF7F50]" />
                    <span className="text-gray-600">Analyzing your request...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-50 rounded-2xl">
              {/* Attached Files Display */}
              {attachedFiles.length > 0 && (
                <div className="p-4 pb-0 flex flex-wrap gap-2">
                  {attachedFiles.map((file) => (
                    <FileChip
                      key={file.id}
                      fileName={file.name}
                      size={file.size}
                      type="attachment"
                      onClick={() => handleRemoveFile(file.id)}
                      className="cursor-pointer hover:bg-red-50 hover:border-red-200"
                    />
                  ))}
                </div>
              )}

              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a follow-up question or request additional analysis..."
                className="w-full min-h-[80px] p-4 bg-transparent rounded-2xl focus:outline-none resize-none text-[#333333] placeholder-gray-400"
                disabled={isProcessing}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <AgentSelector />
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleFileAttachment}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isProcessing}
                    title="Attach files"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!query.trim() || isProcessing}
                    className="p-3 bg-[#FF7F50] text-white rounded-full hover:bg-[#E67348] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <ArrowRight size={20} />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.gif,.zip"
              />
            </div>
          </div>
        </div>
      </div>

      {/* System Log History Panel */}
      <SystemLogHistoryPanel
        logHistory={logHistory}
        isOpen={isLogPanelOpen}
        onClose={() => setIsLogPanelOpen(false)}
      />
    </div>
  );
};

export default ChatPage;