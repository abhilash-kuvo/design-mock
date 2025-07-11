import React from 'react';
import { Plus, PanelLeftClose, Book, Briefcase, RotateCcw } from 'lucide-react';

interface TaskHistory {
  title: string;
  date: string;
}

interface SidebarProps {
  isOpen: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNewPlaybook: () => void;
  onMyPlaybooks: () => void;
  forceExpanded?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onMouseEnter, 
  onMouseLeave,
  onNewPlaybook,
  onMyPlaybooks,
  forceExpanded = false
}) => {
  const taskHistory: TaskHistory[] = [
    { title: 'Google Ads Negative...', date: '15/03' },
    { title: 'Amazon Ads Opport...', date: '14/03' },
    { title: 'Flipkart Ad Ops work...', date: '13/03' },
  ];

  const handleContextClick = () => {
    // In a real app, this would open a context management interface
    console.log('Opening context management...');
  };

  const sidebarWidth = forceExpanded || isOpen ? 'w-64' : 'w-16';

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out ${sidebarWidth}`}
      onMouseEnter={!forceExpanded ? onMouseEnter : undefined}
      onMouseLeave={!forceExpanded ? onMouseLeave : undefined}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 flex flex-col items-center">
          <div className="text-[#FF7F50] font-bold text-2xl">K</div>
        </div>

        {/* My Agents Button */}
        <button
          onClick={onMyPlaybooks}
          className={`mx-3 mb-2 p-3 bg-white border-2 border-[#FF7F50] text-[#FF7F50] rounded-lg hover:bg-[#FFF5F2] transition-all duration-200 flex items-center justify-center ${
            (forceExpanded || isOpen) ? 'px-4' : 'px-2'
          }`}
        >
          <Book size={20} />
          {(forceExpanded || isOpen) && <span className="ml-2">My Agents</span>}
        </button>

        {/* Kuvo Agent Button */}
        <button
          onClick={onNewPlaybook}
          className={`mx-3 mb-4 p-3 bg-[#FF7F50] text-white rounded-lg hover:bg-[#E67348] transition-all duration-200 flex items-center justify-center ${
            (forceExpanded || isOpen) ? 'px-4' : 'px-2'
          }`}
        >
          <Plus size={20} />
          {(forceExpanded || isOpen) && <span className="ml-2">Kuvo Agent</span>}
        </button>

        {/* Recent Agent Runs - Only visible when sidebar is open */}
        {(forceExpanded || isOpen) && (
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Recent Agent Runs
              </h3>
              <div className="space-y-1">
                {taskHistory.map((task, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <RotateCcw size={14} className="text-[#FF7F50] flex-shrink-0" />
                      <span className="text-gray-600 text-sm group-hover:text-gray-900 truncate">
                        {task.title}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs group-hover:text-gray-600 whitespace-nowrap ml-2">
                      {task.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* Bottom Section - Context Button */}
        <div className="mt-auto p-4">
          {(forceExpanded || isOpen) ? (
            <button 
              onClick={handleContextClick}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 flex items-center transition-all duration-200 group"
            >
              <Briefcase className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              <span className="ml-3 text-gray-600 group-hover:text-gray-800 font-medium">Context</span>
            </button>
          ) : (
            <button 
              onClick={handleContextClick}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center transition-all duration-200 group"
            >
              <Briefcase className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;