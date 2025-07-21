import React, { useState } from 'react';
import { Search, Filter, Heart, Users, Clock, Eye, Copy } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';

interface PlaybookCard {
  id: string;
  title: string;
  description: string;
  category: string;
  likes: number;
  users: number;
  lastUpdated: string;
  tags: string[];
  featured?: boolean;
}

interface LibraryPageProps {
  onNewPlaybook: () => void;
  onMyPlaybooks: () => void;
  onViewPlaybook: (playbookId: string) => void;
  onClonePlaybook: (playbookId: string) => void;
  onNavigateToConnectedAccounts: () => void;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ 
  onNewPlaybook, 
  onMyPlaybooks, 
  onViewPlaybook,
  onClonePlaybook,
  onNavigateToConnectedAccounts
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  const categories = ['All', 'Google Ads', 'Amazon Ads', 'Meta Ads', 'Analytics', 'SEO'];
  const sortOptions = ['Popular', 'Recent', 'Most Used'];

  const playbooks: PlaybookCard[] = [
    {
      id: '1',
      title: 'Google Ads Negative Keywords Optimizer',
      description: 'Automatically identify and recommend negative keywords to improve campaign ROI and reduce wasted spend.',
      category: 'Google Ads',
      likes: 342,
      users: 1250,
      lastUpdated: '2 days ago',
      tags: ['Google Ads', 'Optimization'],
      featured: true,
    },
    {
      id: '2',
      title: 'Amazon PPC Bid Optimization',
      description: 'Smart bidding strategy that adjusts bids based on performance metrics and competitor analysis.',
      category: 'Amazon Ads',
      likes: 289,
      users: 890,
      lastUpdated: '5 days ago',
      tags: ['Amazon Ads', 'Bidding'],
    },
    {
      id: '3',
      title: 'Meta Ads Creative Fatigue Detector',
      description: 'Detect when your Meta ad creatives are losing effectiveness and get recommendations for refresh.',
      category: 'Meta Ads',
      likes: 156,
      users: 567,
      lastUpdated: '1 week ago',
      tags: ['Meta Ads', 'Creative'],
      featured: true,
    },
    {
      id: '4',
      title: 'Cross-Platform Attribution Analysis',
      description: 'Comprehensive attribution modeling across Google, Meta, and Amazon advertising platforms.',
      category: 'Analytics',
      likes: 198,
      users: 423,
      lastUpdated: '3 days ago',
      tags: ['Analytics', 'Attribution'],
    },
    {
      id: '5',
      title: 'Competitor Ad Intelligence',
      description: 'Monitor competitor advertising strategies and identify opportunities in your market.',
      category: 'Analytics',
      likes: 234,
      users: 678,
      lastUpdated: '4 days ago',
      tags: ['Analytics', 'Intelligence'],
    },
    {
      id: '6',
      title: 'Google Shopping Feed Optimizer',
      description: 'Optimize your Google Shopping product feeds for better visibility and conversion rates.',
      category: 'Google Ads',
      likes: 167,
      users: 445,
      lastUpdated: '6 days ago',
      tags: ['Google Ads', 'Shopping'],
    },
    {
      id: '7',
      title: 'Amazon Keyword Research Tool',
      description: 'Discover high-converting keywords for your Amazon PPC campaigns with search volume and competition data.',
      category: 'Amazon Ads',
      likes: 298,
      users: 756,
      lastUpdated: '1 day ago',
      tags: ['Amazon Ads', 'Keywords'],
    },
    {
      id: '8',
      title: 'Meta Ads Audience Expansion',
      description: 'Identify and target lookalike audiences based on your best-performing customer segments.',
      category: 'Meta Ads',
      likes: 187,
      users: 534,
      lastUpdated: '3 days ago',
      tags: ['Meta Ads', 'Targeting'],
    },
    {
      id: '9',
      title: 'Google Ads Quality Score Optimizer',
      description: 'Improve your Quality Scores by optimizing ad relevance, landing page experience, and expected CTR.',
      category: 'Google Ads',
      likes: 213,
      users: 612,
      lastUpdated: '5 days ago',
      tags: ['Google Ads', 'Quality Score'],
    },
  ];

  const filteredPlaybooks = playbooks.filter(playbook => {
    const matchesSearch = playbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         playbook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         playbook.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || playbook.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPlaybooks = [...filteredPlaybooks].sort((a, b) => {
    switch (sortBy) {
      case 'Popular':
        return b.likes - a.likes;
      case 'Recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'Most Used':
        return b.users - a.users;
      default:
        return 0;
    }
  });

  const featuredPlaybooks = sortedPlaybooks.filter(p => p.featured);
  const regularPlaybooks = sortedPlaybooks.filter(p => !p.featured);

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
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-semibold text-[#333333] mb-2">
                Agent Library
              </h1>
              <p className="text-gray-600">
                Discover and use ready-made growth agents
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F50] focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Category Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-gray-500" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF7F50] focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF7F50] focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Agents */}
            {featuredPlaybooks.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#333333] mb-4">Featured Agents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPlaybooks.map((playbook) => (
                    <PlaybookCard 
                      key={playbook.id} 
                      playbook={playbook} 
                      onView={onViewPlaybook}
                      onClone={onClonePlaybook}
                      featured 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Agents */}
            <div>
              <h2 className="text-xl font-semibold text-[#333333] mb-4">
                All Agents ({sortedPlaybooks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPlaybooks.map((playbook) => (
                  <PlaybookCard 
                    key={playbook.id} 
                    playbook={playbook} 
                    onView={onViewPlaybook}
                    onClone={onClonePlaybook}
                  />
                ))}
              </div>
            </div>

            {/* No Results */}
            {sortedPlaybooks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No playbooks found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Playbook Card Component
interface PlaybookCardProps {
  playbook: PlaybookCard;
  onView: (playbookId: string) => void;
  onClone: (playbookId: string) => void;
  featured?: boolean;
}

const PlaybookCard: React.FC<PlaybookCardProps> = ({ playbook, onView, onClone, featured = false }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group flex flex-col h-full ${
      featured ? 'ring-2 ring-[#FF7F50] ring-opacity-20' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#333333] mb-2 group-hover:text-[#FF7F50] transition-colors">
            {playbook.title}
          </h3>
        </div>
        {featured && (
          <span className="bg-[#FF7F50] text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </span>
        )}
      </div>

      {/* Description with fixed height */}
      <div className="h-20 mb-4">
        <p className="text-sm text-gray-600 line-clamp-3">
          {playbook.description}
        </p>
      </div>

      {/* Tags - Maximum 2 tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {playbook.tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart size={14} />
            <span>{playbook.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={14} />
            <span>{playbook.users}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{playbook.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons - pushed to bottom */}
      <div className="flex space-x-2 mt-auto">
        <button
          onClick={() => onView(playbook.id)}
          className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Eye size={16} />
          <span>View</span>
        </button>
        <button
          onClick={() => onClone(playbook.id)}
          className="flex-1 bg-[#FF7F50] text-white py-2.5 rounded-lg hover:bg-[#E67348] transition-colors flex items-center justify-center space-x-2"
        >
          <Copy size={16} />
          <span>Clone</span>
        </button>
      </div>
    </div>
  );
};

export default LibraryPage;