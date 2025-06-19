
import React from 'react';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';

interface DayViewProps {
  currentTime: Date;
}

export const DayView: React.FC<DayViewProps> = ({ currentTime }) => {
  const { data: events = [], isLoading, error } = useCalendarEvents();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  // Filter events for the current day
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate.toDateString() === currentTime.toDateString();
  });

  // Group events by hour for display
  const getEventsForHour = (hour: number) => {
    return dayEvents.filter(event => {
      const eventHour = new Date(event.start_time).getHours();
      return eventHour === hour;
    });
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading events...</div>;
  }

  if (error) {
    console.error('Calendar events error:', error);
  }

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
            overflow: 'auto'
          }}>
            {hours.map((hour) => {
              const hourEvents = getEventsForHour(hour);
              
              return (
                <div key={hour} style={{ 
                  borderBottom: '1px solid black', 
                  display: 'table',
                  width: '100%',
                  minHeight: 'calc((100vh - 340px) / 24)',
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
                    {hourEvents.map((event) => (
                      <div key={event.id} style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '5px',
                        fontWeight: 'bold',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        marginBottom: '3px'
                      }}>
                        <div>{event.title}</div>
                        {event.location && (
                          <div style={{ fontSize: '8px', opacity: 0.8 }}>
                            📍 {event.location}
                          </div>
                        )}
                        {event.attendees && (
                          <div style={{ fontSize: '8px', opacity: 0.8 }}>
                            👥 {Array.isArray(event.attendees) ? event.attendees.length : 0} attendees
                          </div>
                        )}
                        <div style={{ fontSize: '8px', opacity: 0.8 }}>
                          {new Date(event.start_time).toLocaleTimeString('en-US', { 
                            hour12: false, 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {new Date(event.end_time).toLocaleTimeString('en-US', { 
                            hour12: false, 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    ))}
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
