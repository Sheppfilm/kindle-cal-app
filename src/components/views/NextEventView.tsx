
import React from 'react';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';

interface NextEventViewProps {
  currentTime: Date;
}

export const NextEventView: React.FC<NextEventViewProps> = ({ currentTime }) => {
  const { data: events = [], isLoading } = useCalendarEvents();

  // Filter and sort upcoming events
  const upcomingEvents = events
    .filter(event => new Date(event.start_time) > currentTime)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 10); // Show next 10 events

  const formatEventTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startStr = start.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const endStr = end.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    return `${startStr} - ${endStr}`;
  };

  const getTimeUntil = (eventTime: string) => {
    const now = currentTime.getTime();
    const event = new Date(eventTime).getTime();
    const diff = event - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: 'monospace'
      }}>
        LOADING EVENTS...
      </div>
    );
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
        marginBottom: '20px',
        borderBottom: '2px solid black',
        paddingBottom: '10px'
      }}>
        UPCOMING EVENTS
      </div>
      
      <div style={{
        height: 'calc(100vh - 330px)',
        overflow: 'auto'
      }}>
        {upcomingEvents.length === 0 ? (
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#666',
            marginTop: '50px'
          }}>
            NO UPCOMING EVENTS
          </div>
        ) : (
          upcomingEvents.map((event, index) => (
            <div key={event.id} style={{
              border: '2px solid black',
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: index === 0 ? '#f0f0f0' : 'white'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                marginBottom: '8px',
                letterSpacing: '1px'
              }}>
                {event.title.toUpperCase()}
              </div>
              
              <div style={{
                fontSize: '10px',
                fontFamily: 'monospace',
                marginBottom: '5px',
                color: '#666'
              }}>
                {formatEventTime(event.start_time, event.end_time)}
              </div>

              <div style={{
                fontSize: '10px',
                fontFamily: 'monospace',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                IN {getTimeUntil(event.start_time)}
              </div>

              {event.location && (
                <div style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  marginBottom: '5px'
                }}>
                  📍 {event.location}
                </div>
              )}

              {event.description && (
                <div style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  marginBottom: '5px',
                  color: '#666'
                }}>
                  {event.description.substring(0, 100)}
                  {event.description.length > 100 ? '...' : ''}
                </div>
              )}

              {event.attendees && (
                <div style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  marginBottom: '5px'
                }}>
                  👥 {Array.isArray(event.attendees) ? event.attendees.length : 0} ATTENDEES
                </div>
              )}

              {event.organizer_name && (
                <div style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  color: '#666'
                }}>
                  ORGANIZER: {event.organizer_name}
                </div>
              )}

              {event.hangout_link && (
                <div style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  marginTop: '5px'
                }}>
                  🔗 VIDEO CALL AVAILABLE
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
