import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Eye, ChevronLeft, ChevronRight, Play, Archive, ArchiveRestore, RotateCcw } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Button from '../components/ui/Button';
import UserProfileDropdown from '../components/layout/UserProfileDropdown';

interface Playbook {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived';
  runCount: number;
}

interface MyPlaybooksPageProps {
  onNewPlaybook: () => void;
  onMyPlaybooks: () => void;
  onViewPlaybook: (playbookId: string) => void;
  onRunPlaybook: (playbookId: string, playbookTitle: string) => void;
  onLibrary: () => void;
  onNavigateToConnectedAccounts: () => void;
}

const MyPlaybooksPage: React.FC<MyPlaybooksPageProps> = ({ 
  onNewPlaybook, 
  onMyPlaybooks, 
  onViewPlaybook, 
  onRunPlaybook,
  onLibrary,
  onNavigateToConnectedAccounts
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const playbooksPerPage = 6;
  const menuRef = useRef<HTMLDivElement>(null);

  const [playbooks, setPlaybooks] = useState<Playbook[]>([
    {
      id: '1',
      title: 'Google Ads Negative Keywords',
      description: 'Analyze my Google Ads campaigns and recommend negative keywords to improve ROI and campaign performance across all ad groups.',
      status: 'active',
      runCount: 14,
    },
    {
      id: '2',
      title: 'Amazon Ads Scaling Opportunities',
      description: 'Analyze my Amazon Ads performance and identify top scaling opportunities to maximize sales and maintain efficient ACoS.',
      status: 'active',
      runCount: 8,
    },
    {
      id: '3',
      title: 'Meta Ads Fatigue Analysis',
      description: 'Analyze my Meta ad campaigns for signs of fatigue and recommend optimization strategies to maintain engagement.',
      status: 'active',
      runCount: 23,
    },
    {
      id: '4',
      title: 'Google Ads Keyword Performance',
      description: 'Identify underperforming keywords in my Google Ads account and provide actionable optimization recommendations.',
      status: 'active',
      runCount: 5,
    },
    {
      id: '5',
      title: 'Amazon ACoS Reduction',
      description: 'Find opportunities to reduce ACoS in Amazon Ads while maintaining sales volume and market position.',
      status: 'archived',
      runCount: 12,
    },
    {
      id: '6',
      title: 'Meta Ads Audience Optimization',
      description: 'Optimize Meta Ads audience targeting by analyzing performance data and identifying high-value segments.',
      status: 'active',
      runCount: 31,
    },
    {
      id: '7',
      title: 'Google Shopping Campaign Optimizer',
      description: 'Optimize Google Shopping campaigns by analyzing product performance and bid strategies.',
      status: 'archived',
      runCount: 7,
    },
    {
      id: '8',
      title: 'LinkedIn Ads B2B Targeting',
      description: 'Enhance LinkedIn Ads targeting for B2B campaigns using professional demographics and interests.',
      status: 'active',
      runCount: 2,
    },
    {
      id: '9',
      title: 'TikTok Ads Creative Testing',
      description: 'Test and optimize TikTok ad creatives for maximum engagement and conversion rates.',
      status: 'active',
      runCount: 6,
    },
    {
      id: '10',
      title: 'YouTube Ads Performance Optimizer',
      description: 'Optimize YouTube advertising campaigns for better reach and cost-effectiveness.',
      status: 'active',
      runCount: 11,
    },
    {
      id: '11',
      title: 'Pinterest Ads Audience Builder',
      description: 'Build and optimize Pinterest advertising audiences based on interest and behavior data.',
      status: 'archived',
      runCount: 4,
    },
    {
      id: '12',
      title: 'Snapchat Ads ROI Tracker',
      description: 'Track and improve ROI for Snapchat advertising campaigns across different demographics.',
      status: 'active',
      runCount: 9,
    }
  ]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  // Filter playbooks based on active tab
  const filteredPlaybooks = playbooks.filter(playbook => playbook.status === activeTab);

  // Calculate pagination values
  const indexOfLastPlaybook = currentPage * playbooksPerPage;
  const indexOfFirstPlaybook = indexOfLastPlaybook - playbooksPerPage;
  const currentPlaybooks = filteredPlaybooks.slice(indexOfFirstPlaybook, indexOfLastPlaybook);
  const totalPages = Math.ceil(filteredPlaybooks.length / playbooksPerPage);

  // Reset to page 1 when switching tabs
  const handleTabChange = (tab: 'active' | 'archived') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setActiveMenu(null); // Close any open menus
  };

  const handleMenuClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleArchivePlaybook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaybooks(prev => 
      prev.map(playbook => 
        playbook.id === id 
          ? { ...playbook, status: 'archived' as const }
          : playbook
      )
    );
    setActiveMenu(null);
  };

  const handleRestorePlaybook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaybooks(prev => 
      prev.map(playbook => 
        playbook.id === id 
          ? { ...playbook, status: 'active' as const }
          : playbook
      )
    );
    setActiveMenu(null);
  };

  const handleRenamePlaybook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Rename playbook:', id);
    setActiveMenu(null);
  };

  const handleViewPlaybook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onViewPlaybook(id);
    setActiveMenu(null);
  };

  const handleRunPlaybookClick = (id: string, title: string) => {
    // Increment run count when running
    setPlaybooks(prev => 
      prev.map(playbook => 
        playbook.id === id 
          ? { ...playbook, runCount: playbook.runCount + 1 }
          : playbook
      )
    );
    onRunPlaybook(id, title);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getActiveCount = () => playbooks.filter(p => p.status === 'active').length;
  const getArchivedCount = () => playbooks.filter(p => p.status === 'archived').length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <Sidebar 
        isOpen={true}
        forceExpanded={true}
        onNewPlaybook={onNewPlaybook}
        onMyPlaybooks={onMyPlaybooks}
      />

      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="h-16 flex items-center justify-end px-6 bg-[#FAFAFA]">
          <UserProfileDropdown onNavigateToConnectedAccounts={onNavigateToConnectedAccounts} />
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-semibold text-[#333333] mb-8">
              My Playbooks
            </h2>

            {/* Tabs with Explore Button */}
            <div className="mb-6">
              <div className="border-b border-gray-200 flex items-center justify-between">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => handleTabChange('active')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'active'
                        ? 'border-[#FF7F50] text-[#FF7F50]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Active ({getActiveCount()})
                  </button>
                  <button
                    onClick={() => handleTabChange('archived')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'archived'
                        ? 'border-[#FF7F50] text-[#FF7F50]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Archived ({getArchivedCount()})
                  </button>
                </nav>
                
                {/* Explore More Button - Inline with tabs, original styling */}
                <button 
                  onClick={onLibrary}
                  className="px-6 py-2.5 border-2 border-[#FF7F50] text-[#FF7F50] rounded-full hover:bg-[#FF7F50] hover:text-white hover:scale-105 hover:shadow-lg transform transition-all duration-200 text-sm font-medium"
                >
                  Explore More Readymade Agents
                </button>
              </div>
            </div>

            {/* Agents List */}
            {currentPlaybooks.length > 0 ? (
              <div className="space-y-3">
                {currentPlaybooks.map((playbook) => (
                  <div
                    key={playbook.id}
                    className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 relative group flex items-center"
                  >
                    {/* Content - Left side */}
                    <div className="flex-1 pr-4">
                      <h3 className="text-base font-semibold text-[#333333] mb-1">
                        {playbook.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {playbook.description}
                      </p>
                    </div>

                    {/* Controls - Right side, vertically centered */}
                    <div className="flex flex-col items-end space-y-2">
                      {/* Buttons Row */}
                      <div className="flex items-center space-x-2">
                        {/* Run Button - Only for active agents */}
                        {activeTab === 'active' && (
                          <Button
                            variant="primary"
                            onClick={() => handleRunPlaybookClick(playbook.id, playbook.title)}
                            icon={<Play size={14} />}
                            className="py-1.5 px-3 text-xs"
                          >
                            Run
                          </Button>
                        )}
                        
                        {/* Three Dots Menu */}
                        <div className="relative" ref={menuRef}>
                          <button
                            onClick={(e) => handleMenuClick(playbook.id, e)}
                            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical size={16} className="text-gray-500" />
                          </button>
                          
                          {activeMenu === playbook.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <button
                                onClick={(e) => handleViewPlaybook(playbook.id, e)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                              <button
                                onClick={(e) => handleRenamePlaybook(playbook.id, e)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Rename
                              </button>
                              {activeTab === 'active' ? (
                                <button
                                  onClick={(e) => handleArchivePlaybook(playbook.id, e)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Archive size={14} />
                                  <span>Archive</span>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => handleRestorePlaybook(playbook.id, e)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <ArchiveRestore size={14} />
                                  <span>Restore</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Run Count - Left aligned with Run button */}
                      <div className="flex items-center space-x-1 text-xs text-gray-500 self-start">
                        <RotateCcw size={12} className="text-gray-400" />
                        <span>Run {playbook.runCount} time{playbook.runCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'active' ? (
                    <Play size={24} className="text-gray-400" />
                  ) : (
                    <Archive size={24} className="text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} agents
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'active' 
                    ? "You don't have any active agents yet. Create one or explore the agent library."
                    : "You don't have any archived agents."
                  }
                </p>
              </div>
            )}

            {/* Pagination Controls - Only show if there are items and multiple pages */}
            {currentPlaybooks.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border transition-colors ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === number
                        ? 'bg-[#FF7F50] text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border transition-colors ${
                    currentPage === totalPages
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {filteredPlaybooks.length > 0 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {indexOfFirstPlaybook + 1}-{Math.min(indexOfLastPlaybook, filteredPlaybooks.length)} of {filteredPlaybooks.length} playbooks
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlaybooksPage;