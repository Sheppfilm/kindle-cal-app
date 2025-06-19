
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, Settings, RefreshCw } from 'lucide-react';

export const GoogleCalendarSettings: React.FC = () => {
  const { user } = useAuth();
  const [clientId, setClientId] = useState('');
  const [storedClientId, setStoredClientId] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Load user's stored client ID
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

        if (data?.google_access_token) {
          setIsConnected(true);
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
        .upsert({
          id: user.id,
          email: user.email,
          google_client_id: clientId.trim(),
        });

      if (error) throw error;

      setStoredClientId(clientId.trim());
      setShowSettings(false);
      console.log('Client ID saved successfully');
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

    setIsLoading(true);
    setError('');

    try {
      // Initialize Google API with stored client ID
      // This would trigger the actual Google OAuth flow
      console.log('Connecting with client ID:', storedClientId);
      // TODO: Implement actual Google OAuth connection
      setIsConnected(true);
    } catch (error: any) {
      setError(error.message || 'Failed to connect to Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          google_access_token: null,
          google_refresh_token: null,
          google_sync_token: null,
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsConnected(false);
      console.log('Disconnected from Google Calendar');
    } catch (error: any) {
      setError(error.message || 'Failed to disconnect');
    } finally {
      setIsLoading(false);
    }
  };

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
          {isConnected ? 'Connected and ready to sync' : 'Configure your Google Calendar connection'}
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
                onClick={() => setShowSettings(false)}
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

            {isConnected ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded font-mono text-xs">
                  ✓ GOOGLE CALENDAR CONNECTED
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => console.log('Sync calendar')}
                    disabled={isLoading}
                    className="flex-1 bg-black text-white hover:bg-gray-800 font-mono"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    SYNC NOW
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDisconnect}
                    disabled={isLoading}
                    className="border-black font-mono"
                  >
                    DISCONNECT
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 font-mono"
              >
                {isLoading ? (
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
