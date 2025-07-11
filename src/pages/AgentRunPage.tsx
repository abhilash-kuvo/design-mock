import React, { useState } from 'react';
import { useState, useRef } from 'react';
import { ArrowRight, Paperclip } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import AgentSelector from '../components/dashboard/AgentSelector';
import PlaybookTile from '../components/dashboard/PlaybookTile';
import UserProfileDropdown from '../components/layout/UserProfileDropdown';
import FileChip from '../components/ui/FileChip';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface AgentRunPageProps {
  onSubmit: (query: string) => void;
  onNewPlaybook: () => void;
  onMyPlaybooks: () => void;
  onLibrary: () => void;
  onNavigateToConnectedAccounts: () => void;
}

const AgentRunPage: React.FC<AgentRunPageProps> = ({ 
  onSubmit, 
  onNewPlaybook, 
  onMyPlaybooks, 
  onLibrary,
  onNavigateToConnectedAccounts
}) => {
  const [query, setQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePlaybookClick = (playbook: string) => {
    setQuery(playbook);
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
          <UserProfileDropdown onNavigateToConnectedAccounts={onNavigateToConnectedAccounts} />
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-semibold text-[#333333] mb-12">
              What growth task can I help with?
            </h2>

            {/* Chat Window with integrated Agent Selector */}
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="relative p-4">
                {/* Attached Files Display */}
                {attachedFiles.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
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
                  placeholder="Type your task here..."
                  className="w-full min-h-[120px] p-4 rounded-2xl focus:outline-none resize-none text-[#333333] placeholder-gray-400"
                />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  {/* Agent Selector - Left aligned */}
                  <AgentSelector />
                  
                  {/* Action buttons - Right aligned */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleFileAttachment}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Attach files"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={!query.trim()}
                      className="p-2.5 bg-[#FF7F50] text-white rounded-full hover:bg-[#E67348] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
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

            {/* Text Cue for Playbook Tiles */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-lg font-medium">
                or click on a pre-built agent to get started
              </p>
            </div>

            {/* Playbook Tiles */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <PlaybookTile
                title="Recommend Negative Search terms in my Google Ads campaigns"
                onClick={() => handlePlaybookClick("Analyze my Google Ads campaigns and recommend negative keywords to improve ROI")}
              />
              <PlaybookTile
                title="Identify a prioritised list of opportunities to scale my Amazon Ads"
                onClick={() => handlePlaybookClick("Analyze my Amazon Ads performance and identify top scaling opportunities")}
              />
              <PlaybookTile
                title="Which of my Meta ad campaigns are fatiguing?"
                onClick={() => handlePlaybookClick("Analyze my Meta ad campaigns for signs of fatigue and recommend optimization strategies")}
              />
            </div>

            <div className="flex justify-center mt-6">
              <button 
                onClick={onLibrary}
                className="px-6 py-2.5 border-2 border-[#FF7F50] text-[#FF7F50] rounded-full hover:bg-[#FF7F50] hover:text-white hover:scale-105 hover:shadow-lg transform transition-all duration-200 text-sm font-medium"
              >
                Explore More Readymade Agents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRunPage;