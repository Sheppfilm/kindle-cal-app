
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserProfile {
  id: string;
  google_access_token?: string;
  google_refresh_token?: string;
  last_sync?: string;
}

export const GoogleCalendarSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, google_access_token, google_refresh_token, last_sync')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });

  // Google OAuth sign in mutation
  const signInMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.readonly',
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) throw error;
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to connect to Google Calendar');
    }
  });

  // Disconnect Google account mutation
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          google_access_token: null,
          google_refresh_token: null,
          google_sync_token: null,
          last_sync: null
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast({
        title: "Success",
        description: "Disconnected from Google Calendar",
      });
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to disconnect');
    }
  });

  // Sync calendar events mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!user || !profile?.google_access_token) {
        throw new Error('Google Calendar not connected');
      }

      // Call our edge function to sync calendar events
      const { data, error } = await supabase.functions.invoke('sync-google-calendar', {
        body: { userId: user.id }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast({
        title: "Success",
        description: `Synced ${data?.count || 0} events from Google Calendar`,
      });
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to sync calendar');
    }
  });

  const isConnected = profile?.google_access_token;

  if (profileLoading) {
    return (
      <Card className="border-2 border-black">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="font-mono text-xs">Loading...</span>
          </div>
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
          {isConnected ? 'Connected and ready to sync' : 'Connect your Google Calendar to sync events'}
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

        {isConnected ? (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded font-mono text-xs">
              ✓ GOOGLE CALENDAR CONNECTED
              {profile?.last_sync && (
                <div className="text-gray-600 mt-1">
                  Last sync: {new Date(profile.last_sync).toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                className="flex-1 bg-black text-white hover:bg-gray-800 font-mono"
              >
                {syncMutation.isPending ? (
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
                onClick={() => disconnectMutation.mutate()}
                disabled={disconnectMutation.isPending}
                className="border-black font-mono"
              >
                {disconnectMutation.isPending ? 'DISCONNECTING...' : 'DISCONNECT'}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => signInMutation.mutate()}
            disabled={signInMutation.isPending}
            className="w-full bg-black text-white hover:bg-gray-800 font-mono"
          >
            {signInMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                CONNECTING...
              </>
            ) : (
              'CONNECT TO GOOGLE'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
