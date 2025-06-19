
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
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
  recurrence?: string[];
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
  conferenceData?: any;
  hangoutLink?: string;
  htmlLink?: string;
  iCalUID?: string;
  kind?: string;
  sequence?: number;
  transparency?: string;
  eventType?: string;
}

export class GoogleCalendarService {
  private static readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  private static readonly SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  static async initializeGapi(clientId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.gapi) {
        reject(new Error('Google API not loaded'));
        return;
      }

      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            discoveryDocs: [this.DISCOVERY_DOC],
            clientId: clientId,
            scope: this.SCOPES
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  static async signIn(): Promise<any> {
    const authInstance = window.gapi.auth2.getAuthInstance();
    const user = await authInstance.signIn();
    return user.getAuthResponse();
  }

  static async signOut(): Promise<void> {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
  }

  static isSignedIn(): boolean {
    if (typeof window === 'undefined' || !window.gapi?.auth2) {
      return false;
    }
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance?.isSignedIn?.get() || false;
  }

  static async getCalendarEvents(
    accessToken: string,
    calendarId: string = 'primary',
    timeMin?: string,
    timeMax?: string,
    syncToken?: string
  ): Promise<{ events: GoogleCalendarEvent[]; nextSyncToken?: string }> {
    const params = new URLSearchParams({
      access_token: accessToken,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250'
    });

    if (timeMin) params.append('timeMin', timeMin);
    if (timeMax) params.append('timeMax', timeMax);
    if (syncToken) params.append('syncToken', syncToken);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`
    );

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      events: data.items || [],
      nextSyncToken: data.nextSyncToken
    };
  }

  static async refreshAccessToken(refreshToken: string, clientId: string, clientSecret: string): Promise<string> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    return data.access_token;
  }
}

// Add Google API types to window
declare global {
  interface Window {
    gapi: any;
  }
}
