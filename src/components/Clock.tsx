
import React from 'react';

interface ClockProps {
  currentTime: Date;
}

export const Clock: React.FC<ClockProps> = ({ currentTime }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toUpperCase();
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ 
        fontSize: '48px', 
        fontWeight: 'bold', 
        letterSpacing: '4px', 
        marginBottom: '10px',
        fontFamily: 'monospace'
      }}>
        {formatTime(currentTime)}
      </div>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: 'bold', 
        letterSpacing: '2px',
        color: '#666',
        fontFamily: 'monospace'
      }}>
        {formatDate(currentTime)}
      </div>
    </div>
  );
};
