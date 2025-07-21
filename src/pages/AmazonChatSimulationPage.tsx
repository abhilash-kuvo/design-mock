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

interface AmazonChatSimulationPageProps {
  initialQuery: string;
  runningPlaybookId?: string;
  onBack: () => void;
  onNewPlaybook: () => void;
  onMyPlaybooks: () => void;
  onNavigateToConnectedAccounts: () => void;
}

const AmazonChatSimulationPage: React.FC<AmazonChatSimulationPageProps> = ({ 
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
  const [showSavePlaybookCard, setShowSavePlaybookCard] = useState(false);

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
      // Clear existing messages first for playbook runs
      if (runningPlaybookId) {
        setMessages([]);
      }

      // NEW AMAZON ADS SIMULATION - Completely different behavior
      if (runningPlaybookId === '2') {
        const playbookTitle = getPlaybookTitle(runningPlaybookId);
        
        addMessage({
          type: 'assistant',
          content: `🚀 Starting Advanced Amazon Ads Analysis: ${playbookTitle}`,
        });

        updateSystemLog('Connecting to Amazon Advertising API...');

        const timeouts: NodeJS.Timeout[] = [];

        // Step 1: API Connection
        timeouts.push(setTimeout(() => {
          addMessage({
            type: 'assistant',
            content: 'Step 1: Establishing secure connection to Amazon Advertising API',
            isCollapsible: true,
            details: [
              'Authenticating with Amazon Seller Central',
              'Retrieving campaign data from the last 90 days',
              'Accessing product catalog and inventory levels',
              'Collecting competitor intelligence data'
            ]
          });
          updateSystemLog('Analyzing campaign performance data...');
        }, 1500));

        // Step 2: Data Analysis
        timeouts.push(setTimeout(() => {
          addMessage({
            type: 'assistant',
            content: 'Step 2: Advanced performance analysis in progress',
            isCollapsible: true,
            details: [
              'Processing 15,000+ search terms across 8 campaigns',
              'Analyzing ACoS trends and seasonal patterns',
              'Identifying top-performing ASINs and keywords',
              'Calculating inventory velocity and profit margins'
            ]
          });
          updateSystemLog('Generating scaling recommendations...');
        }, 3000));

        // Step 3: AI-Powered Insights
        timeouts.push(setTimeout(() => {
          addMessage({
            type: 'assistant',
            content: 'Step 3: AI-powered scaling opportunity detection',
            isCollapsible: true,
            details: [
              'Machine learning analysis of 50+ performance metrics',
              'Competitor gap analysis and market opportunity sizing',
              'Predictive modeling for budget scaling scenarios',
              'Risk assessment for aggressive scaling strategies'
            ]
          });
          updateSystemLog('Finalizing recommendations and reports...');
        }, 4500));

        // Step 4: Results with Interactive Q&A
        timeouts.push(setTimeout(() => {
          addMessage({
            type: 'assistant',
            content: `🎯 **Amazon Ads Scaling Analysis Complete!**

I've identified **12 high-impact scaling opportunities** that could increase your sales by 40-60% while maintaining your target ACoS.

**Key Findings:**
• **$45,000** monthly revenue opportunity identified
• **3 underperforming campaigns** ready for optimization  
• **127 high-potential keywords** for expansion
• **5 competitor gaps** you can exploit immediately

**Priority Recommendations:**
1. **Campaign Budget Reallocation** - Shift $8,000/month to top performers
2. **Keyword Expansion** - Add 127 validated high-converting terms
3. **Bid Strategy Optimization** - Implement dynamic bidding on 15 ASINs
4. **New Campaign Launch** - Target 3 untapped product categories

Before I provide your detailed action plan, I need to understand your specific goals and constraints.`,
          });
          
          // Start interactive Q&A flow
          setTimeout(() => {
            addMessage({
              type: 'assistant',
              content: `**Quick Strategy Questions** (2-3 minutes)

To create your personalized scaling roadmap, please tell me:

**Question 1 of 3:** What's your primary goal for the next 90 days?

A) **Maximize Revenue** - Grow sales volume even if ACoS increases slightly
B) **Maintain Efficiency** - Scale while keeping current ACoS targets  
C) **Market Expansion** - Enter new product categories or keywords
D) **Competitive Defense** - Protect market share from competitors

Please type A, B, C, or D, or describe your specific goals.`,
            });
            setQueryFlowStep(1);
            setCurrentQueryContext(initialQuery);
            updateSystemLog('Waiting for your strategic input...');
            setIsProcessing(false);
          }, 1000);
        }, 6000));

        return () => {
          timeouts.forEach(timeout => clearTimeout(timeout));
        };
      }
    }
  }, [initialQuery, runningPlaybookId, addMessage, setMessages]);

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
    setShowSavePlaybookCard(false);
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

    // Handle Q&A flow responses for Amazon simulation
    if (queryFlowStep === 1) {
      addMessage({
        type: 'user',
        content: newMessage,
      });

      const userResponse = newMessage;
      setNewMessage('');
      updateSystemLog('Processing your goals and creating personalized strategy...');
      setIsProcessing(true);

      // Store the user's answers
      setUserAnswers([userResponse]);

      setTimeout(() => {
        // Generate response based on user's choice
        let responseContent = '';
        const choice = userResponse.toUpperCase().trim();
        
        if (choice === 'A' || userResponse.toLowerCase().includes('maximize revenue')) {
          responseContent = `**Perfect! Revenue Maximization Strategy Selected** 🚀

Based on your goal to maximize revenue, here's your aggressive scaling plan:

**90-Day Revenue Growth Roadmap:**

**Month 1: Foundation ($15K additional revenue)**
• Increase budgets by 40% on top 3 performing campaigns
• Launch 47 new high-volume keywords with aggressive bids
• Expand to 2 new product variations

**Month 2: Acceleration ($25K additional revenue)**  
• Scale successful keywords from Month 1
• Launch competitor conquest campaigns
• Implement dynamic bidding on all top ASINs

**Month 3: Optimization ($35K additional revenue)**
• Fine-tune based on performance data
• Launch seasonal/trending keyword campaigns
• Expand to related product categories

**Expected Results:**
• **Total Revenue Increase:** $75,000 over 90 days
• **ACoS Impact:** May increase by 15-20% initially, then stabilize
• **ROI Timeline:** Break-even by day 45, profitable by day 60`;
        } else if (choice === 'B' || userResponse.toLowerCase().includes('maintain efficiency')) {
          responseContent = `**Excellent! Efficiency-First Scaling Strategy Selected** ⚖️

Based on your goal to maintain ACoS while scaling, here's your balanced approach:

**90-Day Efficient Growth Roadmap:**

**Month 1: Smart Expansion ($8K additional revenue)**
• Increase budgets by 20% only on campaigns with ACoS < target
• Add 25 carefully selected high-converting keywords
• Optimize existing campaigns for better Quality Scores

**Month 2: Strategic Growth ($15K additional revenue)**
• Scale proven winners from Month 1
• Launch exact match campaigns for top search terms
• Implement dayparting for optimal bid timing

**Month 3: Compound Growth ($22K additional revenue)**
• Expand successful strategies across all campaigns
• Launch brand defense campaigns
• Test new ad formats (video, sponsored display)

**Expected Results:**
• **Total Revenue Increase:** $45,000 over 90 days
• **ACoS Impact:** Maintain current levels or improve by 5-10%
• **ROI Timeline:** Profitable from day 1`;
        } else {
          responseContent = `**Great Choice! Custom Strategy Development** 🎯

Based on your specific goals: "${userResponse}"

I'm creating a tailored approach that combines:
• Revenue growth opportunities aligned with your objectives
• Risk management to protect your current performance
• Scalable tactics that fit your business model

**Your Custom 90-Day Roadmap:**

**Phase 1: Strategic Foundation**
• Analyze your specific requirements in detail
• Identify the highest-impact, lowest-risk opportunities
• Create a testing framework for your unique situation

**Phase 2: Controlled Expansion**  
• Implement proven tactics from similar businesses
• Scale based on real performance data
• Adjust strategy based on market response

**Phase 3: Accelerated Growth**
• Double down on successful initiatives
• Expand to new opportunities
• Optimize for long-term sustainability

**Expected Results:**
• **Customized revenue targets** based on your goals
• **Risk-adjusted growth** that fits your comfort level
• **Flexible timeline** that adapts to your business needs`;
        }

        addMessage({
          type: 'assistant',
          content: responseContent,
          downloadFiles: [
            {
              id: 'custom-strategy-1',
              name: 'Amazon Scaling Strategy - 90 Day Plan.pdf',
              description: 'Your personalized scaling roadmap with week-by-week action items',
              type: 'pdf'
            },
            {
              id: 'keyword-expansion-1',
              name: 'High-Opportunity Keywords List.xlsx',
              description: '127 validated keywords with search volume and competition data',
              type: 'xlsx'
            },
            {
              id: 'budget-allocation-1',
              name: 'Campaign Budget Optimization Plan.csv',
              description: 'Detailed budget reallocation recommendations by campaign',
              type: 'csv'
            },
            {
              id: 'competitor-analysis-1',
              name: 'Competitor Gap Analysis Report.pdf',
              description: 'Market opportunities and competitive positioning insights',
              type: 'pdf'
            }
          ]
        });
        
        // Reset Q&A flow
        setQueryFlowStep(0);
        setCurrentQueryContext('');
        setUserAnswers([]);
        
        // Show save playbook option after analysis completes
        setTimeout(() => {
          setShowSavePlaybook(true);
          setShowSavePlaybookCard(true);
        }, 1000);
        
        updateSystemLog('Strategy complete - Ready for implementation');
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
      content = `Campaign,Current Budget,Recommended Budget,Expected Revenue Increase,Risk Level
Campaign A,$2000,$2800,$5600,Low
Campaign B,$1500,$2100,$4200,Low
Campaign C,$3000,$3600,$7200,Medium
Campaign D,$800,$1200,$2400,Low`;
      mimeType = 'text/csv';
    } else if (fileName.includes('.xlsx')) {
      content = 'Keyword,Search Volume,Competition,CPC,Opportunity Score,Recommended Action\namazon best seller,45000,High,$2.50,85,Add as Exact Match\nproduct reviews,32000,Medium,$1.80,78,Add as Phrase Match\ntop rated,28000,Low,$1.20,92,Add as Broad Match';
      mimeType = 'text/csv'; // For demo purposes, we'll use CSV format
    } else if (fileName.includes('.pdf')) {
      content = 'Amazon Ads Scaling Strategy - 90 Day Plan\n\nExecutive Summary:\nThis comprehensive scaling strategy is designed to increase your Amazon advertising revenue by $45,000 over the next 90 days while maintaining efficiency.\n\nWeek 1-2: Foundation Setup\n• Campaign audit and optimization\n• Keyword research and expansion\n• Budget reallocation\n\nWeek 3-4: Implementation\n• Launch new campaigns\n• Implement bidding strategies\n• Monitor performance metrics';
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
    if (queryFlowStep === 1) {
      return "Type A, B, C, D or describe your specific goals...";
    }
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
            {!runningPlaybookId && showSavePlaybook && (
              <button
                onClick={handleSavePlaybook}
                className="flex items-center space-x-2 px-4 py-2 bg-[#FF7F50] text-white rounded-lg hover:bg-[#E67348] transition-colors text-sm font-medium"
              >
                <span>🔖</span>
                <span>Save as Playbook</span>
              </button>
            )}
            
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
            {/* Save Playbook Success Message */}
            {savePlaybookSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3 animate-in slide-in-from-top duration-300 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-900">Playbook Saved Successfully!</h4>
                  <p className="text-sm text-green-700">You can now find this analysis in "My Playbooks" and reuse it anytime.</p>
                </div>
              </div>
            )}

            {messages.map((message, index) => {
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  } mb-6`}
                >
                  <div className={`${
                    message.type === 'user' 
                      ? 'max-w-[80%] bg-gray-100 text-gray-800 rounded-2xl p-4 border border-gray-200' 
                      : message.isCollapsible 
                      ? 'bg-[#FFF5F2] border border-[#FFE5DC] rounded-2xl overflow-hidden w-full max-w-[80%]'
                      : 'max-w-[80%] bg-white text-gray-800 shadow-sm rounded-2xl p-4'
                  }`}>
                    {message.isCollapsible ? (
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
                    ) : (
                      <div>
                        <div className="whitespace-pre-wrap text-sm font-medium text-black">
                          {message.content}
                        </div>
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
            {/* Save Playbook Suggestion Card - Above input area */}
            {showSavePlaybookCard && !runningPlaybookId && (
              <div className="bg-gradient-to-r from-[#FFF5F2] to-[#FFE5DC] border border-[#FFE5DC] rounded-xl p-4 mb-4 animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#FFE5DC] rounded-full flex items-center justify-center">
                      <span className="text-xl">🔖</span>
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
                      <span>🔖</span>
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

export default AmazonChatSimulationPage;