
import React from 'react';

interface MonthViewProps {
  currentTime: Date;
}

export const MonthView: React.FC<MonthViewProps> = ({ currentTime }) => {
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const monthDays = getMonthDays(currentTime);
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Mock monthly events
  const mockEvents = [5, 12, 18, 25]; // Days with events

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
          month: 'long', 
          year: 'numeric' 
        }).toUpperCase()}
      </h2>
      
      <div style={{ border: '2px solid black' }}>
        {/* Week day headers */}
        <div style={{ display: 'table', width: '100%' }}>
          {weekDays.map((day) => (
            <div key={day} style={{
              display: 'table-cell',
              padding: '10px',
              borderRight: '1px solid black',
              borderBottom: '1px solid black',
              backgroundColor: 'black',
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div>
          {Array.from({ length: Math.ceil(monthDays.length / 7) }, (_, weekIndex) => (
            <div key={weekIndex} style={{ display: 'table', width: '100%' }}>
              {monthDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => (
                <div 
                  key={`${weekIndex}-${dayIndex}`}
                  style={{
                    display: 'table-cell',
                    height: '60px',
                    borderRight: dayIndex < 6 ? '1px solid black' : 'none',
                    borderBottom: '1px solid black',
                    padding: '5px',
                    verticalAlign: 'top'
                  }}
                >
                  {day && (
                    <>
                      <div style={{
                        fontWeight: 'bold',
                        fontSize: '12px',
                        marginBottom: '5px',
                        fontFamily: 'monospace'
                      }}>
                        {day.getDate()}
                      </div>
                      {mockEvents.includes(day.getDate()) && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: 'black'
                        }}></div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
