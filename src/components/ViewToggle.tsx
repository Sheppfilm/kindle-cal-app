
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

  const buttonStyle = (isActive: boolean) => ({
    padding: '15px 20px',
    border: '2px solid black',
    backgroundColor: isActive ? 'black' : 'white',
    color: isActive ? 'white' : 'black',
    fontWeight: 'bold',
    fontSize: '14px',
    letterSpacing: '1px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    width: '25%',
    boxSizing: 'border-box' as const
  });

  return (
    <div style={{ display: 'table', width: '100%', borderCollapse: 'collapse' }}>
      {views.map((view) => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          style={buttonStyle(currentView === view.key)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};
