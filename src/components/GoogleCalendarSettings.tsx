
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, Settings, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const GoogleCalendarSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientId, setClientId] = useState('');
  const [storedClientId, setStoredClientId] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize Google Calendar hook with stored client ID
  const {
    isInitialized,
    isSignedIn,
    signIn,
    signOut,
    syncCalendar,
    isSigningIn,
    isSigningOut,
    isSyncing,
    error: googleError
  } = useGoogleCalendar(storedClientId);

  // Load user's stored client ID and Google tokens
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('google_client_id, google_access_token')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading user data:', error);
          return;
        }

        if (data?.google_client_id) {
          setStoredClientId(data.google_client_id);
          setClientId(data.google_client_id);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user]);

  const handleSaveClientId = async () => {
    if (!user || !clientId.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('users')
        .update({ google_client_id: clientId.trim() })
        .eq('id', user.id);

      if (error) throw error;

      setStoredClientId(clientId.trim());
      setShowSettings(false);
      
      toast({
        title: "Success",
        description: "Google Client ID saved successfully",
      });
    } catch (error: any) {
      setError(error.message || 'Failed to save Client ID');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!storedClientId) {
      setError('Please save your Google Client ID first');
      return;
    }

    try {
      await signIn();
      toast({
        title: "Success",
        description: "Connected to Google Calendar successfully",
      });
    } catch (error: any) {
      setError(error.message || 'Failed to connect to Google Calendar');
    }
  };

  const handleDisconnect = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Disconnected from Google Calendar",
      });
    } catch (error: any) {
      setError(error.message || 'Failed to disconnect');
    }
  };

  const handleSync = async () => {
    try {
      await syncCalendar();
      toast({
        title: "Success",
        description: "Calendar events synced successfully",
      });
    } catch (error: any) {
      setError(error.message || 'Failed to sync calendar');
    }
  };

  // Show current error from Google Calendar hook
  useEffect(() => {
    if (googleError) {
      setError(googleError);
    }
  }, [googleError]);

  if (!storedClientId && !showSettings) {
    return (
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-mono">
            <Calendar className="h-5 w-5" />
            GOOGLE CALENDAR
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            Configure your Google Calendar connection
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
            <AlertDescription className="font-mono text-xs text-red-600">
              ERROR: {error}
            </AlertDescription>
          </Alert>
        )}

        {showSettings && (
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
                onClick={handleSaveClientId}
                disabled={isLoading || !clientId.trim()}
                className="flex-1 bg-black text-white hover:bg-gray-800 font-mono"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    SAVING...
                  </>
                ) : (
                  'SAVE'
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setShowSettings(false);
                  setClientId(storedClientId); // Reset to stored value
                }}
                className="border-black font-mono"
              >
                CANCEL
              </Button>
            </div>
          </div>
        )}

        {storedClientId && !showSettings && (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded font-mono text-xs">
              CLIENT ID: {storedClientId.substring(0, 20)}...
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="ml-2 h-6 px-2 font-mono text-xs"
              >
                EDIT
              </Button>
            </div>

            {isSignedIn ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded font-mono text-xs">
                  ✓ GOOGLE CALENDAR CONNECTED
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSync}
                    disabled={isSyncing || !isInitialized}
                    className="flex-1 bg-black text-white hover:bg-gray-800 font-mono"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        SYNCING...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        SYNC NOW
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDisconnect}
                    disabled={isSigningOut}
                    className="border-black font-mono"
                  >
                    {isSigningOut ? 'DISCONNECTING...' : 'DISCONNECT'}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isSigningIn || !isInitialized}
                className="w-full bg-black text-white hover:bg-gray-800 font-mono"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    CONNECTING...
                  </>
                ) : (
                  'CONNECT TO GOOGLE'
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
