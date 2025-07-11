import React from 'react';
import { Download, File, FileText, Image } from 'lucide-react';

interface FileChipProps {
  fileName: string;
  onClick?: () => void;
  type?: 'download' | 'attachment';
  icon?: React.ReactNode;
  size?: number;
  className?: string;
}

const FileChip: React.FC<FileChipProps> = ({
  fileName,
  onClick,
  type = 'download',
  icon,
  size,
  className = '',
}) => {
  const getDefaultIcon = () => {
    if (icon) return icon;
    
    if (type === 'download') {
      return <Download size={14} className="text-[#FF7F50]" />;
    }
    
    // For attachments, determine icon based on file extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension && ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
      return <Image size={14} className="text-blue-500" />;
    } else if (extension && ['txt', 'doc', 'docx', 'pdf'].includes(extension)) {
      return <FileText size={14} className="text-green-500" />;
    } else {
      return <File size={14} className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const baseClasses = `
    inline-flex items-center space-x-2 px-3 py-2 
    bg-[#FFF5F2] border border-[#FFE5DC] rounded-full 
    text-sm font-medium text-[#333333]
    transition-all duration-200
    ${onClick ? 'hover:bg-[#FFE5DC] hover:border-[#FFCAB0] cursor-pointer hover:shadow-sm' : ''}
  `;

  const content = (
    <>
      {getDefaultIcon()}
      <span className="truncate max-w-[200px]">{fileName}</span>
      {size && <span className="text-xs text-gray-500">({formatFileSize(size)})</span>}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {content}
    </div>
  );
};

export default FileChip;