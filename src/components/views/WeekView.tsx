
import React from 'react';

interface WeekViewProps {
  currentTime: Date;
}

export const WeekView: React.FC<WeekViewProps> = ({ currentTime }) => {
  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    // Start with Monday (1 = Monday, 0 = Sunday)
    const dayOfWeek = date.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Monday start
    startOfWeek.setDate(date.getDate() + diff);
    
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
    <div style={{ 
      height: '100%', 
      overflow: 'hidden',
      padding: '10px'
    }}>
      <div style={{ 
        height: '30px',
        fontSize: '14px', 
        fontWeight: 'bold',
        letterSpacing: '2px',
        fontFamily: 'monospace',
        marginBottom: '10px'
      }}>
        WEEK VIEW
      </div>
      
      <div style={{ 
        display: 'table', 
        width: '100%', 
        border: '2px solid black',
        height: 'calc(100vh - 330px)',
        tableLayout: 'fixed'
      }}>
        {weekDays.map((day, index) => (
          <div key={index} style={{
            display: 'table-cell',
            borderRight: index < 6 ? '1px solid black' : 'none',
            verticalAlign: 'top'
          }}>
            <div style={{
              padding: '8px',
              borderBottom: '1px solid black',
              backgroundColor: 'black',
              color: 'white',
              textAlign: 'center',
              height: '50px',
              display: 'table',
              width: '100%'
            }}>
              <div style={{
                display: 'table-cell',
                verticalAlign: 'middle'
              }}>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '10px',
                  marginBottom: '3px',
                  fontFamily: 'monospace'
                }}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}>
                  {day.getDate()}
                </div>
              </div>
            </div>
            
            <div style={{ 
              height: 'calc(100vh - 430px)',
              padding: '5px',
              overflow: 'hidden'
            }}>
              {mockEvents
                .filter(event => event.day === index)
                .map((event, eventIndex) => (
                  <div key={eventIndex} style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '5px',
                    marginBottom: '5px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace'
                  }}>
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
