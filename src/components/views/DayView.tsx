
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
    <div style={{ padding: '20px' }}>
      <h2 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        marginBottom: '20px',
        letterSpacing: '2px',
        fontFamily: 'monospace'
      }}>
        {currentTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        }).toUpperCase()}
      </h2>
      
      <div>
        {hours.map((hour) => {
          const event = mockEvents.find(e => e.time.startsWith(hour.toString().padStart(2, '0')));
          
          return (
            <div key={hour} style={{ 
              borderBottom: '1px solid black', 
              display: 'table',
              width: '100%'
            }}>
              <div style={{
                display: 'table-cell',
                width: '80px',
                padding: '10px',
                borderRight: '1px solid black',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                {formatHour(hour)}
              </div>
              <div style={{
                display: 'table-cell',
                padding: '10px'
              }}>
                {event && (
                  <div style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
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
