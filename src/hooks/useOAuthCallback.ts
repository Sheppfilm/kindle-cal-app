
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOAuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.provider_token) {
          console.log('OAuth callback - storing tokens');
          
          // Store the provider tokens in the profiles table
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              google_access_token: session.provider_token,
              google_refresh_token: session.provider_refresh_token,
              updated_at: new Date().toISOString(),
            });

          if (error) {
            console.error('Error storing OAuth tokens:', error);
          }
        }
      });

      return () => subscription.unsubscribe();
    };

    handleAuthCallback();
  }, []);
};
