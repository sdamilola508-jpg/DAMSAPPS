import React from 'react';
import { HistoryItem } from '../types';
import { X, Clock, Trash2 } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 max-w-[80vw] bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
              <Clock size={20} />
              <h2 className="font-semibold text-lg">History</h2>
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button 
                  onClick={onClear}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  aria-label="Clear history"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                <Clock size={48} className="mb-4 opacity-20" />
                <p>No history yet</p>
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="w-full text-right p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 border border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-all group"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.expression}
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                    = {item.result}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};