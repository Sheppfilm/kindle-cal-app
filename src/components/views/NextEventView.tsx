
import React from 'react';

interface NextEventViewProps {
  currentTime: Date;
}

export const NextEventView: React.FC<NextEventViewProps> = ({ currentTime }) => {
  // Mock next event data - replace with actual calendar integration
  const nextEvent = {
    title: 'PROJECT MEETING',
    time: new Date(currentTime.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    location: 'CONFERENCE ROOM A',
    description: 'QUARTERLY REVIEW DISCUSSION'
  };

  const getTimeUntilEvent = (eventTime: Date) => {
    const diff = eventTime.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}H ${minutes}M`;
    }
    return `${minutes}M`;
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-8 tracking-tight">
        NEXT EVENT
      </h2>
      
      <div className="border-4 border-black p-8 bg-white">
        <div className="text-center mb-8">
          <div className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            {nextEvent.title}
          </div>
          <div className="text-2xl font-bold text-gray-700 mb-2">
            {nextEvent.time.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="text-lg font-bold">
            {nextEvent.location}
          </div>
        </div>
        
        <div className="border-t-2 border-black pt-6 text-center">
          <div className="text-sm font-bold text-gray-600 mb-2">
            TIME REMAINING
          </div>
          <div className="text-3xl font-bold">
            {getTimeUntilEvent(nextEvent.time)}
          </div>
        </div>
        
        {nextEvent.description && (
          <div className="border-t-2 border-black pt-6 mt-6">
            <div className="text-sm font-bold text-gray-600 mb-2">
              DESCRIPTION
            </div>
            <div className="font-bold">
              {nextEvent.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
