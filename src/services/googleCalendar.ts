
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
    console.log('Initializing Google API with client ID:', clientId.substring(0, 20) + '...');
    
    if (this.isGapiInitialized) {
      console.log('Google API already initialized');
      return;
    }

    try {
      // Load Google API script if not already loaded
      if (!window.gapi) {
        console.log('Loading Google API script...');
        await this.loadGoogleApiScript();
      }

      // Wait for gapi to be ready
      await new Promise<void>((resolve, reject) => {
        const checkGapi = () => {
          if (window.gapi && window.gapi.load) {
            resolve();
          } else {
            setTimeout(checkGapi, 100);
          }
        };
        checkGapi();
        
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Google API script timeout')), 10000);
      });

      console.log('Loading Google API modules...');
      
      // Load required modules
      await new Promise<void>((resolve, reject) => {
        window.gapi.load('auth2:client', {
          callback: resolve,
          onerror: () => reject(new Error('Failed to load Google API modules'))
        });
      });

      console.log('Initializing Google API client...');

      // Initialize the client
      await window.gapi.client.init({
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
      });

      this.isGapiInitialized = true;
      console.log('Google API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google API:', error);
      this.isGapiInitialized = false;
      throw new Error(`Google API initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static loadGoogleApiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google API script loaded');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google API script:', error);
        reject(new Error('Failed to load Google API script'));
      };
      
      document.head.appendChild(script);
    });
  }

  static isSignedIn(): boolean {
    if (!this.isGapiInitialized || !window.gapi?.auth2) {
      console.log('Google API not initialized or auth2 not available');
      return false;
    }
    
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const isSignedIn = authInstance?.isSignedIn?.get() || false;
      console.log('Google sign-in status:', isSignedIn);
      return isSignedIn;
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      return false;
    }
  }

  static async signIn(): Promise<{ access_token: string; refresh_token?: string }> {
    if (!this.isGapiInitialized) {
      throw new Error('Google API not initialized');
    }

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      const authResponse = user.getAuthResponse();

      console.log('Google sign-in successful');
      return {
        access_token: authResponse.access_token,
        refresh_token: authResponse.refresh_token
      };
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw new Error(`Sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async signOut(): Promise<void> {
    if (!this.isGapiInitialized) return;

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      console.log('Google sign-out successful');
    } catch (error) {
      console.error('Google sign-out failed:', error);
      throw error;
    }
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
