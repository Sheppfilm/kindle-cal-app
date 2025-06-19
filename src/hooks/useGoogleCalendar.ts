
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GoogleCalendarService, GoogleCalendarEvent } from '@/services/googleCalendar';

interface GoogleCalendarState {
  isInitialized: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useGoogleCalendar = (clientId?: string) => {
  const [state, setState] = useState<GoogleCalendarState>({
    isInitialized: false,
    isSignedIn: false,
    isLoading: false,
    error: null
  });

  const queryClient = useQueryClient();

  // Initialize Google API
  useEffect(() => {
    const initGapi = async () => {
      if (!clientId) {
        console.log('No client ID provided, skipping initialization');
        return;
      }

      if (state.isInitialized) {
        console.log('Already initialized, skipping');
        return;
      }

      console.log('Starting Google API initialization...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        await GoogleCalendarService.initializeGapi(clientId);
        
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isSignedIn: GoogleCalendarService.isSignedIn(),
          isLoading: false,
          error: null
        }));

        console.log('Google Calendar hook initialized successfully');
      } catch (error) {
        console.error('Google Calendar initialization failed:', error);
        setState(prev => ({
          ...prev,
          isInitialized: false,
          isSignedIn: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize Google Calendar'
        }));
      }
    };

    initGapi();
  }, [clientId, state.isInitialized]);

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting Google sign-in...');
      const authResponse = await GoogleCalendarService.signIn();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Store Google tokens in database
      await supabase
        .from('users')
        .update({
          google_access_token: authResponse.access_token,
          google_refresh_token: authResponse.refresh_token,
          last_sync: new Date().toISOString()
        })
        .eq('id', user.id);

      console.log('Google tokens saved to database');
      return authResponse;
    },
    onSuccess: () => {
      setState(prev => ({ ...prev, isSignedIn: true, error: null }));
    },
    onError: (error) => {
      console.error('Sign-in error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to sign in to Google'
      }));
    }
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await GoogleCalendarService.signOut();
      
      // Clear Google tokens from database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({
            google_access_token: null,
            google_refresh_token: null,
            google_sync_token: null
          })
          .eq('id', user.id);
      }
    },
    onSuccess: () => {
      setState(prev => ({ ...prev, isSignedIn: false, error: null }));
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
    onError: (error) => {
      console.error('Sign-out error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to sign out'
      }));
    }
  });

  // Sync calendar events mutation
  const syncCalendarMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting calendar sync...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's Google tokens
      const { data: userData } = await supabase
        .from('users')
        .select('google_access_token, google_sync_token')
        .eq('id', user.id)
        .single();

      if (!userData?.google_access_token) {
        throw new Error('Google Calendar not connected');
      }

      // Get calendar events from Google
      const { events, nextSyncToken } = await GoogleCalendarService.getCalendarEvents(
        userData.google_access_token,
        'primary',
        undefined,
        undefined,
        userData.google_sync_token || undefined
      );

      console.log('Syncing', events.length, 'events from Google Calendar');

      // Process each event
      for (const event of events) {
        if (event.status === 'cancelled') {
          // Delete cancelled events
          await supabase
            .from('calendar_events')
            .delete()
            .eq('user_id', user.id)
            .eq('google_event_id', event.id);
        } else {
          // Upsert active events
          const eventData = transformGoogleEvent(event, user.id);
          await supabase.rpc('upsert_calendar_event', eventData);
        }
      }

      // Update sync token
      if (nextSyncToken) {
        await supabase
          .from('users')
          .update({
            google_sync_token: nextSyncToken,
            last_sync: new Date().toISOString()
          })
          .eq('id', user.id);
      }

      return events.length;
    },
    onSuccess: (count) => {
      console.log(`Successfully synced ${count} events`);
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
    onError: (error) => {
      console.error('Sync error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to sync calendar'
      }));
    }
  });

  return {
    ...state,
    signIn: signInMutation.mutate,
    signOut: signOutMutation.mutate,
    syncCalendar: syncCalendarMutation.mutate,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isSyncing: syncCalendarMutation.isPending
  };
};

// Transform Google Calendar event to our database format
const transformGoogleEvent = (event: GoogleCalendarEvent, userId: string) => {
  const startTime = event.start.dateTime || event.start.date;
  const endTime = event.end.dateTime || event.end.date;
  const isAllDay = !event.start.dateTime;

  return {
    p_user_id: userId,
    p_google_event_id: event.id,
    p_title: event.summary || 'Untitled Event',
    p_description: event.description || null,
    p_start_time: startTime,
    p_end_time: endTime,
    p_location: event.location || null,
    p_all_day: isAllDay,
    p_recurrence: event.recurrence || null,
    p_status: event.status || null,
    p_visibility: event.visibility || null,
    p_creator_email: event.creator?.email || null,
    p_creator_name: event.creator?.displayName || null,
    p_organizer_email: event.organizer?.email || null,
    p_organizer_name: event.organizer?.displayName || null,
    p_attendees: event.attendees ? JSON.stringify(event.attendees) : null,
    p_conference_data: event.conferenceData ? JSON.stringify(event.conferenceData) : null,
    p_hangout_link: event.hangoutLink || null,
    p_html_link: event.htmlLink || null,
    p_ical_uid: event.iCalUID || null,
    p_kind: event.kind || null,
    p_sequence: event.sequence || null,
    p_transparency: event.transparency || null,
    p_event_type: event.eventType || null,
    p_raw_data: JSON.stringify(event)
  };
};
