
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CalendarEvent {
  id: string;
  user_id: string;
  google_event_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  all_day: boolean;
  recurrence?: string[];
  status?: string;
  visibility?: string;
  creator_email?: string;
  creator_name?: string;
  organizer_email?: string;
  organizer_name?: string;
  attendees?: any;
  conference_data?: any;
  hangout_link?: string;
  html_link?: string;
  ical_uid?: string;
  kind?: string;
  sequence?: number;
  transparency?: string;
  event_type?: string;
  raw_data?: any;
  created_at: string;
  updated_at: string;
}

export const useCalendarEvents = () => {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: async (): Promise<CalendarEvent[]> => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching calendar events:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single();

      if (error) {
        console.error('Error creating calendar event:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
  });
};
