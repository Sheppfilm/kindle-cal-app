
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('No user found')
    }

    const { userId } = await req.json()

    if (userId !== user.id) {
      throw new Error('Unauthorized')
    }

    // Get user's Google tokens from profiles
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('google_access_token, google_refresh_token, google_sync_token')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.google_access_token) {
      throw new Error('Google Calendar not connected')
    }

    // Fetch events from Google Calendar API
    const params = new URLSearchParams({
      maxResults: '250',
      singleEvents: 'true',
      orderBy: 'startTime',
    })

    if (profile.google_sync_token) {
      params.set('syncToken', profile.google_sync_token)
    } else {
      params.set('timeMin', new Date().toISOString())
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${profile.google_access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`)
    }

    const data = await response.json()
    const events = data.items || []
    let syncedCount = 0

    // Process each event
    for (const event of events) {
      if (event.status === 'cancelled') {
        // Delete cancelled events
        await supabaseClient
          .from('calendar_events')
          .delete()
          .eq('user_id', user.id)
          .eq('google_event_id', event.id)
      } else {
        // Upsert active events
        const startTime = event.start?.dateTime || event.start?.date
        const endTime = event.end?.dateTime || event.end?.date
        const isAllDay = !event.start?.dateTime

        const eventData = {
          p_user_id: user.id,
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
          p_raw_data: JSON.stringify(event),
        }

        await supabaseClient.rpc('upsert_calendar_event', eventData)
        syncedCount++
      }
    }

    // Update sync token and last sync time
    if (data.nextSyncToken) {
      await supabaseClient
        .from('profiles')
        .update({
          google_sync_token: data.nextSyncToken,
          last_sync: new Date().toISOString(),
        })
        .eq('id', user.id)
    }

    return new Response(
      JSON.stringify({ success: true, count: syncedCount }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error syncing calendar:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
