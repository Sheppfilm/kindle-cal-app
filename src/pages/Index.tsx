
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

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleAuth = (username: string, password: string) => {
    // Simple auth for now - in production this would connect to your backend
    if (username && password) {
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <AuthForm onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <div className="border-b-4 border-black p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">CALENDAR</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors font-bold text-sm"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Clock Section */}
      <div className="border-b-4 border-black">
        <Clock currentTime={currentTime} />
      </div>

      {/* View Toggle */}
      <div className="border-b-4 border-black p-6">
        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      </div>

      {/* Calendar Content */}
      <div className="flex-1">
        <CalendarView viewMode={viewMode} currentTime={currentTime} />
      </div>
    </div>
  );
};

export default Index;
