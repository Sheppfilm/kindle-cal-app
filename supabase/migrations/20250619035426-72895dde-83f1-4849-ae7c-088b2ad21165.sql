
-- Create a simple users table for basic authentication
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  google_access_token TEXT,
  google_refresh_token TEXT,
  google_calendar_id TEXT,
  google_timezone TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create the calendar_events table with all Google Calendar event data
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  google_event_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  all_day BOOLEAN DEFAULT FALSE,
  recurrence TEXT[],
  status TEXT,
  visibility TEXT,
  creator_email TEXT,
  creator_name TEXT,
  organizer_email TEXT,
  organizer_name TEXT,
  attendees JSONB,
  conference_data JSONB,
  hangout_link TEXT,
  html_link TEXT,
  ical_uid TEXT,
  kind TEXT,
  sequence INTEGER,
  transparency TEXT,
  event_type TEXT,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (basic setup)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Simple policies - users can only see their own data
CREATE POLICY "Users can view their own data" ON public.users
  FOR ALL USING (id = auth.uid());

CREATE POLICY "Users can view their own events" ON public.calendar_events
  FOR ALL USING (user_id = auth.uid());
