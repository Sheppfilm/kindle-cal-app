
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

    // Update time every minute for Kindle
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleAuth = (username: string, password: string) => {
    if (username === 'admin' && password === 'calendar2024') {
      localStorage.setItem('calendar-auth', 'true');
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('calendar-auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw',
        backgroundColor: 'white', 
        display: 'table-cell',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '20px',
        overflow: 'hidden'
      }}>
        <AuthForm onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      backgroundColor: 'white', 
      color: 'black', 
      fontFamily: 'monospace',
      overflow: 'hidden',
      display: 'table',
      tableLayout: 'fixed'
    }}>
      {/* Header - Fixed height */}
      <div style={{ 
        display: 'table-row',
        height: '60px'
      }}>
        <div style={{ 
          borderBottom: '4px solid black', 
          padding: '15px',
          display: 'table-cell',
          verticalAlign: 'middle'
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
                fontSize: '18px', 
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
                  padding: '8px 12px',
                  border: '2px solid black',
                  backgroundColor: 'black',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clock Section - Fixed height */}
      <div style={{ 
        display: 'table-row',
        height: '120px'
      }}>
        <div style={{ 
          borderBottom: '4px solid black',
          display: 'table-cell',
          verticalAlign: 'middle'
        }}>
          <Clock currentTime={currentTime} />
        </div>
      </div>

      {/* View Toggle - Fixed height */}
      <div style={{ 
        display: 'table-row',
        height: '80px'
      }}>
        <div style={{ 
          borderBottom: '4px solid black', 
          padding: '15px',
          display: 'table-cell',
          verticalAlign: 'middle'
        }}>
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Calendar Content - Remaining space */}
      <div style={{ 
        display: 'table-row'
      }}>
        <div style={{ 
          display: 'table-cell',
          verticalAlign: 'top',
          height: '100%'
        }}>
          <CalendarView viewMode={viewMode} currentTime={currentTime} />
        </div>
      </div>
    </div>
  );
};

export default Index;
