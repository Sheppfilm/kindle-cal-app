
import React from 'react';

type ViewMode = 'day' | 'week' | 'month' | 'next';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const views: { key: ViewMode; label: string }[] = [
    { key: 'day', label: 'DAY' },
    { key: 'next', label: 'NEXT' },
    { key: 'week', label: 'WEEK' },
    { key: 'month', label: 'MONTH' }
  ];

  return (
    <div className="flex gap-0">
      {views.map((view) => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          className={`px-6 py-3 border-2 border-black font-bold text-sm tracking-wide transition-colors flex-1 ${
            currentView === view.key
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};
