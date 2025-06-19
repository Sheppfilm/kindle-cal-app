
import React, { useState, useEffect } from 'react';
import { Clock } from '../components/Clock';
import { CalendarView } from '../components/CalendarView';
import { AuthForm } from '../components/AuthForm';
import { ViewToggle } from '../components/ViewToggle';

type ViewMode = 'day' | 'week' | 'month' | 'next';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('calendar-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // Update time every minute instead of every second for Kindle
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleAuth = (username: string, password: string) => {
    localStorage.setItem('calendar-auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('calendar-auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white', 
        display: 'table-cell',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '20px'
      }}>
        <AuthForm onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      color: 'black', 
      fontFamily: 'monospace'
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '4px solid black', 
        padding: '20px'
      }}>
        <div style={{ 
          display: 'table', 
          width: '100%'
        }}>
          <div style={{ 
            display: 'table-cell', 
            verticalAlign: 'middle'
          }}>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              letterSpacing: '2px',
              margin: '0'
            }}>
              CALENDAR
            </h1>
          </div>
          <div style={{ 
            display: 'table-cell', 
            verticalAlign: 'middle', 
            textAlign: 'right'
          }}>
            <button 
              onClick={handleLogout}
              style={{
                padding: '10px 15px',
                border: '2px solid black',
                backgroundColor: 'black',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>

      {/* Clock Section */}
      <div style={{ borderBottom: '4px solid black' }}>
        <Clock currentTime={currentTime} />
      </div>

      {/* View Toggle */}
      <div style={{ 
        borderBottom: '4px solid black', 
        padding: '20px'
      }}>
        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      </div>

      {/* Calendar Content */}
      <div>
        <CalendarView viewMode={viewMode} currentTime={currentTime} />
      </div>
    </div>
  );
};

export default Index;
