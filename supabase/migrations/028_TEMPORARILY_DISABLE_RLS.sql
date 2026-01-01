-- ============================================
-- TEMPORARILY DISABLE RLS TO TEST
-- ============================================
-- This will help us confirm if RLS is the actual problem

ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'comments';

-- Now test posting a comment in your app
-- If it works, RLS was definitely the problem
-- If it still fails, the problem is elsewhere (not RLS)


