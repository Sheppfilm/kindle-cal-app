
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
    <div style={{ 
      height: '100%', 
      overflow: 'hidden',
      display: 'table',
      width: '100%',
      tableLayout: 'fixed'
    }}>
      <div style={{ 
        display: 'table-row',
        height: '40px'
      }}>
        <div style={{ 
          display: 'table-cell',
          padding: '10px 20px',
          fontSize: '14px', 
          fontWeight: 'bold',
          letterSpacing: '2px',
          fontFamily: 'monospace',
          borderBottom: '2px solid black'
        }}>
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          }).toUpperCase()}
        </div>
      </div>
      
      <div style={{ 
        display: 'table-row'
      }}>
        <div style={{
          display: 'table-cell',
          height: '100%',
          verticalAlign: 'top'
        }}>
          <div style={{
            height: 'calc(100vh - 300px)',
            overflow: 'hidden'
          }}>
            {hours.map((hour) => {
              const event = mockEvents.find(e => e.time.startsWith(hour.toString().padStart(2, '0')));
              
              return (
                <div key={hour} style={{ 
                  borderBottom: '1px solid black', 
                  display: 'table',
                  width: '100%',
                  height: 'calc((100vh - 340px) / 24)',
                  tableLayout: 'fixed'
                }}>
                  <div style={{
                    display: 'table-cell',
                    width: '60px',
                    padding: '5px 10px',
                    borderRight: '1px solid black',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    verticalAlign: 'top'
                  }}>
                    {formatHour(hour)}
                  </div>
                  <div style={{
                    display: 'table-cell',
                    padding: '5px 10px',
                    verticalAlign: 'top'
                  }}>
                    {event && (
                      <div style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '5px',
                        fontWeight: 'bold',
                        fontSize: '10px',
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
      </div>
    </div>
  );
};
