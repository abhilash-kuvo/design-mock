import React from 'react';
import { Download } from 'lucide-react';

interface CsvDataTableProps {
  csvString: string;
  fileName?: string;
  onApprove?: () => void;
  onFeedback?: () => void;
  showActions?: boolean;
}

const CsvDataTable: React.FC<CsvDataTableProps> = ({ 
  csvString, 
  fileName = 'data.csv',
  onApprove,
  onFeedback,
  showActions = false
}) => {
  // Parse CSV string into rows and columns
  const parseCSV = (csvText: string): string[][] => {
    const lines = csvText.trim().split('\n');
    return lines.map(line => {
      // Simple CSV parsing - handles basic cases
      const columns = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
      return columns;
    });
  };

  const handleDownload = () => {
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const data = parseCSV(csvString);
  const headers = data[0] || [];
  const rows = data.slice(1);

  return (
    <div className="space-y-4">
      {/* CSV Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header with download button */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Results</h3>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-[#FF7F50] hover:bg-[#FFF5F2] rounded-lg transition-colors"
          >
            <Download size={14} />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Scrollable table container */}
        <div 
          className="overflow-auto max-h-80"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#FF7F50 #f1f1f1'
          }}
        >
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-gray-900 whitespace-nowrap text-sm"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons - Left aligned */}
      {showActions && (
        <div className="flex items-center space-x-3">
          <button
            onClick={onApprove}
            className="w-40 bg-[#FF7F50] text-white py-2 px-3 rounded-lg hover:bg-[#E67348] transition-colors font-medium text-sm"
          >
            Approve
          </button>
          <button
            onClick={onFeedback}
            className="w-40 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Provide Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default CsvDataTable;