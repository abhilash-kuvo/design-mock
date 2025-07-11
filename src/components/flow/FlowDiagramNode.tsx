import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface FlowDiagramNodeData {
  label: string;
  stepNumber: number;
  isStart?: boolean;
  isEnd?: boolean;
}

const FlowDiagramNode: React.FC<NodeProps<FlowDiagramNodeData>> = ({ data, selected }) => {
  const { isStart, isEnd } = data;

  return (
    <div className={`relative bg-white border-2 rounded-lg p-3 min-w-[180px] shadow-sm transition-all duration-200 ${
      selected ? 'border-[#FF7F50] shadow-lg' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Step Number Badge */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#FF7F50] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
        {data.stepNumber}
      </div>
      
      {/* Node Content */}
      <div className="text-sm font-medium leading-tight text-[#333333]">
        {data.label}
      </div>
      
      {/* Input Handle - not shown for start nodes */}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}
      
      {/* Output Handle - not shown for end nodes */}
      {!isEnd && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}
    </div>
  );
};

export default FlowDiagramNode;