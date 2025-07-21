import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ArrowRight, Paperclip, Loader2, Play, ChevronDown, ChevronUp, CheckCircle, MessageSquare, Shield, ExternalLink, Upload } from 'lucide-react';
import { Download } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import AgentSelector from '../components/dashboard/AgentSelector';
import FileChip from '../components/ui/FileChip';
import CsvDataTable from '../components/ui/CsvDataTable';
import BottomDrawerLogs from '../components/BottomDrawerLogs';
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
  const [newMessage, setNewMessage] = useState('');
  const [systemLog, setSystemLog] = useState('Analyzing your request...');
  const [isProcessing, setIsProcessing] = useState(true);
  const [authCompleted, setAuthCompleted] = useState(false);
  const [systemLogHistory, setSystemLogHistory] = useState<SystemLogEntry[]>([]);
  const [showLogDrawer, setShowLogDrawer] = useState(false);
  const { messages, setMessages, addMessage, addUserMessage } = useChat();
  
  // Q&A Flow State
  const [queryFlowStep, setQueryFlowStep] = useState(0);
  const [currentQueryContext, setCurrentQueryContext] = useState('');
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  // Save playbook state
  const [showSavePlaybook, setShowSavePlaybook] = useState(false);
  const [savePlaybookSuccess, setSavePlaybookSuccess] = useState(false);

  // File attachment state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to update system log and add to history
  const updateSystemLog = (message: string) => {
    setSystemLog(message);
    const logEntry: SystemLogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      message,
      timestamp: new Date(),
    };
    setSystemLogHistory(prev => [logEntry, ...prev]);
  };

  // Mock playbook data for display
  const getPlaybookTitle = (playbookId: string) => {
    const playbooks: { [key: string]: string } = {
      '1': 'Google Ads Negative Keywords',
      '2': 'Amazon Ads Scaling Opportunities',
      '3': 'Meta Ads Fatigue Analysis',
      '4': 'Google Ads Keyword Performance',
      '5': 'Amazon ACoS Reduction',
      '6': 'Meta Ads Audience Optimization',
    };
    return playbooks[playbookId] || 'Unknown Playbook';
  };

  useEffect(() => {
    if (initialQuery) {
      // If running a playbook, show authentication flow first
      if (runningPlaybookId) {
        const playbookTitle = getPlaybookTitle(runningPlaybookId);
        
        // Clear existing messages and add the playbook start message
        setMessages([]);
        addMessage({
          type: 'assistant',
          content: `Starting playbook execution: ${playbookTitle}`,
        });

        updateSystemLog('Preparing playbook execution...');

        const timeouts: NodeJS.Timeout[] = [];

        timeouts.push(setTimeout(() => {
          addMessage({
            type: 'auth',
            content: 'This playbook requires access to your Google Ads account to analyze campaign data and implement recommendations.',
            showAuthButtons: true,
          });
          updateSystemLog('Authentication required');
          setIsProcessing(false);
        }, 1500));

        return () => {
          timeouts.forEach(timeout => clearTimeout(timeout));
        };
      } else {
        // For all regular queries, trigger Amazon Ads scaling Q&A flow
        const hasAssistantMessages = messages.some(msg => msg.type === 'assistant');
        
        if (!hasAssistantMessages) {
          // All queries trigger Amazon Ads scaling Q&A flow
          setCurrentQueryContext(initialQuery);
          setQueryFlowStep(1);
          updateSystemLog('Analyzing your request...');
          
          const timeout = setTimeout(() => {
            addMessage({
              type: 'assistant',
              content: `✅ Analysis Complete! I've successfully analyzed your request and identified key scaling opportunities for your Amazon ads.\n\nBased on your query "${currentQueryContext}", I've prepared a comprehensive scaling strategy that includes:\n\n• Campaign structure optimization recommendations\n• High-potential keyword expansion opportunities  \n• Budget reallocation strategies for maximum ROI\n• Performance-based bidding adjustments\n• Inventory velocity optimization tactics\n\nYour personalized Amazon ads scaling plan is ready! This strategy is designed to help you increase sales volume while maintaining or improving your current ACoS.\n\nWould you like me to dive deeper into any specific area, or shall we proceed with implementing these recommendations?`,
              downloadFiles: [
                {
                  id: 'scaling-strategy-1',
                  name: 'Amazon Ads Scaling Strategy Report.pdf',
                  description: 'Comprehensive scaling strategy with actionable recommendations',
                  type: 'pdf'
                },
                {
                  id: 'keyword-opportunities-1',
                  name: 'High-Potential Keywords Analysis.xlsx',
                  description: 'Keyword expansion opportunities with search volume data',
                  type: 'xlsx'
                },
                {
                  id: 'budget-optimization-1',
                  name: 'Budget Reallocation Plan.csv',
                  description: 'Campaign-level budget optimization recommendations',
                  type: 'csv'
                }
              ]
            });
            updateSystemLog('Analysis complete - Scaling strategy ready for review');
            setIsProcessing(false);
            
            // Show save playbook option after analysis completes
            setTimeout(() => {
              setShowSavePlaybook(true);
            }, 1000);
          }, 2000);

          return () => clearTimeout(timeout);
        }
      }
    }
  }, [initialQuery, runningPlaybookId, addMessage, setMessages]);

  const handleGoogleAdsAuth = () => {
    // Hide the auth panel by marking auth as completed
    setAuthCompleted(true);
    
    // Authentication flow implementation
    addMessage({
      type: 'assistant',
      content: `Google Ads authentication successful!

Connected Account Details:
• Account: Digital Marketing Pro (ID: 123-456-7890)
• Email: marketing@yourcompany.com

Starting data analysis...`,
    });
    updateSystemLog('Analyzing your Google Ads data...');
    setIsProcessing(true);

    const timeouts: NodeJS.Timeout[] = [];

    // Step 1: Data Collection
    timeouts.push(setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: 'Step 1: Collecting campaign data from Google Ads',
        isCollapsible: true,
        details: [
          'Campaigns Found: 12 active campaigns',
          'Retrieving campaign performance data for the last 30 days',
          'Collecting search terms, keywords, and match types',
          'Gathering cost, click, and conversion metrics'
        ]
      });
      updateSystemLog('Collecting campaign data...');
    }, 1500));

    // Step 2: Analysis
    timeouts.push(setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: 'Step 2: Analyzing campaign data for patterns',
        isCollapsible: true,
        details: [
          'Processing 2,847 search terms from 12 campaigns',
          'Identifying high-cost, low-converting search queries',
          'Analyzing search term relevance to your products',
          'Calculating potential cost savings for each negative keyword'
        ]
      });
      updateSystemLog('Analyzing performance patterns...');
    }, 3000));

    // Step 3: Identification
    timeouts.push(setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: 'Step 3: Identifying negative keyword opportunities',
        isCollapsible: true,
        details: [
          'Found 47 potential negative keywords',
          'Prioritizing by cost impact and relevance',
          'Categorizing by match type recommendations',
          'Validating against your product catalog'
        ]
      });
      updateSystemLog('Identifying optimization opportunities...');
    }, 4500));

    // Step 4: Recommendations
    timeouts.push(setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: 'Step 4: Generating actionable recommendations',
        isCollapsible: true,
        details: [
          'Creating prioritized negative keyword list',
          'Estimating monthly cost savings: $2,340',
          'Preparing implementation instructions',
          'Generating performance impact projections'
        ]
      });
      updateSystemLog('Generating recommendations...');
    }, 6000));

    // Step 5: Results with CSV data
    timeouts.push(setTimeout(() => {
      const csvContent = `Search Term,Match Type,Impressions,Clicks,Cost,Conversions,Recommendation
free,Broad,1250,45,$450.00,0,Add as negative keyword - High Priority
cheap,Phrase,890,32,$280.00,1,Add as negative keyword - High Priority
tutorial,Exact,670,28,$220.00,0,Add as negative keyword - High Priority
download,Broad,540,19,$180.00,0,Add as negative keyword - High Priority
review,Phrase,420,15,$120.00,2,Consider for broad match negative only
comparison,Broad,380,12,$95.00,1,Monitor - may keep for awareness
vs,Phrase,290,8,$75.00,1,Monitor - evaluate based on strategy
how to,Broad,250,10,$65.00,0,Add as negative keyword - High Priority
best,Phrase,220,9,$58.00,1,Monitor - evaluate based on strategy
top,Broad,200,7,$45.00,0,Add as negative keyword - High Priority
guide,Exact,180,6,$42.00,0,Add as negative keyword - High Priority
tips,Phrase,160,5,$38.00,1,Consider for broad match negative only
help,Broad,140,4,$32.00,0,Add as negative keyword - High Priority
support,Phrase,120,3,$28.00,0,Add as negative keyword - High Priority
service,Broad,100,2,$22.00,1,Monitor - evaluate based on strategy`;

      addMessage({
        type: 'assistant',
        content: `🎯 Analysis Complete! I found 47 potential negative keywords that could save you approximately $2,340 per month.

Key Findings:
• Total search terms analyzed: 2,847
• Campaigns reviewed: 12
• Potential monthly savings: $2,340
• Estimated CTR improvement: +0.8%`,
        csvContentData: csvContent,
        showApprovalButtons: true
      });
      updateSystemLog('Analysis complete - Ready for next steps');
      setIsProcessing(false);
    }, 7500));

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  };

  const handleManualUpload = () => {
    // Hide the auth panel by marking auth as completed
    setAuthCompleted(true);
    
    // Manual upload flow
    setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: `Perfect! Please upload your Google Ads search terms report.

How to get this data from Google Ads:
1. Go to Keywords → Search terms
2. Select your date range (recommend last 30-90 days)
3. Click Download → CSV or xlsx or xls format is fine

Once you upload the file, I'll analyze it and provide negative keyword recommendations.`,
      });
      updateSystemLog('Ready to analyze your uploaded data');
      setIsProcessing(false);
    }, 1500);
  };

  const handleApproveRecommendations = () => {
    // Hide approval buttons by updating the message
    setMessages(prev => prev.map(msg => 
      msg.showApprovalButtons ? { ...msg, showApprovalButtons: false } : msg
    ));

    addMessage({
      type: 'user',
      content: 'Approve Recommendations',
    });

    setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: `✅ Recommendations approved! 

I'll now implement these negative keywords in your Google Ads account:

• Adding 15 high-priority negative keywords
• Applying broad match negatives to all campaigns
• Setting up phrase match negatives for specific ad groups
• Creating monitoring alerts for the "monitor" keywords

Implementation will be completed within the next 15 minutes. You'll receive an email confirmation once all changes are live.

Expected impact:
• Reduced wasted spend: ~$2,340/month
• Improved CTR: +0.8%
• Better conversion rates: +12%`,
      });
      updateSystemLog('Implementation in progress');
    }, 1500);
  };

  const handleProvideFeedback = () => {
    // Hide approval buttons by updating the message
    setMessages(prev => prev.map(msg => 
      msg.showApprovalButtons ? { ...msg, showApprovalButtons: false } : msg
    ));

    addMessage({
      type: 'user',
      content: 'Provide Feedback',
    });

    setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: `I'd love to hear your feedback on these recommendations! Please let me know:

• Are there any keywords you'd like to keep that I recommended as negatives?
• Do you see any important negative keywords missing from the list?
• Would you like me to adjust the priority levels for any recommendations?
• Are there specific campaigns or ad groups where you'd like different treatment?

Just type your feedback below and I'll refine the recommendations accordingly.`,
      });
      updateSystemLog('Waiting for your feedback');
    }, 1500);
  };

  const handleSavePlaybook = () => {
    // In a real app, this would save the current query and flow as a reusable playbook
    console.log('Saving playbook for query:', initialQuery);
    
    // Simulate API call
    setTimeout(() => {
      setSavePlaybookSuccess(true);
      setShowSavePlaybook(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSavePlaybookSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleDismissSavePlaybook = () => {
    setShowSavePlaybook(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: AttachedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    setAttachedFiles(prev => [...prev, ...newFiles]);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Handle Q&A flow responses
    if (queryFlowStep === 1) {
      addMessage({
        type: 'user',
        content: newMessage,
      });

      const userResponse = newMessage;
      setNewMessage('');
      updateSystemLog('Analyzing your responses and creating a personalized plan...');
      setIsProcessing(true);

      // Store the user's answers
      setUserAnswers([userResponse]);

      setTimeout(() => {
        addMessage({
          type: 'assistant',
          content: `Perfect! Based on your responses and the original query "${currentQueryContext}", here's your personalized Amazon ads scaling plan:

Scaling Strategy Analysis

Your Input: ${userResponse}

Priority Opportunities

1. Campaign Structure Optimization
• Analyze your top-performing ASINs for scaling potential
• Implement campaign segmentation by performance tiers
• Set up dedicated campaigns for your best sellers

2. Keyword Expansion Strategy
• Identify high-converting search terms from auto campaigns
• Research competitor keywords in your top categories
• Implement broad-to-exact keyword harvesting

3. Budget Reallocation Plan
• Shift budget from underperforming campaigns
• Increase bids on profitable keywords during peak hours
• Test higher budgets on campaigns with impression share loss

Next Steps

1. Week 1: Audit current campaign structure and performance
2. Week 2: Implement keyword expansion and budget optimization
3. Week 3: Launch new campaigns for top opportunities
4. Week 4: Monitor and optimize based on performance data

Expected Results
• 20-40% increase in sales volume
• 10-15% improvement in overall ACoS
• Better inventory velocity for top products

Would you like me to dive deeper into any of these strategies or help you implement specific recommendations?`,
        });
        
        // Reset Q&A flow
        setQueryFlowStep(0);
        setCurrentQueryContext('');
        setUserAnswers([]);
        
        // Show save playbook option after analysis completes
        setTimeout(() => {
          setShowSavePlaybook(true);
        }, 1000);
        
        updateSystemLog('Ready for your next question');
        setIsProcessing(false);
      }, 3000);

      return;
    }

    // Regular message handling for non-Q&A flow
    addUserMessage(newMessage, attachedFiles.length > 0 ? attachedFiles : undefined);
    
    // Clear attached files after sending
    setAttachedFiles([]);
    
    setNewMessage('');
    updateSystemLog('Processing your request...');
    setIsProcessing(true);

    setTimeout(() => {
      addMessage({
        type: 'assistant',
        content: 'Here is a simulated response to your message.',
      });
      updateSystemLog('Ready for your next question');
      setIsProcessing(false);
    }, 2000);
  };

  const renderAttachedFiles = (files: AttachedFile[]) => {
    if (!files || files.length === 0) return null;
    
    return (
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <FileChip
              key={file.id}
              fileName={file.name}
              size={file.size}
              type="attachment"
              className="bg-blue-50 border-blue-200 text-blue-800"
            />
          ))}
        </div>
      </div>
    );
  };

  const toggleMessageDetails = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isExpanded: !msg.isExpanded }
        : msg
    ));
  };

  const handleDownload = (fileName: string) => {
    // In a real app, this would trigger the actual file download
    console.log('Downloading file:', fileName);
    
    // Create mock content based on file type for demonstration
    let content = '';
    let mimeType = 'text/plain';
    
    if (fileName.includes('.csv')) {
      content = `Search Term,Match Type,Impressions,Clicks,Cost,Conversions,Recommendation
free,Broad,1250,45,$450.00,0,Add as negative keyword - High Priority
cheap,Phrase,890,32,$280.00,1,Add as negative keyword - High Priority
tutorial,Exact,670,28,$220.00,0,Add as negative keyword - High Priority
download,Broad,540,19,$180.00,0,Add as negative keyword - High Priority
review,Phrase,420,15,$120.00,2,Consider for broad match negative only
comparison,Broad,380,12,$95.00,1,Monitor - may keep for awareness
vs,Phrase,290,8,$75.00,1,Monitor - evaluate based on strategy`;
      mimeType = 'text/csv';
    } else if (fileName.includes('.xlsx')) {
      content = 'Keyword,Search Volume,Competition,CPC,Opportunity Score\namazon best seller,45000,High,$2.50,85\nproduct reviews,32000,Medium,$1.80,78\ntop rated,28000,Low,$1.20,92';
      mimeType = 'text/csv'; // For demo purposes, we'll use CSV format
    } else if (fileName.includes('.pdf')) {
      content = 'Amazon Ads Scaling Strategy Report\n\nExecutive Summary:\nThis report contains comprehensive scaling recommendations for your Amazon advertising campaigns...\n\n1. Campaign Structure Optimization\n2. Keyword Expansion Strategy\n3. Budget Reallocation Plan';
      mimeType = 'text/plain';
    } else {
      content = `Content for ${fileName}`;
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

  const getPlaceholderText = () => {
    return "Type your message...";
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
        {/* Header - Removed Back button, kept other elements */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#FAFAFA]">
          <div className="flex items-center space-x-4">
            {runningPlaybookId && (
              <div className="flex items-center space-x-2">
                <Play size={16} className="text-[#FF7F50]" />
                <span className="text-sm font-medium text-gray-700">
                  Running: {getPlaybookTitle(runningPlaybookId)}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Save Playbook Button - Only show for regular queries (not running playbooks) */}
            
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

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => {
              // Skip rendering auth messages if auth is completed
              if (message.type === 'auth' && authCompleted) {
                return null;
              }

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 
                    message.type === 'auth' ? 'justify-center' : 'justify-start'
                  } mb-6`}
                >
                  <div className={`${
                    message.type === 'user' 
                      ? 'max-w-[80%] bg-gray-100 text-gray-800 rounded-2xl p-4 border border-gray-200' 
                      : message.type === 'auth'
                      ? 'bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 w-full max-w-md'
                      : message.isCollapsible 
                      ? 'bg-[#FFF5F2] border border-[#FFE5DC] rounded-2xl overflow-hidden w-full max-w-[80%]'
                      : message.csvContentData
                      ? 'w-full max-w-[90%]'
                      : 'max-w-[80%] bg-white text-gray-800 shadow-sm rounded-2xl p-4'
                  }`}>
                    {message.type === 'auth' ? (
                      <>
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Shield size={24} className="text-blue-600" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Google Ads Authentication Required
                          </h3>
                          <p className="text-sm text-gray-600 mb-6">
                            {message.content}
                          </p>
                          
                          {message.showAuthButtons && (
                            <div className="space-y-3">
                              <button
                                onClick={handleGoogleAdsAuth}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <img 
                                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                                  alt="Google" 
                                  className="w-5 h-5"
                                />
                                <span>Connect Google Ads Account</span>
                                <ExternalLink size={16} />
                              </button>
                              
                              <div className="flex items-center my-4">
                                <div className="flex-grow h-px bg-gray-200"></div>
                                <span className="px-4 text-sm text-gray-500">OR</span>
                                <div className="flex-grow h-px bg-gray-200"></div>
                              </div>
                              
                              <button
                                onClick={handleManualUpload}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                              >
                                <Upload size={16} />
                                <span>Upload Search Terms Data Manually</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    ) : message.isCollapsible ? (
                      <>
                        <button
                          onClick={() => toggleMessageDetails(message.id)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#FFE5DC] transition-colors"
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <div className="w-2 h-2 bg-[#FF7F50] rounded-full animate-pulse flex-shrink-0"></div>
                            <span className="text-sm font-medium text-black truncate">{message.content}</span>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            {message.isExpanded ? (
                              <ChevronUp size={16} className="text-gray-500" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-500" />
                            )}
                          </div>
                        </button>

                        {message.isExpanded && message.details && (
                          <div className="px-4 pb-4 border-t border-[#FFE5DC] bg-white">
                            <div className="space-y-2 pt-3">
                              {message.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : message.csvContentData ? (
                      <div className="bg-white text-gray-800 shadow-sm rounded-2xl p-4">
                        <div className="whitespace-pre-wrap text-sm font-medium text-black mb-4">
                          {message.content}
                        </div>
                        <CsvDataTable 
                          csvString={message.csvContentData} 
                          fileName="negative-keywords-recommendations.csv"
                          onApprove={handleApproveRecommendations}
                          onFeedback={handleProvideFeedback}
                          showActions={message.showApprovalButtons}
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="whitespace-pre-wrap text-sm font-medium text-black">
                          {message.content}
                        </div>
                        {message.hasDownload && message.downloadFileName && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <FileChip
                              fileName={message.downloadFileName}
                              onClick={() => handleDownload(message.downloadFileName!)}
                              type="download"
                            />
                          </div>
                        )}
                        {/* Render attached files for user messages */}
                        {message.type === 'user' && message.attachedFiles && (
                          renderAttachedFiles(message.attachedFiles)
                        )}
                        {/* Render download files */}
                        {message.downloadFiles && message.downloadFiles.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="space-y-2">
                              {message.downloadFiles.map((file) => (
                                <div key={file.id} className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0 mr-3">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                      {file.name}
                                    </div>
                                    {file.description && (
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        {file.description}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleDownload(file.name)}
                                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-[#FF7F50] hover:bg-[#FFF5F2] rounded-lg transition-colors flex-shrink-0"
                                  >
                                    <Download size={14} />
                                    <span>Download</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Status & Input Area */}
        <div className="px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            {/* Save Playbook Success Message */}
            {savePlaybookSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3 animate-in slide-in-from-bottom duration-300 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-900">Playbook Saved Successfully!</h4>
                  <p className="text-sm text-green-700">You can now find this analysis in "My Agents" and reuse it anytime.</p>
                </div>
              </div>
            )}

            {/* Save Playbook Suggestion Card */}
            {showSavePlaybook && !runningPlaybookId && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 animate-in slide-in-from-bottom duration-300 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">💡</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Save as Reusable Playbook</h4>
                      <p className="text-sm text-gray-600">Turn this analysis into a playbook you can run again with different data</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDismissSavePlaybook}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={handleSavePlaybook}
                     className="flex items-center space-x-2 px-4 py-2 bg-[#FF7F50] text-white rounded-lg hover:bg-[#E67348] transition-colors text-sm font-medium"
                    >
                      <span>💾</span>
                      <span>Save Playbook</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#FFF5F2] rounded-t-lg p-3 flex items-center gap-3">
              {isProcessing ? (
                <Loader2 size={16} className="text-[#FF7F50] animate-spin" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              )}
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-[#FF7F50] font-medium">
                  {systemLog}
                </span>
                <button
                  onClick={() => setShowLogDrawer(true)}
                  className="text-xs text-gray-500 hover:text-[#FF7F50] transition-colors underline"
                >
                  View Logs
                </button>
              </div>
            </div>

            <div className="relative bg-white rounded-b-2xl shadow-sm">
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
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getPlaceholderText()}
                className="w-full min-h-[120px] p-4 bg-transparent rounded-b-2xl focus:outline-none resize-none text-[#333333] placeholder-gray-400"
                disabled={isProcessing}
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <AgentSelector />
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleFileAttachment}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isProcessing}
                    title="Attach files"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isProcessing}
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
        </div>
      </div>

      {/* Bottom Drawer Logs */}
      <BottomDrawerLogs
        logHistory={systemLogHistory}
        isOpen={showLogDrawer}
        onClose={() => setShowLogDrawer(false)}
      />
    </div>
  );
};

export default ChatPage;