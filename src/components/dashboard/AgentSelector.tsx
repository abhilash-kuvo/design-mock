import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const agents = ['Auto', 'Google Ads', 'Amazon Ads', 'Meta Ads'];

const AgentSelector: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-1"
      >
        <span>{selectedAgent}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-max bg-white border border-gray-200 rounded-xl shadow-lg z-10">
          {agents.map((agent) => (
            <button
              key={agent}
              onClick={() => {
                setSelectedAgent(agent);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 text-[#333333] text-sm first:rounded-t-xl last:rounded-b-xl whitespace-nowrap"
            >
              {agent}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentSelector;