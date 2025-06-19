
import React from 'react';

interface WeekViewProps {
  currentTime: Date;
}

export const WeekView: React.FC<WeekViewProps> = ({ currentTime }) => {
  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentTime);

  // Mock weekly events
  const mockEvents = [
    { day: 1, time: '09:00', title: 'MEETING' },
    { day: 3, time: '14:00', title: 'REVIEW' },
    { day: 5, time: '16:00', title: 'CALL' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 tracking-tight">
        WEEK VIEW
      </h2>
      
      <div className="grid grid-cols-7 gap-0 border-2 border-black">
        {weekDays.map((day, index) => (
          <div key={index} className="border-r border-black last:border-r-0">
            <div className="p-3 border-b border-black bg-black text-white text-center">
              <div className="font-bold text-xs">
                {day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
              </div>
              <div className="text-lg font-bold">
                {day.getDate()}
              </div>
            </div>
            
            <div className="h-64 p-2">
              {mockEvents
                .filter(event => event.day === index)
                .map((event, eventIndex) => (
                  <div key={eventIndex} className="bg-black text-white p-1 mb-1 text-xs font-bold">
                    {event.time} {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
