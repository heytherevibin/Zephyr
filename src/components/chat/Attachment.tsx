import React from 'react';
import { FileIcon, XIcon, DownloadIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AttachmentProps {
  id: string;
  filename: string;
  url: string;
  size?: number;
  type?: string;
  onDelete?: (id: string) => void;
  onDownload?: (url: string, filename: string) => void;
  className?: string;
}

export const Attachment: React.FC<AttachmentProps> = ({
  id,
  filename,
  url,
  size,
  type,
  onDelete,
  onDownload,
  className = '',
}) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
    >
      <div className="flex-shrink-0">
        <FileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {filename}
        </p>
        {size && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(size)}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        {onDownload && (
          <button
            onClick={() => onDownload(url, filename)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Download"
          >
            <DownloadIcon className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            title="Delete"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}; 