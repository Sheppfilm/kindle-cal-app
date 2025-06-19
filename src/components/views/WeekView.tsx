
import React from 'react';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';

interface WeekViewProps {
  currentTime: Date;
}

export const WeekView: React.FC<WeekViewProps> = ({ currentTime }) => {
  const { data: events = [], isLoading } = useCalendarEvents();

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const weekDays = getWeekDays(currentTime);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      const eventHour = eventDate.getHours();
      return eventDate.toDateString() === day.toDateString() && eventHour === hour;
    });
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading events...</div>;
  }

  return (
    <div style={{ 
      height: '100%', 
      overflow: 'hidden',
      padding: '10px'
    }}>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 'bold',
        letterSpacing: '2px',
        fontFamily: 'monospace',
        marginBottom: '10px'
      }}>
        WEEK OF {weekDays[0].toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric' 
        }).toUpperCase()}
      </div>
      
      <div style={{ 
        border: '2px solid black',
        height: 'calc(100vh - 330px)',
        overflow: 'auto'
      }}>
        {/* Header with days */}
        <div style={{ 
          display: 'table',
          width: '100%',
          tableLayout: 'fixed',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1
        }}>
          <div style={{ display: 'table-row' }}>
            <div style={{
              display: 'table-cell',
              width: '60px',
              borderRight: '1px solid black',
              borderBottom: '1px solid black',
              backgroundColor: 'black',
              color: 'white',
              textAlign: 'center',
              padding: '5px',
              fontSize: '8px',
              fontFamily: 'monospace'
            }}>
              TIME
            </div>
            {weekDays.map((day, index) => (
              <div key={index} style={{
                display: 'table-cell',
                borderRight: index < 6 ? '1px solid black' : 'none',
                borderBottom: '1px solid black',
                backgroundColor: 'black',
                color: 'white',
                textAlign: 'center',
                padding: '5px',
                fontSize: '8px',
                fontFamily: 'monospace'
              }}>
                {day.toLocaleDateString('en-US', { 
                  weekday: 'short',
                  day: 'numeric'
                }).toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Hours rows */}
        {hours.map((hour) => (
          <div key={hour} style={{ 
            display: 'table',
            width: '100%',
            tableLayout: 'fixed',
            minHeight: '40px'
          }}>
            <div style={{ display: 'table-row' }}>
              <div style={{
                display: 'table-cell',
                width: '60px',
                borderRight: '1px solid black',
                borderBottom: '1px solid black',
                padding: '5px',
                fontSize: '9px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                verticalAlign: 'top'
              }}>
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDayAndHour(day, hour);
                return (
                  <div key={dayIndex} style={{
                    display: 'table-cell',
                    borderRight: dayIndex < 6 ? '1px solid black' : 'none',
                    borderBottom: '1px solid black',
                    padding: '2px',
                    verticalAlign: 'top',
                    position: 'relative'
                  }}>
                    {dayEvents.map((event) => (
                      <div key={event.id} style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '2px',
                        marginBottom: '1px',
                        fontSize: '7px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-word'
                      }}>
                        <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                        {event.location && (
                          <div style={{ opacity: 0.7 }}>📍</div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
