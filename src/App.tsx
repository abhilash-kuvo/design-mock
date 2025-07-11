import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import BuildPage from './pages/BuildPage';
import ChatPage from './pages/ChatPage';
import MyPlaybooksPage from './pages/MyPlaybooksPage';
import PlaybookDetailsPage from './pages/PlaybookDetailsPage';
import LibraryPage from './pages/LibraryPage';
import ConnectedAccountsPage from './pages/ConnectedAccountsPage';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<'agentRun' | 'chat' | 'myPlaybooks' | 'playbookDetails' | 'library' | 'connectedAccounts'>('agentRun'); // Start directly on BuildPage
  const [currentQuery, setCurrentQuery] = React.useState('');
  const [selectedPlaybookId, setSelectedPlaybookId] = React.useState<string>('');
  const [isViewingPlaybookFromLibrary, setIsViewingPlaybookFromLibrary] = React.useState(false);
  const [showCloneSuccessOnDetails, setShowCloneSuccessOnDetails] = React.useState(false);
  const [runningPlaybookId, setRunningPlaybookId] = React.useState<string>('');
  const [previousView, setPreviousView] = React.useState<'agentRun' | 'chat' | 'myPlaybooks' | 'playbookDetails' | 'library'>('agentRun'); // Start on BuildPage

  const handleNewPlaybook = () => {
    setCurrentView('agentRun');
    setRunningPlaybookId('');
  };

  const handleMyPlaybooks = () => {
    setCurrentView('myPlaybooks');
    setRunningPlaybookId('');
  };

  const handleLibrary = () => {
    setCurrentView('library');
    setRunningPlaybookId('');
  };

  const handleNavigateToConnectedAccounts = () => {
    // Store the current view so we can return to it
    if (currentView !== 'connectedAccounts') {
      setPreviousView(currentView);
    }
    setCurrentView('connectedAccounts');
  };

  const handleBackFromConnectedAccounts = () => {
    setCurrentView(previousView);
  };

  const handleViewPlaybookFromMyPlaybooks = (playbookId: string) => {
    setSelectedPlaybookId(playbookId);
    setIsViewingPlaybookFromLibrary(false);
    setCurrentView('playbookDetails');
    setRunningPlaybookId('');
  };

  const handleViewPlaybookFromLibrary = (playbookId: string) => {
    setSelectedPlaybookId(playbookId);
    setIsViewingPlaybookFromLibrary(true);
    setCurrentView('playbookDetails');
    setRunningPlaybookId('');
  };

  const handleClonePlaybook = (playbookId: string) => {
    // In a real app, this would make an API call to clone the playbook
    console.log('Cloning playbook:', playbookId);
    
    // Set flag to show clone success message on details page
    setShowCloneSuccessOnDetails(true);
    
    // After cloning, the playbook is now "mine", so set isViewingPlaybookFromLibrary to false
    setIsViewingPlaybookFromLibrary(false);
    
    // Navigate to playbook details
    setSelectedPlaybookId(playbookId);
    setCurrentView('playbookDetails');
    setRunningPlaybookId('');
  };

  const handleRunPlaybook = (playbookId: string, playbookTitle: string) => {
    // Set the running playbook ID and navigate to chat
    setRunningPlaybookId(playbookId);
    setCurrentQuery(`Running playbook: ${playbookTitle}`);
    setCurrentView('chat');
  };

  const handleCloneMessageDisplayed = () => {
    setShowCloneSuccessOnDetails(false);
  };

  const handleBackFromPlaybookDetails = () => {
    if (isViewingPlaybookFromLibrary) {
      setCurrentView('library');
    } else {
      setCurrentView('myPlaybooks');
    }
    setSelectedPlaybookId('');
    setIsViewingPlaybookFromLibrary(false);
    setShowCloneSuccessOnDetails(false);
    setRunningPlaybookId('');
  };

  const handleBackFromChat = () => {
    if (runningPlaybookId) {
      // If we came from running a playbook, go back to playbook details
      setCurrentView('playbookDetails');
    } else {
      // Otherwise go back to agent run page
      setCurrentView('agentRun');
    }
  };

  if (currentView === 'connectedAccounts') {
    return (
      <ConnectedAccountsPage 
        onBack={handleBackFromConnectedAccounts}
        onNewPlaybook={handleNewPlaybook}
        onMyPlaybooks={handleMyPlaybooks}
      />
    );
  }

  if (currentView === 'library') {
    return (
      <LibraryPage 
        onNewPlaybook={handleNewPlaybook}
        onMyPlaybooks={handleMyPlaybooks}
        onViewPlaybook={handleViewPlaybookFromLibrary}
        onClonePlaybook={handleClonePlaybook}
        onNavigateToConnectedAccounts={handleNavigateToConnectedAccounts}
      />
    );
  }

  if (currentView === 'playbookDetails') {
    return (
      <PlaybookDetailsPage 
        playbookId={selectedPlaybookId}
        onBack={handleBackFromPlaybookDetails}
        onNewPlaybook={handleNewPlaybook}
        onMyPlaybooks={handleMyPlaybooks}
        onRunPlaybook={handleRunPlaybook}
        isFromLibrary={isViewingPlaybookFromLibrary}
        onClonePlaybook={handleClonePlaybook}
        showInitialCloneMessage={showCloneSuccessOnDetails}
        onCloneMessageDisplayed={handleCloneMessageDisplayed}
        onNavigateToConnectedAccounts={handleNavigateToConnectedAccounts}
      />
    );
  }

  if (currentView === 'myPlaybooks') {
    return (
      <MyPlaybooksPage 
        onNewPlaybook={handleNewPlaybook}
        onMyPlaybooks={handleMyPlaybooks}
        onViewPlaybook={handleViewPlaybookFromMyPlaybooks}
        onRunPlaybook={handleRunPlaybook}
        onLibrary={handleLibrary}
        onNavigateToConnectedAccounts={handleNavigateToConnectedAccounts}
      />
    );
  }

  if (currentView === 'chat') {
    return (
      <ChatPage 
        initialQuery={currentQuery} 
        runningPlaybookId={runningPlaybookId}
        onBack={handleBackFromChat}
        onNewPlaybook={handleNewPlaybook}
        onMyPlaybooks={handleMyPlaybooks}
        onNavigateToConnectedAccounts={handleNavigateToConnectedAccounts}
      />
    );
  }

  return (
    <BuildPage 
      onSubmit={(query) => {
        setCurrentQuery(query);
        setRunningPlaybookId('');
        setCurrentView('chat');
      }}
      onNewPlaybook={handleNewPlaybook}
      onMyPlaybooks={handleMyPlaybooks}
      onLibrary={handleLibrary}
      onNavigateToConnectedAccounts={handleNavigateToConnectedAccounts}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;