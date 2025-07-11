import React, { useState } from 'react';
import { ArrowRight, Paperclip } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import AgentSelector from '../components/dashboard/AgentSelector';
import PlaybookTile from '../components/dashboard/PlaybookTile';
import UserProfileDropdown from '../components/layout/UserProfileDropdown';

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
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
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