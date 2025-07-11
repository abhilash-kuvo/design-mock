import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Paperclip, Loader2, Play, ChevronDown, ChevronUp, CheckCircle, MessageSquare, Shield, ExternalLink, Upload } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import AgentSelector from '../components/dashboard/AgentSelector';
import UserProfileDropdown from '../components/layout/UserProfileDropdown';
import FileChip from '../components/ui/FileChip';

interface BuildPageProps {
  onSubmit: (query: string, files?: File[]) => void;
   onNewPlaybook: () => void;
   onMyPlaybooks: () => void;
}

const BuildPage: React.FC<BuildPageProps> = ({ 
  onSubmit, 
  onNewPlaybook,
  onMyPlaybooks
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      await onSubmit(query, attachedFiles);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
    // Reset the input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        onNewPlaybook={onNewPlaybook}
        onMyPlaybooks={onMyPlaybooks}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Build Agent</h1>
            <div className="relative">
              <button
                onClick={() => setShowAgentSelector(!showAgentSelector)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className="text-sm text-gray-700">
                  {selectedAgent || 'Select Agent'}
                </span>
                {showAgentSelector ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              {showAgentSelector && (
                <div className="absolute top-full left-0 mt-1 z-10">
                  <AgentSelector
                    onSelect={(agent) => {
                      setSelectedAgent(agent);
                      setShowAgentSelector(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <UserProfileDropdown />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Play className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Build Your Agent
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Describe what you want your agent to do, and we'll help you build it step by step.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Attachments */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {attachedFiles.map((file, index) => (
                    <FileChip
                      key={`${file.name}-${index}`}
                      fileName={file.name}
                      fileSize={file.size}
                      onRemove={() => handleRemoveFile(index)}
                    />
                  ))}
                </div>
              )}

              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your agent... (e.g., 'Create an agent that analyzes customer feedback and generates insights')"
                  className="w-full h-32 px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isLoading}
                />
                
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.gif,.zip"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    <span>{isLoading ? 'Building...' : 'Build Agent'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Smart Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  AI-powered analysis of your requirements to build the perfect agent
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Interactive Chat
                </h3>
                <p className="text-gray-600 text-sm">
                  Refine your agent through natural conversation and feedback
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600 text-sm">
                  Enterprise-grade security with reliable performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPage;