
import React from 'react';

interface DayViewProps {
  currentTime: Date;
}

export const DayView: React.FC<DayViewProps> = ({ currentTime }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  // Mock events - replace with actual calendar data
  const mockEvents = [
    { time: '09:00', title: 'MORNING MEETING', duration: '1h' },
    { time: '14:30', title: 'PROJECT REVIEW', duration: '2h' },
    { time: '16:00', title: 'CLIENT CALL', duration: '30m' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 tracking-tight">
        {currentTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        }).toUpperCase()}
      </h2>
      
      <div className="space-y-0">
        {hours.map((hour) => {
          const event = mockEvents.find(e => e.time.startsWith(hour.toString().padStart(2, '0')));
          
          return (
            <div key={hour} className="border-b border-black flex">
              <div className="w-20 p-3 border-r border-black font-bold text-sm">
                {formatHour(hour)}
              </div>
              <div className="flex-1 p-3">
                {event && (
                  <div className="bg-black text-white p-2 font-bold text-sm">
                    {event.title} ({event.duration})
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
