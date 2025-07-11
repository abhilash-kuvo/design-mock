import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PlaybookTileProps {
  title: string;
  onClick: () => void;
}

const PlaybookTile: React.FC<PlaybookTileProps> = ({ title, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex-1 bg-white border border-gray-200 p-4 rounded-xl hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 text-left group flex items-center justify-between gap-3"
    >
      <p className="text-sm font-medium leading-tight text-[#333333] group-hover:text-[#FF7F50] transition-colors">
        {title}
      </p>
      <ArrowRight size={16} className="text-gray-400 group-hover:text-[#FF7F50] transition-colors" />
    </button>
  );
};

export default PlaybookTile;