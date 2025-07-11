import React, { useState, useRef } from 'react';
import { ArrowRight, Paperclip, Loader2 } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import AgentSelector from '../components/dashboard/AgentSelector';
import PlaybookTile from '../components/dashboard/PlaybookTile';
import FileChip from '../components/ui/FileChip';
import { useChat, AttachedFile } from '../contexts/ChatContext';

interface BuildPageProps {
  onSubmit: (query: string) => void;
  onNewPlaybook: () => void;
  onMyPlaybooks: () => void;
  onLibrary: () => void;
  onNavigateToConnectedAccounts: () => void;
}

const BuildPage: React.FC<BuildPageProps> = ({ 
  onSubmit, 
  onNewPlaybook,
  onMyPlaybooks,
  onLibrary,
  onNavigateToConnectedAccounts
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addUserMessage } = useChat();

  const handleSubmit = () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Add the message and files to the shared chat context
      addUserMessage(query, attachedFiles.length > 0 ? attachedFiles : undefined);
      
      // Clear the attached files after sending
      setAttachedFiles([]);
      
      onSubmit(query);
      setIsProcessing(false);
    }, 1000);
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
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const quickActions = [
    'Analyze my Google Ads campaigns and recommend negative keywords',
    'Find scaling opportunities in my Amazon Ads account',
    'Identify ad fatigue in my Meta campaigns',
    'Optimize my Google Shopping product feeds',
    'Research high-converting keywords for Amazon PPC',
    'Analyze competitor advertising strategies'
  ];

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
        <header className="h-16 flex items-center justify-end px-6 bg-[#FAFAFA]">
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
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-4xl mx-auto">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-semibold text-[#333333] mb-4">
                What can I help you with?
              </h1>
              <p className="text-xl text-gray-600">
                Describe what you want to achieve with your advertising campaigns
              </p>
            </div>

            {/* Main Input */}
            <div className="relative bg-white rounded-2xl shadow-sm mb-8">
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
                placeholder="Example: Analyze my Google Ads campaigns and recommend negative keywords to improve ROI..."
                className="w-full min-h-[120px] p-6 bg-transparent rounded-2xl focus:outline-none resize-none text-[#333333] placeholder-gray-400 text-lg"
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
                    className="px-6 py-3 bg-[#FF7F50] text-white rounded-full hover:bg-[#E67348] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Build Agent</span>
                        <ArrowRight size={20} />
                      </>
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

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-[#333333] mb-4 text-center">
                Or try one of these popular requests:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickActions.map((action, index) => (
                  <PlaybookTile
                    key={index}
                    title={action}
                    onClick={() => setQuery(action)}
                  />
                ))}
              </div>
            </div>

            {/* Explore Library Link */}
            <div className="text-center">
              <button 
                onClick={onLibrary}
                className="text-[#FF7F50] hover:text-[#E67348] transition-colors font-medium"
              >
                Or explore our agent library →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPage;