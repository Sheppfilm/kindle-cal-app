
import { useState, useEffect } from "react";
import { CalendarView } from "@/components/CalendarView";
import { ViewToggle } from "@/components/ViewToggle";
import { Clock } from "@/components/Clock";
import { GoogleCalendarSettings } from "@/components/GoogleCalendarSettings";
import { AuthPage } from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const { user, isLoading, signOut } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'next'>('day');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAuthSuccess = () => {
    // Auth state will be automatically updated by the auth provider
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        backgroundColor: 'white'
      }}>
        <div>LOADING...</div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'monospace',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '2px solid black', 
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: 0,
            letterSpacing: '2px'
          }}>
            CALENDAR
          </h1>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {user.email}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Clock currentTime={currentTime} />
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '8px 16px',
              border: '2px solid black',
              backgroundColor: showSettings ? 'black' : 'white',
              color: showSettings ? 'white' : 'black',
              fontFamily: 'monospace',
              fontSize: '12px',
              cursor: 'pointer',
              letterSpacing: '1px'
            }}
          >
            {showSettings ? 'HIDE SETTINGS' : 'SETTINGS'}
          </button>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="border-black font-mono text-xs"
          >
            <LogOut className="h-3 w-3 mr-1" />
            LOGOUT
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{
          borderBottom: '2px solid black',
          padding: '20px',
          backgroundColor: '#f5f5f5'
        }}>
          <GoogleCalendarSettings />
        </div>
      )}

      {/* View Controls */}
      <div style={{ 
        borderBottom: '2px solid black', 
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <ViewToggle 
          currentView={viewMode} 
          onViewChange={setViewMode} 
        />
      </div>

      {/* Calendar Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <CalendarView 
          viewMode={viewMode} 
          currentTime={currentTime} 
        />
      </div>
    </div>
  );
};

export default Index;
