
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.readonly',
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) throw error;
      
      // The redirect will handle the success case
    } catch (error: any) {
      setError(error.message || 'An error occurred during authentication');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      fontFamily: 'monospace'
    }}>
      <Card className="w-full max-w-md border-2 border-black">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-mono tracking-widest">
            CALENDAR
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            Sign in with Google to access your calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-500">
              <AlertDescription className="font-mono text-xs text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-gray-800 font-mono"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                SIGNING IN WITH GOOGLE...
              </>
            ) : (
              'SIGN IN WITH GOOGLE'
            )}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs font-mono text-gray-600">
              This will allow the app to read your Google Calendar events
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
