
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

    // Get the current user and session
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('No user found')
    }

    console.log('User found:', user.email)
    console.log('User app_metadata:', JSON.stringify(user.app_metadata, null, 2))
    console.log('User user_metadata:', JSON.stringify(user.user_metadata, null, 2))

    // Check if there are any identities with provider data
    console.log('User identities:', JSON.stringify(user.identities, null, 2))

    // Try to get tokens from session instead
    const { data: { session } } = await supabaseClient.auth.getSession()
    console.log('Session provider_token:', session?.provider_token)
    console.log('Session provider_refresh_token:', session?.provider_refresh_token)

    // Try different ways to get the Google access token
    let provider_token = session?.provider_token || user.app_metadata?.provider_token
    let provider_refresh_token = session?.provider_refresh_token || user.app_metadata?.provider_refresh_token

    // If not in app_metadata, try user_metadata
    if (!provider_token) {
      provider_token = user.user_metadata?.provider_token
      provider_refresh_token = user.user_metadata?.provider_refresh_token
    }

    // Try to get from providers array
    if (!provider_token && user.app_metadata?.providers) {
      const googleProvider = user.app_metadata.providers.find((p: any) => p.provider === 'google')
      if (googleProvider) {
        provider_token = googleProvider.access_token
        provider_refresh_token = googleProvider.refresh_token
      }
    }

    // Try to get from identities
    if (!provider_token && user.identities) {
      const googleIdentity = user.identities.find((identity: any) => identity.provider === 'google')
      if (googleIdentity) {
        console.log('Google identity found:', JSON.stringify(googleIdentity, null, 2))
        // Some OAuth providers store tokens in identity_data
        if (googleIdentity.identity_data) {
          provider_token = googleIdentity.identity_data.access_token
          provider_refresh_token = googleIdentity.identity_data.refresh_token
        }
      }
    }

    console.log('Provider token exists:', !!provider_token)
    console.log('Provider refresh token exists:', !!provider_refresh_token)

    if (!provider_token) {
      // Check if user has existing tokens in profile
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('google_access_token, google_refresh_token')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.google_access_token) {
        provider_token = profile.google_access_token
        provider_refresh_token = profile.google_refresh_token
        console.log('Using tokens from profile')
      }
    }

    if (!provider_token) {
      throw new Error('Google Calendar not connected - no access token found. Please sign out and sign in again with Google to refresh your tokens.')
    }

    // Update the user's profile with the Google tokens
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name,
        google_access_token: provider_token,
        google_refresh_token: provider_refresh_token,
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Profile update error:', profileError)
    }

    // Test the token by making a simple API call first
    console.log('Testing Google API access...')
    const testResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: {
          Authorization: `Bearer ${provider_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

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
