import React, { useState } from 'react';
import { ArrowLeft, Shield, CheckCircle, AlertCircle, ExternalLink, Trash2, Plus } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Button from '../components/ui/Button';

interface ConnectedAccount {
  id: string;
  platform: string;
  email: string;
  status: 'connected' | 'expired' | 'error';
  connectedAt: string;
  permissions: string[];
}

interface ConnectedAccountsPageProps {
  onBack: () => void;
  onNewPlaybook: () => void;
  onMyPlaybooks: () => void;
}

const ConnectedAccountsPage: React.FC<ConnectedAccountsPageProps> = ({
  onBack,
  onNewPlaybook,
  onMyPlaybooks,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState<string | null>(null);

  // Mock connected accounts data - Now includes multiple accounts for same platforms
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    {
      id: '1',
      platform: 'Google Ads',
      email: 'ads@company.com',
      status: 'connected',
      connectedAt: '2024-01-15',
      permissions: ['Read campaigns', 'Manage keywords', 'View reports'],
    },
    {
      id: '2',
      platform: 'Google Ads',
      email: 'marketing@company.com',
      status: 'connected',
      connectedAt: '2024-01-20',
      permissions: ['Read campaigns', 'View reports'],
    },
    {
      id: '3',
      platform: 'Meta Ads',
      email: 'marketing@company.com',
      status: 'expired',
      connectedAt: '2024-01-10',
      permissions: ['Read campaigns', 'View insights'],
    },
    {
      id: '4',
      platform: 'Meta Ads',
      email: 'social@company.com',
      status: 'connected',
      connectedAt: '2024-01-18',
      permissions: ['Read campaigns', 'Manage ads', 'View insights'],
    },
    {
      id: '5',
      platform: 'Amazon Ads',
      email: 'seller@company.com',
      status: 'error',
      connectedAt: '2024-01-08',
      permissions: ['Read campaigns', 'Manage bids'],
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'expired':
        return <AlertCircle size={14} className="text-yellow-500" />;
      case 'error':
        return <AlertCircle size={14} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'expired':
        return 'Token Expired';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'expired':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleDisconnect = (accountId: string) => {
    setConnectedAccounts(prev => prev.filter(account => account.id !== accountId));
    setShowDisconnectModal(null);
  };

  const handleReconnect = (accountId: string) => {
    // In a real app, this would trigger the OAuth flow
    console.log('Reconnecting account:', accountId);
    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, status: 'connected' as const }
          : account
      )
    );
  };

  const handleConnectNew = (platform: string) => {
    // In a real app, this would trigger the OAuth flow for the specific platform
    console.log('Connecting new account for:', platform);
  };

  // Available platforms - Always show "Connect" option regardless of existing connections
  const availablePlatforms = [
    { name: 'Google Ads' },
    { name: 'Meta Ads' },
    { name: 'Amazon Ads' },
    { name: 'LinkedIn Ads' },
    { name: 'TikTok Ads' },
  ];

  // Group accounts by platform for better organization
  const groupedAccounts = connectedAccounts.reduce((groups, account) => {
    const platform = account.platform;
    if (!groups[platform]) {
      groups[platform] = [];
    }
    groups[platform].push(account);
    return groups;
  }, {} as Record<string, ConnectedAccount[]>);

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
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-[#333333]">Connected Accounts</h1>
              <p className="text-sm text-gray-500">Manage your advertising platform connections</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Shield size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    Your data is secure
                  </h3>
                  <p className="text-sm text-blue-700">
                    We use industry-standard OAuth 2.0 authentication. We never store your passwords and can only access the specific permissions you grant.
                  </p>
                </div>
              </div>
            </div>

            {/* Connected Accounts - Grouped by Platform */}
            <div>
              <h2 className="text-xl font-semibold text-[#333333] mb-4">
                Connected Accounts ({connectedAccounts.length})
              </h2>
              
              {connectedAccounts.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedAccounts).map(([platform, accounts]) => (
                    <div key={platform}>
                      <h3 className="text-lg font-medium text-[#333333] mb-3 flex items-center">
                        {platform}
                        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {accounts.length} account{accounts.length > 1 ? 's' : ''}
                        </span>
                      </h3>
                      <div className="space-y-2">
                        {accounts.map((account) => (
                          <div
                            key={account.id}
                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Shield size={16} className="text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="text-sm font-medium text-[#333333] truncate">
                                      {account.email}
                                    </h4>
                                    <div className="flex items-center space-x-1 flex-shrink-0">
                                      {getStatusIcon(account.status)}
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(account.status)}`}>
                                        {getStatusText(account.status)}
                                      </span>
                                    </div>
                                  </div>
                                  {/* Permissions - Now in the main space */}
                                  <div className="flex flex-wrap gap-1">
                                    {account.permissions.map((permission, index) => (
                                      <span
                                        key={index}
                                        className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded whitespace-nowrap"
                                      >
                                        {permission}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                                {account.status !== 'connected' && (
                                  <Button
                                    variant="primary"
                                    onClick={() => handleReconnect(account.id)}
                                    className="text-xs px-3 py-1.5"
                                  >
                                    Reconnect
                                  </Button>
                                )}
                                <button
                                  onClick={() => setShowDisconnectModal(account.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No accounts connected yet</p>
                </div>
              )}
            </div>

            {/* Available Platforms - Always show Connect option */}
            <div>
              <h2 className="text-xl font-semibold text-[#333333] mb-4">
                Connect New Account
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                You can connect multiple accounts for each platform to manage different campaigns or clients.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePlatforms.map((platform) => {
                  const connectedCount = connectedAccounts.filter(acc => acc.platform === platform.name).length;
                  
                  return (
                    <div
                      key={platform.name}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Shield size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-[#333333]">
                              {platform.name}
                            </h3>
                            {connectedCount > 0 ? (
                              <span className="text-xs text-green-600">
                                {connectedCount} account{connectedCount > 1 ? 's' : ''} connected
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">Not connected</span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleConnectNew(platform.name)}
                          className="flex items-center space-x-1 px-3 py-2 text-[#FF7F50] hover:bg-[#FFF5F2] rounded-lg transition-colors text-sm font-medium"
                        >
                          <Plus size={16} />
                          <span>Connect</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-[#333333] mb-3">
                Managing Multiple Accounts
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Each account maintains its own permissions and authentication status</p>
                <p>• You can disconnect individual accounts without affecting others</p>
                <p>• Playbooks will prompt you to select which account to use when multiple are available</p>
                <p>• Your authentication tokens are encrypted and stored securely</p>
              </div>
              <button className="mt-4 inline-flex items-center space-x-2 text-[#FF7F50] hover:text-[#E67348] transition-colors">
                <span>Learn more about our security practices</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[#333333] mb-2">
              Disconnect Account
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to disconnect this account? You'll need to reconnect it to use related playbooks.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDisconnectModal(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDisconnect(showDisconnectModal)}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedAccountsPage;