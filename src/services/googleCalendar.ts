
// Google Calendar API service
export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  status?: string;
  visibility?: string;
  creator?: {
    email?: string;
    displayName?: string;
  };
  organizer?: {
    email?: string;
    displayName?: string;
  };
  attendees?: Array<{
    email?: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  recurrence?: string[];
  conferenceData?: any;
  hangoutLink?: string;
  htmlLink?: string;
  iCalUID?: string;
  kind?: string;
  sequence?: number;
  transparency?: string;
  eventType?: string;
}

export interface GoogleCalendarEventsResponse {
  events: GoogleCalendarEvent[];
  nextSyncToken?: string;
  nextPageToken?: string;
}

export class GoogleCalendarService {
  private static isGapiLoaded = false;
  private static isGapiInitialized = false;

  static async initializeGapi(clientId: string): Promise<void> {
    if (this.isGapiInitialized) return;

    return new Promise((resolve, reject) => {
      if (!window.gapi) {
        reject(new Error('Google API not loaded'));
        return;
      }

      window.gapi.load('auth2:client', async () => {
        try {
          await window.gapi.client.init({
            clientId: clientId,
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
          });

          this.isGapiInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  static isSignedIn(): boolean {
    if (!this.isGapiInitialized || !window.gapi?.auth2) return false;
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance?.isSignedIn?.get() || false;
  }

  static async signIn(): Promise<{ access_token: string; refresh_token?: string }> {
    if (!this.isGapiInitialized) {
      throw new Error('Google API not initialized');
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    const user = await authInstance.signIn();
    const authResponse = user.getAuthResponse();

    return {
      access_token: authResponse.access_token,
      refresh_token: authResponse.refresh_token
    };
  }

  static async signOut(): Promise<void> {
    if (!this.isGapiInitialized) return;

    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
  }

  static async getCalendarEvents(
    accessToken: string,
    calendarId: string = 'primary',
    timeMin?: string,
    timeMax?: string,
    syncToken?: string
  ): Promise<GoogleCalendarEventsResponse> {
    const params: any = {
      calendarId,
      maxResults: 250,
      singleEvents: true,
      orderBy: 'startTime'
    };

    if (syncToken) {
      params.syncToken = syncToken;
    } else {
      params.timeMin = timeMin || new Date().toISOString();
      if (timeMax) {
        params.timeMax = timeMax;
      }
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      new URLSearchParams(params).toString(),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      events: data.items || [],
      nextSyncToken: data.nextSyncToken,
      nextPageToken: data.nextPageToken
    };
  }
}

// Extend the Window interface to include gapi
declare global {
  interface Window {
    gapi: any;
  }
}
