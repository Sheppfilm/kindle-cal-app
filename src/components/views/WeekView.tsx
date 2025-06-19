
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
    <div style={{ padding: '20px' }}>
      <h2 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        marginBottom: '20px',
        letterSpacing: '2px',
        fontFamily: 'monospace'
      }}>
        WEEK VIEW
      </h2>
      
      <div style={{ 
        display: 'table', 
        width: '100%', 
        border: '2px solid black'
      }}>
        {weekDays.map((day, index) => (
          <div key={index} style={{
            display: 'table-cell',
            width: '14.28%',
            borderRight: index < 6 ? '1px solid black' : 'none'
          }}>
            <div style={{
              padding: '10px',
              borderBottom: '1px solid black',
              backgroundColor: 'black',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{
                fontWeight: 'bold',
                fontSize: '10px',
                marginBottom: '5px',
                fontFamily: 'monospace'
              }}>
                {day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}>
                {day.getDate()}
              </div>
            </div>
            
            <div style={{ height: '150px', padding: '5px' }}>
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
