
-- Create a function to update or insert calendar events (upsert)
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

-- Add unique constraint to prevent duplicate events per user
ALTER TABLE calendar_events ADD CONSTRAINT unique_user_google_event 
UNIQUE (user_id, google_event_id);

-- Update the users table to store Google Calendar sync tokens
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sync_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_calendar_watch_channel_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_calendar_watch_resource_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_calendar_watch_expiration TIMESTAMP WITH TIME ZONE;
