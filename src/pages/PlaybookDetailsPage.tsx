import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Edit3, X, Send, Loader2, Copy, CheckCircle, Paperclip, FileText, Image, File } from 'lucide-react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from '../components/dashboard/Sidebar';
import Button from '../components/ui/Button';
import FlowDiagramNode from '../components/flow/FlowDiagramNode';
import NodeDetailsPanel from '../components/flow/NodeDetailsPanel';

interface PlaybookDetailsPageProps {
  playbookId: string;
  onBack: () => void;
  onNewPlaybook: () => void;
  onMyPlaybooks: () => void;
  onRunPlaybook?: (playbookId: string, playbookTitle: string) => void;
  isFromLibrary?: boolean;
  onClonePlaybook?: (playbookId: string) => void;
  showInitialCloneMessage?: boolean;
  onCloneMessageDisplayed?: () => void;
  onNavigateToConnectedAccounts: () => void;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

// Define custom node types
const nodeTypes = {
  flowDiagramNode: FlowDiagramNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'flowDiagramNode',
    data: { 
      label: 'Start: Data Collection',
      stepNumber: 1,
      isStart: true
    },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    type: 'flowDiagramNode',
    data: { 
      label: 'Analyze Campaign Performance',
      stepNumber: 2
    },
    position: { x: 250, y: 125 },
  },
  {
    id: '3',
    type: 'flowDiagramNode',
    data: { 
      label: 'Identify Negative Keywords',
      stepNumber: 3
    },
    position: { x: 100, y: 225 },
  },
  {
    id: '4',
    type: 'flowDiagramNode',
    data: { 
      label: 'Generate Recommendations',
      stepNumber: 4
    },
    position: { x: 400, y: 225 },
  },
  {
    id: '5',
    type: 'flowDiagramNode',
    data: { 
      label: 'Export Results',
      stepNumber: 5,
      isEnd: true
    },
    position: { x: 250, y: 325 },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true,
    style: { stroke: '#FF7F50', strokeWidth: 2 }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    animated: true,
    style: { stroke: '#FF7F50', strokeWidth: 2 }
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    animated: true,
    style: { stroke: '#FF7F50', strokeWidth: 2 }
  },
  { 
    id: 'e3-5', 
    source: '3', 
    target: '5', 
    animated: true,
    style: { stroke: '#FF7F50', strokeWidth: 2 }
  },
  { 
    id: 'e4-5', 
    source: '4', 
    target: '5', 
    animated: true,
    style: { stroke: '#FF7F50', strokeWidth: 2 }
  },
];

