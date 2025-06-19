
-- Drop the existing users table and calendar_events table to start fresh
DROP TABLE IF EXISTS public.calendar_events CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop the upsert function since it references the old table structure
DROP FUNCTION IF EXISTS public.upsert_calendar_event CASCADE;

-- Create calendar_events table that references auth.users directly
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, google_event_id)
);

-- Create profiles table to store additional user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  google_access_token TEXT,
  google_refresh_token TEXT,
  google_sync_token TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for calendar_events
CREATE POLICY "Users can view their own events" ON public.calendar_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" ON public.calendar_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON public.calendar_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON public.calendar_events
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate the upsert function for the new table structure
CREATE OR REPLACE FUNCTION upsert_calendar_event(
  p_user_id UUID,
  p_google_event_id TEXT,
  p_title TEXT,
  p_description TEXT,
  p_start_time TIMESTAMP WITH TIME ZONE,
  p_end_time TIMESTAMP WITH TIME ZONE,
  p_location TEXT,
  p_all_day BOOLEAN,
  p_recurrence TEXT[],
  p_status TEXT,
  p_visibility TEXT,
  p_creator_email TEXT,
  p_creator_name TEXT,
  p_organizer_email TEXT,
  p_organizer_name TEXT,
  p_attendees JSONB,
  p_conference_data JSONB,
  p_hangout_link TEXT,
  p_html_link TEXT,
  p_ical_uid TEXT,
  p_kind TEXT,
  p_sequence INTEGER,
  p_transparency TEXT,
  p_event_type TEXT,
  p_raw_data JSONB
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO calendar_events (
    user_id, google_event_id, title, description, start_time, end_time,
    location, all_day, recurrence, status, visibility, creator_email,
    creator_name, organizer_email, organizer_name, attendees, conference_data,
    hangout_link, html_link, ical_uid, kind, sequence, transparency,
    event_type, raw_data, updated_at
  ) VALUES (
    p_user_id, p_google_event_id, p_title, p_description, p_start_time, p_end_time,
    p_location, p_all_day, p_recurrence, p_status, p_visibility, p_creator_email,
    p_creator_name, p_organizer_email, p_organizer_name, p_attendees, p_conference_data,
    p_hangout_link, p_html_link, p_ical_uid, p_kind, p_sequence, p_transparency,
    p_event_type, p_raw_data, now()
  )
  ON CONFLICT (user_id, google_event_id) 
  DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    location = EXCLUDED.location,
    all_day = EXCLUDED.all_day,
    recurrence = EXCLUDED.recurrence,
    status = EXCLUDED.status,
    visibility = EXCLUDED.visibility,
    creator_email = EXCLUDED.creator_email,
    creator_name = EXCLUDED.creator_name,
    organizer_email = EXCLUDED.organizer_email,
    organizer_name = EXCLUDED.organizer_name,
    attendees = EXCLUDED.attendees,
    conference_data = EXCLUDED.conference_data,
    hangout_link = EXCLUDED.hangout_link,
    html_link = EXCLUDED.html_link,
    ical_uid = EXCLUDED.ical_uid,
    kind = EXCLUDED.kind,
    sequence = EXCLUDED.sequence,
    transparency = EXCLUDED.transparency,
    event_type = EXCLUDED.event_type,
    raw_data = EXCLUDED.raw_data,
    updated_at = now()
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
