
-- First, let's add the missing columns to the existing users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS google_client_id TEXT;

-- Enable Row Level Security on existing users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (these will only be created if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" 
        ON public.users 
        FOR SELECT 
        USING (auth.uid()::text = id::text);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" 
        ON public.users 
        FOR UPDATE 
        USING (auth.uid()::text = id::text);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" 
        ON public.users 
        FOR INSERT 
        WITH CHECK (auth.uid()::text = id::text);
    END IF;
END $$;

-- Update calendar_events foreign key to reference the existing users table
ALTER TABLE public.calendar_events 
DROP CONSTRAINT IF EXISTS calendar_events_user_id_fkey;

ALTER TABLE public.calendar_events 
ADD CONSTRAINT calendar_events_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
