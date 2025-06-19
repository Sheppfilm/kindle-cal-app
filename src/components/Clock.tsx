
import React from 'react';

interface ClockProps {
  currentTime: Date;
}

export const Clock: React.FC<ClockProps> = ({ currentTime }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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
    <div className="p-8 text-center">
      <div className="text-6xl md:text-8xl font-bold tracking-wider mb-4">
        {formatTime(currentTime)}
      </div>
      <div className="text-lg md:text-xl font-bold tracking-widest text-gray-700">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};