const PlaybookDetailsPage: React.FC<PlaybookDetailsPageProps> = ({
  playbookId,
  onBack,
  onNewPlaybook,
  onMyPlaybooks,
  onRunPlaybook,
  isFromLibrary = false,
  onClonePlaybook,
  showInitialCloneMessage = false,
  onCloneMessageDisplayed,
  onNavigateToConnectedAccounts,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editInstructions, setEditInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showViewModeTip, setShowViewModeTip] = useState(true);
  const [showCloneMessage, setShowCloneMessage] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle initial clone message display
  useEffect(() => {
    if (showInitialCloneMessage) {
      setShowCloneMessage(true);
      
      // Hide the message after 3 seconds
      const timer = setTimeout(() => {
        setShowCloneMessage(false);
        if (onCloneMessageDisplayed) {
          onCloneMessageDisplayed();
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showInitialCloneMessage, onCloneMessageDisplayed]);

  // Mock playbook data - in a real app, this would come from an API
  const playbook = {
    id: playbookId,
    title: 'Google Ads Negative Keywords Optimizer',
    description: 'Analyze my Google Ads campaigns and recommend negative keywords to improve ROI and campaign performance across all ad groups.',
    lastModified: '2 days ago',
    status: 'Active',
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleEditMode = () => {
    if (isFromLibrary) return; // Prevent edit mode when viewing from library
    setIsEditMode(true);
    setEditInstructions('');
    setAttachedFiles([]);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditInstructions('');
    setAttachedFiles([]);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image size={14} className="text-blue-500" />;
    } else if (fileType.includes('text') || fileType.includes('document')) {
      return <FileText size={14} className="text-green-500" />;
    } else {
      return <File size={14} className="text-gray-500" />;
    }
  };

  const handleApplyChanges = async () => {
    if (!editInstructions.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate API call to process natural language instructions
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would send the instructions and files to an AI service
    // and update the flow diagram based on the response
    console.log('Applying changes:', {
      selectedNode: selectedNode?.id,
      selectedStep: selectedNode?.data?.stepNumber,
      instructions: editInstructions,
      attachedFiles: attachedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
    });
    
    setIsProcessing(false);
    setEditInstructions('');
    setAttachedFiles([]);
  };

  const handleExecutePlaybook = () => {
    if (onRunPlaybook) {
      onRunPlaybook(playbookId, playbook.title);
    }
  };

  const handleClonePlaybook = () => {
    if (onClonePlaybook) {
      onClonePlaybook(playbookId);
    }
  };

  const handleCloseNodeDetails = () => {
    setSelectedNode(null);
  };

  const handleCloseTip = () => {
    setShowViewModeTip(false);
  };

  const getPlaceholderText = () => {
    const baseText = selectedNode 
      ? `Describe changes for Step ${selectedNode.data.stepNumber}...`
      : "Describe the changes you want to make to the entire playbook...";
    
    const examples = `

Examples:
• "Add a new step after Step 2 to validate inputs"
• "Change Step 3 to include competitor analysis"  
• "Remove Step 4 and connect Step 3 directly to Step 5"
• "Insert a decision point before the final step"
• "Change the date range configuration to last 60 days"
• "Update the performance threshold to CTR < 1.5%"

You can also edit step configurations and settings using natural language instructions.`;

    return baseText + examples;
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
        {/* Clone Success Message */}
        {showCloneMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-right duration-300">
            <CheckCircle size={20} />
            <span className="font-medium">Agent successfully cloned to your collection!</span>
          </div>
        )}

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
              <h1 className="text-lg font-semibold text-[#333333]">{playbook.title}</h1>
              <p className="text-sm text-gray-500">
                {isFromLibrary ? 'From Agent Library' : `Last modified: ${playbook.lastModified}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isFromLibrary ? (
              // Show only Clone button when viewing from library
              <Button
                variant="primary"
                onClick={handleClonePlaybook}
                icon={<Copy size={16} />}
              >
                Clone to My Agents
              </Button>
            ) : (
              // Show Edit and Run buttons when viewing from My Playbooks
              <>
                <Button
                  variant="outline"
                  onClick={handleEditMode}
                  icon={<Edit3 size={16} />}
                  disabled={isEditMode}
                >
                  Edit Agent
                </Button>
                {!isEditMode && (
                  <Button
                    variant="primary"
                    onClick={handleExecutePlaybook}
                    icon={<Play size={16} />}
                  >
                    Run Agent
                  </Button>
                )}
              </>
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

        {/* Main Content */}
        <div className="flex-1 relative flex">
          {/* Left Panel - AI Edit Mode (only show if not from library) */}
          {isEditMode && !isFromLibrary && (
            <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col h-full">
              {/* Panel Header */}
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#333333]">Edit Agent with AI</h3>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Selected Node Indicator */}
              {selectedNode && (
                <div className="p-3 bg-[#FFF5F2] border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-[#FF7F50] text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {selectedNode.data.stepNumber}
                      </div>
                      <span className="text-sm font-medium text-[#FF7F50]">
                        Step {selectedNode.data.stepNumber}: {selectedNode.data.label}
                      </span>
                    </div>
                    <button
                      onClick={handleCloseNodeDetails}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Your instructions will apply to this specific step.
                  </p>
                </div>
              )}

              {/* Instructions Input - Takes available space */}
              <div className="flex-1 p-4 flex flex-col min-h-0">
                <textarea
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F50] focus:border-transparent resize-none text-sm min-h-0"
                />

                {/* File Attachments Section */}
                {attachedFiles.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">
                        Attached Files ({attachedFiles.length})
                      </span>
                      {attachedFiles.length > 3 && (
                        <span className="text-xs text-gray-500">Scroll to see all</span>
                      )}
                    </div>
                    <div 
                      className="space-y-1.5 max-h-20 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#FF7F50 #f1f1f1'
                      }}
                    >
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          width: 6px;
                        }
                        div::-webkit-scrollbar-track {
                          background: #f1f1f1;
                          border-radius: 3px;
                        }
                        div::-webkit-scrollbar-thumb {
                          background: #FF7F50;
                          border-radius: 3px;
                        }
                        div::-webkit-scrollbar-thumb:hover {
                          background: #E67348;
                        }
                      `}</style>
                      {attachedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-white rounded-md p-1.5 shadow-sm border border-gray-100">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-0.5 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                          >
                            <X size={12} className="text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panel Actions - Compact inline layout */}
              <div className="p-4 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  {/* File Attachment Button */}
                  <button
                    onClick={handleFileAttachment}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                  >
                    <Paperclip size={16} />
                    <span>Attach</span>
                  </button>

                  {/* Apply Changes Button - takes remaining space */}
                  <Button
                    variant="primary"
                    onClick={handleApplyChanges}
                    disabled={!editInstructions.trim() || isProcessing}
                    isLoading={isProcessing}
                    icon={!isProcessing ? <Send size={16} /> : undefined}
                    className="flex-1"
                  >
                    {isProcessing ? 'Processing...' : 'Apply Changes'}
                  </Button>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.gif"
              />
            </div>
          )}

          {/* Flow Diagram Area */}
          <div 
            className="flex-1 h-full relative transition-all duration-300"
            style={{ 
              marginLeft: isEditMode && !isFromLibrary ? 0 : 0,
              marginRight: selectedNode ? 0 : 0 
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
              className="cursor-pointer"
            >
              <Controls />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
            
            {/* Instruction cues */}
            {isEditMode && !selectedNode && !isFromLibrary && (
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-20">
                <p className="text-sm text-gray-600">
                  Click on any step to select it for editing
                </p>
              </div>
            )}

            {!isEditMode && !selectedNode && showViewModeTip && (
              <div className="absolute top-4 right-4 bg-yellow-100 rounded-lg shadow-lg p-3 z-20 border border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-black mr-3">
                    Click on any task to view details
                  </p>
                  <button
                    onClick={handleCloseTip}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Node Details */}
          {selectedNode && (
            <NodeDetailsPanel 
              selectedNode={selectedNode}
              onClose={handleCloseNodeDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaybookDetailsPage;