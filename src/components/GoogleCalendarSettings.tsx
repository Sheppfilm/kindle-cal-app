
import React, { useState } from 'react';
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
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });

  // Sync calendar events mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Starting calendar sync...');

      // Call our edge function to sync calendar events
      const { data, error } = await supabase.functions.invoke('sync-google-calendar', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Sync error:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Success",
        description: `Synced ${data?.count || 0} events from Google Calendar`,
      });
      setError('');
    },
    onError: (error: any) => {
      console.error('Sync mutation error:', error);
      setError(error.message || 'Failed to sync calendar');
      toast({
        title: "Error",
        description: error.message || 'Failed to sync calendar',
        variant: "destructive",
      });
    }
  });

  // Check if user is connected via Google OAuth
  const isConnected = user && user.app_metadata?.provider === 'google';

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
          {isConnected ? 'Connected via Google OAuth' : 'Sign in with Google to access your calendar'}
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

            <Button
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              className="w-full bg-black text-white hover:bg-gray-800 font-mono"
            >
              {syncMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  SYNCING...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  SYNC CALENDAR NOW
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded font-mono text-xs">
            ⚠️ Please sign in with Google to connect your calendar
          </div>
        )}
      </CardContent>
    </Card>
  );
};
