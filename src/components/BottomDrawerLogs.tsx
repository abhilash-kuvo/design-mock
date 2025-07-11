import React from 'react';
import { X, Clock, Activity, ChevronUp, ChevronDown } from 'lucide-react';

interface SystemLogEntry {
  id: string;
  message: string;
  timestamp: Date;
}

interface BottomDrawerLogsProps {
  logHistory: SystemLogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

const BottomDrawerLogs: React.FC<BottomDrawerLogsProps> = ({
  logHistory,
  isOpen,
  onClose,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Group logs by date
  const groupedLogs = logHistory.reduce((groups, log) => {
    const dateKey = log.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(log);
    return groups;
  }, {} as Record<string, SystemLogEntry[]>);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Bottom Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '60vh', maxHeight: '500px' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity size={20} className="text-[#FF7F50]" />
              <h3 className="text-lg font-semibold text-[#333333]">System Logs</h3>
              <span className="text-sm text-gray-500">({logHistory.length} entries)</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Collapse indicator */}
              <div className="flex items-center text-xs text-gray-400">
                <ChevronDown size={16} />
                <span>Drag or click to close</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {logHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Activity size={48} className="text-gray-300 mb-4" />
              <h4 className="text-lg font-medium text-gray-500 mb-2">No logs yet</h4>
              <p className="text-sm text-gray-400">
                System activities will appear here as they occur
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {Object.entries(groupedLogs)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([dateKey, logs]) => (
                  <div key={dateKey}>
                    {/* Date Header */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {formatDate(new Date(dateKey))}
                      </span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    {/* Log Entries for this date */}
                    <div className="space-y-3">
                      {logs
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .map((log) => (
                          <div
                            key={log.id}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-2 h-2 bg-[#FF7F50] rounded-full"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Clock size={12} className="text-gray-400" />
                                  <span className="text-xs font-medium text-gray-500">
                                    {formatTime(log.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-[#333333] leading-relaxed">
                                  {log.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Drag Handle (Visual Indicator) */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </>
  );
};

export default BottomDrawerLogs;