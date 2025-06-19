
import React from 'react';

interface NextEventViewProps {
  currentTime: Date;
}

export const NextEventView: React.FC<NextEventViewProps> = ({ currentTime }) => {
  // Mock next event data - replace with actual calendar integration
  const nextEvent = {
    title: 'PROJECT MEETING',
    time: new Date(currentTime.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    location: 'CONFERENCE ROOM A',
    description: 'QUARTERLY REVIEW DISCUSSION'
  };

  const getTimeUntilEvent = (eventTime: Date) => {
    const diff = eventTime.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}H ${minutes}M`;
    }
    return `${minutes}M`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        marginBottom: '30px',
        letterSpacing: '2px',
        fontFamily: 'monospace'
      }}>
        NEXT EVENT
      </h2>
      
      <div style={{ 
        border: '4px solid black', 
        padding: '30px', 
        backgroundColor: 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '15px',
            letterSpacing: '2px',
            fontFamily: 'monospace'
          }}>
            {nextEvent.title}
          </div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#666',
            marginBottom: '10px',
            fontFamily: 'monospace'
          }}>
            {nextEvent.time.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            {nextEvent.location}
          </div>
        </div>
        
        <div style={{ 
          borderTop: '2px solid black', 
          paddingTop: '20px', 
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#666',
            marginBottom: '10px',
            fontFamily: 'monospace'
          }}>
            TIME REMAINING
          </div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            {getTimeUntilEvent(nextEvent.time)}
          </div>
        </div>
        
        {nextEvent.description && (
          <div style={{ 
            borderTop: '2px solid black', 
            paddingTop: '20px', 
            marginTop: '20px'
          }}>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#666',
              marginBottom: '10px',
              fontFamily: 'monospace'
            }}>
              DESCRIPTION
            </div>
            <div style={{ 
              fontWeight: 'bold',
              fontFamily: 'monospace'
            }}>
              {nextEvent.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
