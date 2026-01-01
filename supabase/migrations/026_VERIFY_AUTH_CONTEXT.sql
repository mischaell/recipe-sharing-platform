-- ============================================
-- VERIFY AUTHENTICATION CONTEXT
-- ============================================
-- This will help us understand if the user is authenticated
-- when the insert happens

-- Check current role (should be 'authenticated' when logged in)
SELECT 
  current_user as current_role,
  session_user as session_role;

-- Check if we can see auth.uid() (should show user ID when authenticated)
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- Test: Try to manually insert a comment as authenticated user
-- This will show us if the policy works when we're authenticated
-- (You'll need to be logged in to Supabase dashboard for this to work)

