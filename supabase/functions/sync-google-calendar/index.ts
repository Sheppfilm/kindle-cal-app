
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

    console.log('User found:', user.email)

    // First, check if we have stored tokens in the profiles table
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('google_access_token, google_refresh_token')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw new Error('Failed to fetch user profile')
    }

    let provider_token = profile?.google_access_token
    let provider_refresh_token = profile?.google_refresh_token

    console.log('Stored tokens - Access token exists:', !!provider_token)
    console.log('Stored tokens - Refresh token exists:', !!provider_refresh_token)

    if (!provider_token) {
      throw new Error('Google Calendar not connected. Please sign out and sign in again with Google to grant calendar access.')
    }

    // Test the token by making a simple API call first
    console.log('Testing Google API access...')
    let testResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: {
          Authorization: `Bearer ${provider_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // If token is expired, try to refresh it
    if (testResponse.status === 401 && provider_refresh_token) {
      console.log('Access token expired, attempting to refresh...')
      
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
          refresh_token: provider_refresh_token,
          grant_type: 'refresh_token',
        }),
      })

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        provider_token = refreshData.access_token
        
        // Update the stored token
        await supabaseClient
          .from('profiles')
          .update({ google_access_token: provider_token })
          .eq('id', user.id)

        console.log('Token refreshed successfully')
        
        // Test again with new token
        testResponse = await fetch(
          'https://www.googleapis.com/calendar/v3/users/me/calendarList',
          {
            headers: {
              Authorization: `Bearer ${provider_token}`,
              'Content-Type': 'application/json',
            },
          }
        )
      } else {
        console.error('Failed to refresh token:', await refreshResponse.text())
        throw new Error('Google access token has expired and could not be refreshed. Please sign out and sign in again.')
      }
    }

    if (!testResponse.ok) {
      const errorText = await testResponse.text()
      console.error('Google API test failed:', testResponse.status, errorText)
      
      if (testResponse.status === 401) {
        throw new Error('Google access token has expired. Please sign out and sign in again to refresh your connection.')
      }
      
      throw new Error(`Google Calendar API error: ${testResponse.status} - ${errorText}`)
    }

    console.log('Google API access test successful')

    // Fetch events from Google Calendar API
    const params = new URLSearchParams({
      maxResults: '250',
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin: new Date().toISOString(),
    })

    console.log('Fetching calendar events...')

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${provider_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Calendar API error:', response.status, errorText)
      throw new Error(`Google Calendar API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const events = data.items || []
    let syncedCount = 0

    console.log('Found events:', events.length)

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

    // Update last sync time
    await supabaseClient
      .from('profiles')
      .update({
        last_sync: new Date().toISOString(),
      })
      .eq('id', user.id)

    console.log('Sync completed:', syncedCount, 'events')

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
