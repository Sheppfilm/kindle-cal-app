import React from 'react';

interface MonthViewProps {
  currentTime: Date;
}

export const MonthView: React.FC<MonthViewProps> = ({ currentTime }) => {
  const getMonthCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
    // Adjust so Monday = 0, Tuesday = 1, etc.
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const calendar = [];
    
    // Add days from previous month if needed
    const prevMonthLastDay = new Date(year, month, 0);
    const daysInPrevMonth = prevMonthLastDay.getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, daysInPrevMonth - i);
      calendar.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      calendar.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // Add days from next month to complete the grid (42 days = 6 weeks)
    const remainingDays = 42 - calendar.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      calendar.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return calendar;
  };

  const monthCalendar = getMonthCalendar(currentTime);
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Mock monthly events
  const mockEvents = [5, 12, 18, 25]; // Days with events

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
        {currentTime.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }).toUpperCase()}
      </div>
      
      <div style={{ 
        border: '2px solid black',
        height: 'calc(100vh - 330px)',
        display: 'table',
        width: '100%',
        tableLayout: 'fixed'
      }}>
        {/* Week day headers */}
        <div style={{ 
          display: 'table-row',
          height: '40px'
        }}>
          {weekDays.map((day) => (
            <div key={day} style={{
              display: 'table-cell',
              borderRight: '1px solid black',
              borderBottom: '1px solid black',
              backgroundColor: 'black',
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '10px',
              fontFamily: 'monospace',
              verticalAlign: 'middle'
            }}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar weeks */}
        {Array.from({ length: 6 }, (_, weekIndex) => (
          <div key={weekIndex} style={{ 
            display: 'table-row',
            height: 'calc((100vh - 370px) / 6)'
          }}>
            {monthCalendar.slice(weekIndex * 7, weekIndex * 7 + 7).map((dayData, dayIndex) => (
              <div 
                key={`${weekIndex}-${dayIndex}`}
                style={{
                  display: 'table-cell',
                  borderRight: dayIndex < 6 ? '1px solid black' : 'none',
                  borderBottom: '1px solid black',
                  padding: '3px',
                  verticalAlign: 'top',
                  color: dayData.isCurrentMonth ? 'black' : '#999'
                }}
              >
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '10px',
                  marginBottom: '3px',
                  fontFamily: 'monospace'
                }}>
                  {dayData.date.getDate()}
                </div>
                {dayData.isCurrentMonth && mockEvents.includes(dayData.date.getDate()) && (
                  <div style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'black'
                  }}></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
