-- ============================================
-- COMPLETELY DISABLE RLS FOR COMMENTS
-- ============================================
-- This will disable RLS entirely on comments table
-- Use this to test if RLS is the actual problem

-- Disable RLS
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Drop all policies (clean slate)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'comments') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON comments';
    END LOOP;
END $$;

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'comments';

-- Now test posting a comment in your app
-- If it works, RLS was the problem
-- If it still fails, the problem is elsewhere

