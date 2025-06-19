
import React, { useState } from 'react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, Settings, Sync } from 'lucide-react';

export const GoogleCalendarSettings: React.FC = () => {
  const [clientId, setClientId] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    isInitialized,
    isSignedIn,
    isLoading,
    error,
    signIn,
    signOut,
    syncCalendar,
    isSigningIn,
    isSigningOut,
    isSyncing
  } = useGoogleCalendar(clientId);

  const handleConnect = () => {
    if (!clientId.trim()) {
      alert('Please enter your Google Client ID first');
      return;
    }
    signIn();
  };

  const handleSync = () => {
    syncCalendar();
  };

  if (!showSettings && !isSignedIn) {
    return (
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-mono">
            <Calendar className="h-5 w-5" />
            GOOGLE CALENDAR
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            Connect your Google Calendar to sync events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowSettings(true)}
            className="w-full bg-black text-white hover:bg-gray-800 font-mono"
          >
            <Settings className="h-4 w-4 mr-2" />
            CONFIGURE
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <Calendar className="h-5 w-5" />
          GOOGLE CALENDAR
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          {isSignedIn ? 'Connected and ready to sync' : 'Configure your Google Calendar connection'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-500">
            <AlertDescription className="font-mono text-xs">
              ERROR: {error}
            </AlertDescription>
          </Alert>
        )}

        {!isSignedIn && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="clientId" className="font-mono text-xs">
                GOOGLE CLIENT ID
              </Label>
              <Input
                id="clientId"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your Google OAuth Client ID"
                className="font-mono text-xs border-black"
              />
              <p className="text-xs text-gray-600 mt-1 font-mono">
                Get this from Google Cloud Console → APIs & Services → Credentials
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleConnect}
                disabled={isLoading || isSigningIn || !clientId.trim()}
                className="flex-1 bg-black text-white hover:bg-gray-800 font-mono"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    CONNECTING...
                  </>
                ) : (
                  'CONNECT'
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="border-black font-mono"
              >
                CANCEL
              </Button>
            </div>
          </div>
        )}

        {isSignedIn && (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded font-mono text-xs">
              ✓ GOOGLE CALENDAR CONNECTED
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex-1 bg-black text-white hover:bg-gray-800 font-mono"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    SYNCING...
                  </>
                ) : (
                  <>
                    <Sync className="h-4 w-4 mr-2" />
                    SYNC NOW
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={signOut}
                disabled={isSigningOut}
                className="border-black font-mono"
              >
                DISCONNECT
              </Button>
            </div>
          </div>
        )}

        {isLoading && !isSigningIn && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 font-mono text-xs">INITIALIZING...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
