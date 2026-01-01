-- ============================================
-- TEMPORARILY DISABLE RLS FOR TESTING
-- ============================================
-- This will help us confirm if RLS is the issue
-- If comments work with RLS disabled, we know it's a policy problem

-- Disable RLS temporarily
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes DISABLE ROW LEVEL SECURITY;

-- Test: Try posting a comment in your app now
-- If it works, the issue is with the RLS policy
-- If it still fails, the issue is elsewhere

-- To re-enable RLS later, run:
/*
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
*/


