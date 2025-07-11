import React from 'react';
import { X, Settings } from 'lucide-react';
import { Node } from 'reactflow';

interface NodeDetailsPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({ selectedNode, onClose }) => {
  if (!selectedNode) return null;

  const { data } = selectedNode;
  const { stepNumber, label, isStart, isEnd } = data;

  // Mock detailed information for each step
  const getNodeDetails = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return {
          description: [
            "Connects to your Google Ads account and gathers campaign performance data",
            "Collects keywords, CTR, CPC, and conversion metrics",
            "Establishes the foundation for comprehensive analysis"
          ],
          configurations: [
            { name: "Date Range", value: "Last 30 days" },
            { name: "Account Access", value: "Read-only" },
            { name: "Data Points", value: "Keywords, CTR, CPC, Conversions" }
          ]
        };
      case 2:
        return {
          description: [
            "Analyzes collected campaign data for performance patterns",
            "Identifies trends and optimization opportunities",
            "Processes raw data to extract meaningful insights"
          ],
          configurations: [
            { name: "Analysis Period", value: "30 days" },
            { name: "Performance Threshold", value: "CTR < 2%" },
            { name: "Cost Threshold", value: "CPC > $5" }
          ]
        };
      case 3:
        return {
          description: [
            "Identifies potential negative keywords from search terms",
            "Finds irrelevant terms driving traffic without conversions",
            "Focuses on high-spend, low-converting search queries"
          ],
          configurations: [
            { name: "Conversion Rate Threshold", value: "< 1%" },
            { name: "Minimum Spend", value: "$50" },
            { name: "Match Type", value: "Broad, Phrase" }
          ]
        };
      case 4:
        return {
          description: [
            "Generates actionable negative keyword recommendations",
            "Creates prioritized optimization suggestions",
            "Ranks recommendations by potential impact"
          ],
          configurations: [
            { name: "Recommendation Limit", value: "Top 50" },
            { name: "Priority Scoring", value: "Impact-based" },
            { name: "Export Format", value: "CSV, Excel" }
          ]
        };
      case 5:
        return {
          description: [
            "Exports recommendations in Google Ads-ready format",
            "Provides actionable results for easy implementation",
            "Includes detailed instructions and impact estimates"
          ],
          configurations: [
            { name: "Export Format", value: "Google Ads CSV" },
            { name: "Include Instructions", value: "Yes" },
            { name: "Email Report", value: "Enabled" }
          ]
        };
      default:
        return {
          description: ["This step performs a specific operation in the playbook workflow."],
          configurations: []
        };
    }
  };

  const nodeDetails = getNodeDetails(stepNumber);

  return (
    <div className="w-80 bg-white shadow-xl border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#FF7F50] text-white rounded-full flex items-center justify-center text-xs font-bold">
              {stepNumber}
            </div>
            <h3 className="text-base font-semibold text-[#333333]">Step Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <h4 className="text-sm font-medium text-[#333333] mb-1">{label}</h4>
        {(isStart || isEnd) && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isStart ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {isStart ? 'Start Node' : 'End Node'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Description */}
        <div>
          <h5 className="text-base font-medium text-[#333333] mb-3">Description</h5>
          <ul className="space-y-2">
            {nodeDetails.description.map((point, index) => (
              <li key={index} className="text-sm text-gray-600 leading-relaxed flex items-start">
                <span className="text-[#FF7F50] mr-2 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Configurations */}
        {nodeDetails.configurations.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Settings size={16} className="text-[#FF7F50]" />
              <h5 className="text-base font-medium text-[#333333]">Configurations</h5>
            </div>
            <div className="space-y-2">
              {nodeDetails.configurations.map((config, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-700">{config.name}</span>
                    <span className="text-sm text-gray-600">{config.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeDetailsPanel;