
import React from 'react';

interface NextEventViewProps {
  currentTime: Date;
}

export const NextEventView: React.FC<NextEventViewProps> = ({ currentTime }) => {
  // Mock events - replace with actual calendar data
  // Filter out all-day events and get time-based events only
  const mockEvents = [
    { 
      title: 'TEAM STANDUP', 
      start: new Date(currentTime.getTime() + 30 * 60 * 1000), // 30 minutes from now
      end: new Date(currentTime.getTime() + 60 * 60 * 1000), // 1 hour from now
      location: 'ZOOM ROOM 1'
    },
    { 
      title: 'PROJECT REVIEW', 
      start: new Date(currentTime.getTime() + 90 * 60 * 1000), // 1.5 hours from now
      end: new Date(currentTime.getTime() + 150 * 60 * 1000), // 2.5 hours from now
      location: 'CONFERENCE ROOM B'
    }
  ];

  const getCurrentEvent = () => {
    return mockEvents.find(event => 
      currentTime >= event.start && currentTime <= event.end
    );
  };

  const getNextEvent = () => {
    return mockEvents
      .filter(event => event.start > currentTime)
      .sort((a, b) => a.start.getTime() - b.start.getTime())[0];
  };

  const getEventAfterNext = () => {
    const nextEvent = getNextEvent();
    if (!nextEvent) return null;
    
    return mockEvents
      .filter(event => event.start > nextEvent.start && event.start <= new Date(currentTime.getTime() + 60 * 60 * 1000))
      .sort((a, b) => a.start.getTime() - b.start.getTime())[0];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (eventEnd: Date) => {
    const diff = eventEnd.getTime() - currentTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}H ${remainingMinutes}M REMAINING`;
    }
    return `${remainingMinutes}M REMAINING`;
  };

  const getTimeUntilEvent = (eventStart: Date) => {
    const diff = eventStart.getTime() - currentTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `STARTS IN ${hours}H ${remainingMinutes}M`;
    }
    return `STARTS IN ${remainingMinutes}M`;
  };

  const renderEventCard = (event: any, isCurrentEvent: boolean, isHalf: boolean = false) => {
    const cardStyle = {
      border: '4px solid black',
      padding: isHalf ? '15px' : '25px',
      backgroundColor: 'white',
      height: isHalf ? 'calc(100% - 8px)' : 'auto',
      width: isHalf ? 'calc(50% - 10px)' : '100%',
      display: 'inline-block',
      verticalAlign: 'top',
      marginRight: isHalf ? '8px' : '0',
      boxSizing: 'border-box' as const
    };

    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: isHalf ? '16px' : '24px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            letterSpacing: '1px',
            fontFamily: 'monospace'
          }}>
            {event.title}
          </div>
          
          <div style={{ 
            fontSize: isHalf ? '14px' : '18px', 
            fontWeight: 'bold', 
            color: '#666',
            marginBottom: '8px',
            fontFamily: 'monospace'
          }}>
            {formatTime(event.start)} - {formatTime(event.end)}
          </div>
          
          <div style={{ 
            fontSize: isHalf ? '12px' : '14px', 
            fontWeight: 'bold',
            marginBottom: '15px',
            fontFamily: 'monospace'
          }}>
            {event.location}
          </div>
          
          <div style={{ 
            borderTop: '2px solid black', 
            paddingTop: '15px'
          }}>
            {isCurrentEvent && (
              <>
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  color: '#666',
                  marginBottom: '5px',
                  fontFamily: 'monospace'
                }}>
                  ● CURRENTLY RUNNING
                </div>
                <div style={{ 
                  fontSize: isHalf ? '16px' : '20px', 
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}>
                  {getTimeRemaining(event.end)}
                </div>
              </>
            )}
            
            {!isCurrentEvent && (
              <div style={{ 
                fontSize: isHalf ? '14px' : '18px', 
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}>
                {getTimeUntilEvent(event.start)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const currentEvent = getCurrentEvent();
  const nextEvent = getNextEvent();
  const eventAfterNext = getEventAfterNext();

  // State 1: Only current event
  if (currentEvent && !eventAfterNext) {
    return (
      <div style={{ padding: '20px', height: 'calc(100vh - 260px)', display: 'table-cell', verticalAlign: 'middle' }}>
        {renderEventCard(currentEvent, true)}
      </div>
    );
  }

  // State 2: Only next event
  if (!currentEvent && nextEvent && !eventAfterNext) {
    return (
      <div style={{ padding: '20px', height: 'calc(100vh - 260px)', display: 'table-cell', verticalAlign: 'middle' }}>
        {renderEventCard(nextEvent, false)}
      </div>
    );
  }

  // State 3: Current event + next event (both within 1 hour)
  if (currentEvent && eventAfterNext) {
    return (
      <div style={{ padding: '20px', height: 'calc(100vh - 260px)', display: 'table-cell', verticalAlign: 'middle' }}>
        {renderEventCard(currentEvent, true, true)}
        {renderEventCard(eventAfterNext, false, true)}
      </div>
    );
  }

  // State 3 alternative: Next event + event after next (both within 1 hour)
  if (!currentEvent && nextEvent && eventAfterNext) {
    return (
      <div style={{ padding: '20px', height: 'calc(100vh - 260px)', display: 'table-cell', verticalAlign: 'middle' }}>
        {renderEventCard(nextEvent, false, true)}
        {renderEventCard(eventAfterNext, false, true)}
      </div>
    );
  }

  // No events
  return (
    <div style={{ 
      padding: '20px', 
      height: 'calc(100vh - 260px)', 
      display: 'table-cell', 
      verticalAlign: 'middle',
      textAlign: 'center'
    }}>
      <div style={{ 
        border: '4px solid black', 
        padding: '30px', 
        backgroundColor: 'white'
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold',
          fontFamily: 'monospace'
        }}>
          NO UPCOMING EVENTS
        </div>
      </div>
    </div>
  );
};
